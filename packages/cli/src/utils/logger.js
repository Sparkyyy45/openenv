import chalk from 'chalk';
import boxen from 'boxen';

/**
 * Centralized logger with colored, prefixed terminal output.
 */
export const logger = {
  /** Print an informational message in blue */
  info: (msg) => console.log(chalk.blue(`  ${msg}`)),

  /** Print a success message in green with ✓ prefix */
  success: (msg) => console.log(chalk.green(`  ✓ ${msg}`)),

  /** Print a warning message in yellow with ⚠ prefix */
  warn: (msg) => console.log(chalk.yellow(`  ⚠ ${msg}`)),

  /** Print an error message in red with ✗ prefix */
  error: (msg) => console.log(chalk.red(`  ✗ ${msg}`)),

  /** Print a hint/fix step in dim white with → prefix */
  step: (msg) => console.log(chalk.dim(`    → ${msg}`)),

  /** Print a blank line */
  blank: () => console.log(''),

  /** Print dim/muted text */
  dim: (msg) => console.log(chalk.dim(`  ${msg}`)),
};

/**
 * Print the branded openenv header box using boxen.
 * Called at the start of every command.
 */
export function printHeader() {
  const header = boxen(
    chalk.bold.cyan('openenv') +
      chalk.dim('  v0.1.0') +
      '\n' +
      chalk.dim('production-ready stacks, fast'),
    {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      margin: { top: 1, bottom: 0, left: 0, right: 0 },
      borderStyle: 'double',
      borderColor: 'cyan',
      textAlignment: 'left',
    }
  );
  console.log(header);
}
