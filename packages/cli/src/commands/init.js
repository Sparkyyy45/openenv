import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import boxen from 'boxen';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { simpleGit } from 'simple-git';
import { fetchRegistry, findKit } from '../utils/registry.js';
import { logger } from '../utils/logger.js';

/**
 * Print the post-init success box.
 * @param {string} kitName
 * @param {string} targetDir
 */
function printSuccessBox(kitName, targetDir) {
  const dirName = path.relative(process.cwd(), targetDir) || kitName;
  const content = [
    chalk.bold.green(`✓ Kit initialized: ${kitName}`),
    '',
    chalk.bold('Next steps:'),
    `  ${chalk.cyan(`cd ${dirName}`)}`,
    `  ${chalk.cyan('cp .env.example .env')}   ${chalk.dim('(fill in your credentials)')}`,
    `  ${chalk.cyan('openenv doctor')}         ${chalk.dim('(verify your environment)')}`,
    `  ${chalk.cyan('./setup.sh')}             ${chalk.dim('(start everything)')}`,
    '',
    chalk.dim(`Docs: https://openenv.dev/kits/${kitName}`),
  ].join('\n');

  console.log(
    boxen(content, {
      padding: { top: 1, bottom: 1, left: 2, right: 2 },
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: 'green',
    })
  );
}

/**
 * Run the `openenv init [kit-name]` command.
 *
 * Flow:
 *  0. If no kit-name given, launch interactive Inquirer picker
 *  1. Look up kit in registry (fuzzy suggestions on miss)
 *  2. Verify kit status (warn + confirm if unverified)
 *  3. Dry-run preview (if --dry-run)
 *  4. Check / confirm target directory
 *  5. Clone from kit.repo into temp dir, copy template_path to target
 *  6. Setup: copy .env.example→.env, remove .git, git init
 *  7. Print success box
 *
 * @param {string|undefined} kitName
 * @param {{ dir?: string, dryRun?: boolean }} options
 */
