import chalk from 'chalk';
import semver from 'semver';
import fs from 'fs-extra';
import path from 'node:path';
import net from 'node:net';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { logger } from '../utils/logger.js';

const execAsync = promisify(exec);
const isWindows = process.platform === 'win32';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Run a shell command, returning stdout/stderr and a success flag.
 * Never throws.
 * @param {string} cmd
 * @returns {Promise<{ success: boolean, stdout: string, stderr: string, error?: string }>}
 */
async function run(cmd) {
  try {
    const { stdout, stderr } = await execAsync(cmd, { timeout: 10_000 });
    return { success: true, stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (err) {
    return { success: false, stdout: '', stderr: '', error: err.message };
  }
}

/**
 * Test whether a TCP port is free by attempting to bind to it.
 * Releases the server immediately if the bind succeeds.
 * @param {number} port
 * @returns {Promise<boolean>} true = port is free
 */
function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

/**
 * Return the platform-appropriate command to kill a process on a given port.
 * @param {number} port
 * @returns {string}
 */
function killPortCmd(port) {
  if (isWindows) {
    return `Get-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess | Stop-Process  (Run as Administrator)`;
  }
  return `lsof -ti:${port} | xargs kill -9 2>/dev/null || true`;
}

/**
 * Parse a .env-style file into a Map<key, value>.
 * Handles quoted values and strips comments.
 * @param {string} content
 * @returns {Map<string, string>}
 */
function parseEnv(content) {
  const map = new Map();
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const raw = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    const value = raw.replace(/^["']|["']$/g, '');
    map.set(key, value);
  }
  return map;
}

/** Values that count as "not configured" in a .env file */
const PLACEHOLDERS = new Set([
  '',
  'your_value_here',
  'your-value-here',
  'replace_me',
  'replaceme',
  'xxx',
  'changeme',
  'change_me',
  'todo',
  'placeholder',
  'your_secret',
  'your_key',
  'add_your_key_here',
]);

/**
 * Returns true if a .env value looks like an unfilled placeholder.
 * @param {string|undefined} value
 * @returns {boolean}
 */
function isPlaceholder(value) {
  if (!value) return true;
  const lower = value.toLowerCase();
  return (
    PLACEHOLDERS.has(lower) ||
    lower.startsWith('your_') ||
    lower.startsWith('your-') ||
    lower === 'null' ||
    lower === 'undefined'
  );
}

// ── Check result type ─────────────────────────────────────────────────────────

/**
 * @typedef {{ passed: boolean, label: string, fix?: string, isWarning?: boolean }} CheckResult
 */

// ── Individual checks ─────────────────────────────────────────────────────────

/** @param {string} cwd @returns {Promise<CheckResult>} */
async function checkNodeVersion(cwd) {
  let required = '>=18.0.0';
  try {
    const pkg = await fs.readJson(path.join(cwd, 'package.json'));
    required = pkg?.engines?.node || required;
  } catch { /* no package.json — use default */ }

  const current = process.version;
  const passes = semver.satisfies(current, required);
  return {
    passed: passes,
    label: passes
      ? `Node.js ${current} — OK`
      : `Node.js ${current} found, ${required} required`,
    fix: passes ? undefined : 'Run: nvm install 18 && nvm use 18',
  };
}

/** @returns {Promise<CheckResult>} */
async function checkDockerInstalled() {
  const result = await run('docker --version');
  const version = result.stdout.match(/Docker version ([\d.]+)/)?.[1] ?? '';
  return {
    passed: result.success,
    label: result.success
      ? `Docker ${version} — installed`
      : 'Docker CLI not found or not in PATH',
    fix: result.success
      ? undefined
      : 'Install Docker Desktop: https://docs.docker.com/get-docker/',
  };
}

/** @returns {Promise<CheckResult>} */
async function checkDockerRunning() {
  const result = await run('docker info');
  return {
    passed: result.success,
    label: result.success ? 'Docker daemon — running' : 'Docker daemon not running',
    fix: result.success
      ? undefined
      : isWindows
        ? 'Open Docker Desktop and wait for it to start'
        : 'Run: sudo systemctl start docker',
  };
}

/**
 * @param {string} cwd
 * @returns {Promise<CheckResult[]>}
 */
async function checkPorts(cwd) {
  let ports = [3000, 5432, 6379]; // sensible defaults
  try {
    const kitJson = await fs.readJson(path.join(cwd, 'kit.json'));
    if (Array.isArray(kitJson.required_ports) && kitJson.required_ports.length > 0) {
      ports = kitJson.required_ports;
    }
  } catch { /* no kit.json — use defaults */ }

  const results = [];
  for (const port of ports) {
    const free = await isPortFree(port);
    results.push({
      passed: free,
      label: free ? `Port ${port} — available` : `Port ${port} — in use`,
      fix: free ? undefined : killPortCmd(port),
    });
  }
  return results;
}

/** @param {string} cwd @returns {Promise<CheckResult>} */
async function checkEnvExists(cwd) {
  const exists = await fs.pathExists(path.join(cwd, '.env'));
  return {
    passed: exists,
    isWarning: !exists,
    label: exists ? '.env file found' : '.env file missing',
    fix: exists ? undefined : 'Run: cp .env.example .env — then fill in your credentials',
  };
}

/**
 * Check that all variables in .env.example are set (non-placeholder) in .env.
 * Only runs if .env exists.
 * @param {string} cwd
 * @returns {Promise<CheckResult|null>} null if .env doesn't exist
 */
async function checkEnvVars(cwd) {
  const envPath = path.join(cwd, '.env');
  const examplePath = path.join(cwd, '.env.example');

  if (!(await fs.pathExists(envPath))) return null;
  if (!(await fs.pathExists(examplePath))) return null;

  try {
    const envContent = await fs.readFile(envPath, 'utf8');
    const exampleContent = await fs.readFile(examplePath, 'utf8');
    const envMap = parseEnv(envContent);
    const exampleMap = parseEnv(exampleContent);

    const missing = [];
    for (const [key] of exampleMap) {
      if (isPlaceholder(envMap.get(key))) missing.push(key);
    }

    const total = exampleMap.size;
    return {
      passed: missing.length === 0,
      isWarning: missing.length > 0,
      label:
        missing.length === 0
          ? `All ${total} environment variables configured`
          : `${missing.length} variable${missing.length !== 1 ? 's' : ''} not configured: ${
              missing.slice(0, 3).join(', ') + (missing.length > 3 ? `… (+${missing.length - 3} more)` : '')
            }`,
      fix: missing.length > 0 ? 'Open .env and fill in the missing variables' : undefined,
    };
  } catch {
    return null;
  }
}

/** @param {string} cwd @returns {Promise<CheckResult[]>} */
async function checkDependencies(cwd) {
  const results = [];

  // Node deps
  const pkgPath = path.join(cwd, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    const nodeModules = path.join(cwd, 'node_modules');
    const exists = await fs.pathExists(nodeModules);
    results.push({
      passed: exists,
      isWarning: !exists,
      label: exists ? 'Node dependencies installed' : 'node_modules not found',
      fix: exists ? undefined : 'Run: npm install',
    });
  }

  // Python deps
  const reqsPath = path.join(cwd, 'requirements.txt');
  if (await fs.pathExists(reqsPath)) {
    const venvExists =
      (await fs.pathExists(path.join(cwd, '.venv'))) ||
      (await fs.pathExists(path.join(cwd, 'venv')));
    results.push({
      passed: venvExists,
      isWarning: !venvExists,
      label: venvExists ? 'Python dependencies installed' : 'Python venv not found',
      fix: venvExists
        ? undefined
        : 'Run: python -m venv .venv && ' +
          (isWindows ? '.venv\\Scripts\\activate' : 'source .venv/bin/activate') +
          ' && pip install -r requirements.txt',
    });
  }

  return results;
}

// ── Safe auto-fixes ───────────────────────────────────────────────────────────

/**
 * Apply safe, non-destructive fixes automatically.
 * @param {string} cwd
 */
async function applyFixes(cwd) {
  console.log('');
  console.log(chalk.bold.cyan('  Applying safe auto-fixes...\n'));
  let anyFixed = false;

  // Fix: npm install
  const pkgPath = path.join(cwd, 'package.json');
  const nodeModules = path.join(cwd, 'node_modules');
  if ((await fs.pathExists(pkgPath)) && !(await fs.pathExists(nodeModules))) {
    logger.info('Running npm install...');
    const result = await run('npm install');
    if (result.success) {
      logger.success('npm install complete');
    } else {
      logger.error(`npm install failed: ${result.error}`);
    }
    anyFixed = true;
  }

  // Fix: cp .env.example .env
  const envPath = path.join(cwd, '.env');
  const examplePath = path.join(cwd, '.env.example');
  if ((await fs.pathExists(examplePath)) && !(await fs.pathExists(envPath))) {
    await fs.copy(examplePath, envPath);
    logger.success('.env created from .env.example — fill in your credentials');
    anyFixed = true;
  }

  if (!anyFixed) {
    logger.info('No safe auto-fixes available for the remaining issues.');
    logger.step('Apply the manual fixes listed above and re-run `openenv doctor`.');
  } else {
    console.log('');
    logger.info('Re-run `openenv doctor` to check remaining issues.');
  }
}

// ── Main command ──────────────────────────────────────────────────────────────

/**
 * Run the `openenv doctor` command.
 * Runs all environment checks in order and prints a formatted report.
 *
 * @param {{ fix?: boolean }} options
 */
export async function doctorCommand(options) {
  const cwd = process.cwd();

  // Detect kit name from kit.json if present
  let kitName = path.basename(cwd);
  try {
    const kitJson = await fs.readJson(path.join(cwd, 'kit.json'));
    kitName = kitJson.name || kitName;
  } catch { /* not a kit directory — that's fine */ }

  console.log('');
  console.log(chalk.bold.white('  openenv doctor — Environment Check'));
  console.log(chalk.dim('  ' + '═'.repeat(39)));
  console.log('');
  console.log(chalk.dim(`  Checking environment for: ${chalk.white(kitName)}`));
  console.log('');

  // ── Gather all checks ──────────────────────────────────────────────────────
  const allChecks = /** @type {CheckResult[]} */ ([]);

  allChecks.push(await checkNodeVersion(cwd));
  allChecks.push(await checkDockerInstalled());
  allChecks.push(await checkDockerRunning());

  const portChecks = await checkPorts(cwd);
  allChecks.push(...portChecks);

  const envExistsCheck = await checkEnvExists(cwd);
  allChecks.push(envExistsCheck);

  const envVarsCheck = await checkEnvVars(cwd);
  if (envVarsCheck) allChecks.push(envVarsCheck);

  const depChecks = await checkDependencies(cwd);
  allChecks.push(...depChecks);

  // ── Print results ──────────────────────────────────────────────────────────
  let passed = 0;

  for (const check of allChecks) {
    if (check.passed) {
      passed++;
      console.log(chalk.green(`  ✓ ${check.label}`));
    } else if (check.isWarning) {
      console.log(chalk.yellow(`  ⚠ ${check.label}`));
      if (check.fix) console.log(chalk.dim(`    → ${check.fix}`));
    } else {
      console.log(chalk.red(`  ✗ ${check.label}`));
      if (check.fix) console.log(chalk.dim(`    → Fix: ${check.fix}`));
    }
  }

  const total = allChecks.length;
  const failed = total - passed;

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('');
  console.log(chalk.dim('  ' + '═'.repeat(39)));

  if (failed === 0) {
    console.log(chalk.bold.green(`  ✓ All ${total} checks passed. You're good to go!`));
    console.log(chalk.dim('  Run: ./setup.sh'));
  } else {
    console.log(chalk.bold(`  Score: ${chalk.green(passed)}/${total} checks passed`));
    console.log('');
    console.log(chalk.yellow(`  Issues found: ${failed}`));
    console.log(chalk.dim(`  Run the fixes above, then run \`openenv doctor\` again.`));
  }

  console.log('');

  // ── Auto-fix mode ──────────────────────────────────────────────────────────
  if (options.fix && failed > 0) {
    await applyFixes(cwd);
  }

  // Exit with code 1 if any hard failures (not warnings)
  const hardFailures = allChecks.filter((c) => !c.passed && !c.isWarning).length;
  if (hardFailures > 0) process.exit(1);
}
