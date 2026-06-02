import { printHeader } from '../utils/logger.js';
import chalk from 'chalk';

// Only print the header if we aren't in a CI environment
if (!process.env.CI) {
  printHeader();
  console.log(`  ${chalk.green('✓ openenv installed successfully')}`);
  console.log(`  Run ${chalk.cyan('openenv')} to get started.`);
  console.log();
}