export async function initCommand(kitName, options) {
  console.log('');

  // ── Step 0: Interactive picker if no kit name ────────────────────────────
  if (!kitName) {
    const loadSpinner = ora({ text: 'Loading available kits...', color: 'cyan' }).start();
    let kits = [];
    try {
      kits = await fetchRegistry();
      loadSpinner.stop();
    } catch {
      loadSpinner.stop();
    }

    if (kits.length === 0) {
      logger.error('No kits available. Check your internet connection.');
      process.exit(1);
    }

    const { selected } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: 'Which kit would you like to initialize?',
        choices: kits.map((k) => ({
          name: `${chalk.cyan(k.name)}  ${chalk.dim('— ' + k.description)}`,
          value: k.name,
        })),
        pageSize: 10,
      },
    ]);
    kitName = selected;
  }

  // ── Step 1: Look up kit in registry ─────────────────────────────────────
  const spinner1 = ora({
    text: `Looking up kit in registry: ${chalk.cyan(kitName)}`,
    color: 'cyan',
  }).start();

  let kit;
  try {
    const { exact, suggestions } = await findKit(kitName);
    if (!exact) {
      spinner1.fail(chalk.red(`Kit '${kitName}' not found in registry.`));
      if (suggestions.length > 0) {
        console.log('');
        logger.info('Did you mean one of these?');
        suggestions.forEach((s) => logger.step(s.name));
      } else {
        logger.step(`Run ${chalk.cyan('openenv list')} to see all available kits.`);
      }
      process.exit(1);
    }
    kit = exact;
    spinner1.succeed(chalk.green(`Found: ${kit.name}  ${chalk.dim('v' + kit.version)}`));
  } catch (err) {
    spinner1.fail(chalk.red(`Registry error: ${err.message}`));
    process.exit(1);
  }

  // ── Step 2: Verify kit status ────────────────────────────────────────────
  if (!kit.verified) {
    console.log('');
    logger.warn(`Kit '${chalk.yellow(kit.name)}' is ${chalk.yellow.bold('unverified')}.`);
    logger.step('Unverified kits have not been reviewed by the openenv team.');

    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'This kit is unverified. Continue?',
        default: false,
      },
    ]);
    if (!proceed) {
      logger.info('Aborted. Choose a verified kit with `openenv list`.');
      process.exit(0);
    }
  } else {
    const ora2 = ora({ text: 'Verifying kit status...', color: 'cyan' }).start();
    ora2.succeed(chalk.green(`Kit verified ✓  (v${kit.version}, ${kit.author})`));
  }

  // ── Resolve target directory ─────────────────────────────────────────────
  const targetDir = path.resolve(options.dir || path.join(process.cwd(), kitName));

  // ── Step 3: Dry-run preview ──────────────────────────────────────────────
  if (options.dryRun) {
    console.log('');
    console.log(chalk.bold.yellow('  DRY RUN — no changes will be made\n'));
    logger.info(`Kit:          ${chalk.cyan(kit.name)}`);
    logger.info(`Clone from:   ${chalk.cyan(kit.repo)}`);
    logger.info(`Template at:  ${chalk.cyan(kit.template_path || 'template')}`);
    logger.info(`Target dir:   ${chalk.cyan(targetDir)}`);
    logger.info(`Will copy:    .env.example → .env`);
    logger.info(`Will run:     git init`);
    logger.info(`Ports needed: ${chalk.cyan((kit.required_ports || []).join(', '))}`);
    console.log('');
    logger.step(`Run without --dry-run to scaffold for real.`);
    return;
  }

  // ── Step 4: Check target directory ──────────────────────────────────────
  if (await fs.pathExists(targetDir)) {
    console.log('');
    logger.warn(`Directory already exists: ${chalk.yellow(targetDir)}`);
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Overwrite existing directory?',
        default: false,
      },
    ]);
    if (!overwrite) {
      logger.info('Aborted.');
      process.exit(0);
    }
    await fs.remove(targetDir);
  }

  // ── Step 5: Clone kit template ───────────────────────────────────────────
  const tempDir = path.join(os.tmpdir(), `openenv-${Date.now()}`);
  const spinner3 = ora({ text: `Cloning kit template...`, color: 'cyan' }).start();

  try {
    const git = simpleGit();
    await git.clone(kit.repo, tempDir, ['--depth=1']);
    spinner3.succeed(chalk.green('Kit template cloned'));
  } catch (err) {
    spinner3.fail(chalk.red('Could not clone kit. Check your internet connection.'));
    logger.step(`Source: ${kit.repo}`);
    logger.step(`Error:  ${err.message}`);
    await fs.remove(tempDir).catch(() => {});
    process.exit(1);
  }

  // ── Step 6: Set up project directory ────────────────────────────────────
  const spinner4 = ora({ text: 'Setting up project...', color: 'cyan' }).start();

  try {
    const templateSrc = path.join(tempDir, kit.template_path || 'template');
    const srcExists = await fs.pathExists(templateSrc);

    if (srcExists) {
      await fs.copy(templateSrc, targetDir);
    } else {
      // Fallback: copy the whole cloned dir (minus .git)
      await fs.copy(tempDir, targetDir, {
        filter: (src) => !src.includes(`${path.sep}.git`),
      });
    }

    // Copy .env.example → .env (never overwrite existing .env)
    const envExample = path.join(targetDir, '.env.example');
    const envFile = path.join(targetDir, '.env');
    if ((await fs.pathExists(envExample)) && !(await fs.pathExists(envFile))) {
      await fs.copy(envExample, envFile);
    }

    // Copy kit.json so openenv doctor knows which ports to check
    await fs.writeJson(path.join(targetDir, 'kit.json'), kit, { spaces: 2 });

    // Remove any .git directory from the copied template
    const copiedGit = path.join(targetDir, '.git');
    if (await fs.pathExists(copiedGit)) {
      await fs.remove(copiedGit);
    }

    // Fresh git init in the new project
    const projectGit = simpleGit(targetDir);
    await projectGit.init();

    // Cleanup temp clone
    await fs.remove(tempDir);

    spinner4.succeed(chalk.green('Project setup complete'));
  } catch (err) {
    spinner4.fail(chalk.red(`Setup failed: ${err.message}`));
    // Clean up partial state
    await fs.remove(tempDir).catch(() => {});
    await fs.remove(targetDir).catch(() => {});
    process.exit(1);
  }

  // ── Done! ────────────────────────────────────────────────────────────────
  printSuccessBox(kitName, targetDir);
}
