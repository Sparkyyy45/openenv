import chalk from 'chalk';
import ora from 'ora';
import { fetchRegistry } from '../utils/registry.js';
import { logger } from '../utils/logger.js';

/**
 * Format kit tags as dim bracketed chips.
 * @param {string[]} tags
 * @returns {string}
 */
function formatTags(tags) {
  return tags
    .slice(0, 5)
    .map((t) => chalk.dim(`[${t}]`))
    .join(' ');
}

/**
 * Format the verified status badge.
 * @param {boolean} verified
 * @returns {string}
 */
function formatVerified(verified) {
  return verified ? chalk.green('✓ verified') : chalk.yellow('⚠ unverified');
}

/**
 * Truncate a string to maxLen, adding ellipsis if needed.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
function trunc(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen - 3) + '...' : str;
}

/**
 * Run the `openenv list` command.
 *
 * @param {{ tag?: string, json?: boolean }} options
 */
export async function listCommand(options) {
  const spinner = ora({ text: 'Fetching kit registry...', color: 'cyan' }).start();

  let kits;
  let usingFallback = false;

  try {
    kits = await fetchRegistry();
    spinner.succeed(chalk.green('Registry loaded'));
  } catch (err) {
    spinner.warn(chalk.yellow('Could not reach registry. Using bundled version.'));
    kits = [];
    usingFallback = true;
  }

  // Filter by tag if provided
  if (options.tag) {
    kits = kits.filter((k) => k.tags.includes(options.tag));
  }

  // JSON output for scripting
  if (options.json) {
    console.log(JSON.stringify(kits, null, 2));
    return;
  }

  console.log('');

  if (kits.length === 0) {
    logger.warn(
      options.tag
        ? `No kits found with tag "${chalk.white(options.tag)}". Try ${chalk.cyan('openenv list')} to see all tags.`
        : 'No kits found in registry.'
    );
    return;
  }

  // ── Table header ────────────────────────────────────────────────────────────
  const NAME_W = 42;
  const DESC_W = 52;

  console.log(
    chalk.bold('  ' + 'KIT NAME'.padEnd(NAME_W)) +
      chalk.bold('DESCRIPTION'.padEnd(DESC_W)) +
      chalk.bold('STATUS')
  );
  console.log(chalk.dim('  ' + '─'.repeat(NAME_W + DESC_W + 12)));

  // ── Rows ────────────────────────────────────────────────────────────────────
  for (const kit of kits) {
    const name = chalk.cyan(kit.name.padEnd(NAME_W));
    const desc = chalk.white(trunc(kit.description, DESC_W).padEnd(DESC_W));
    const status = formatVerified(kit.verified);

    console.log(`  ${name}${desc}${status}`);
    console.log(`  ${''.padEnd(NAME_W)}${formatTags(kit.tags)}`);
    console.log('');
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  console.log(chalk.dim('  ' + '─'.repeat(NAME_W + DESC_W + 12)));
  console.log(
    `  ${chalk.bold.cyan(`${kits.length} kit${kits.length !== 1 ? 's' : ''} available`)}` +
      chalk.dim(' — run ') +
      chalk.white('openenv init <kit-name>') +
      chalk.dim(' to get started')
  );
  console.log('');

  if (usingFallback) {
    logger.warn('Showing bundled registry. Connect to the internet for the latest kits.');
  }
}
