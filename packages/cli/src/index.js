#!/usr/bin/env node
import { Command } from 'commander';
import { printHeader } from './utils/logger.js';
import { listCommand } from './commands/list.js';
import { initCommand } from './commands/init.js';
import { doctorCommand } from './commands/doctor.js';
import { deployCommand } from './commands/deploy.js';

const program = new Command();

program
  .name('openenv')
  .description('The open standard for production-ready full-stack starter kits')
  .version('0.1.0', '-v, --version', 'Output the current version')
  .addHelpText(
    'after',
    `
Examples:
  $ openenv list                              Show all available kits
  $ openenv list --tag saas                  Filter kits by tag
  $ openenv list --json                      Output raw JSON
  $ openenv init saas-nextjs-supabase-stripe  Scaffold a kit
  $ openenv init                             Interactive kit picker
  $ openenv doctor                           Check your environment
  $ openenv doctor --fix                     Auto-fix safe issues
`
  );

// ── list ──────────────────────────────────────────────────────────────────────
program
  .command('list')
  .description('Show all available kits from the openenv registry')
  .option('--tag <tag>', 'Filter kits by tag (e.g. saas, python, docker)')
  .option('--json', 'Output raw JSON for scripting')
  .action(async (options) => {
    printHeader();
    await listCommand(options);
  });

// ── init ──────────────────────────────────────────────────────────────────────
program
  .command('init [kit-name]')
  .description('Scaffold a production-ready kit into the current directory')
  .option('--dir <path>', 'Target directory (defaults to ./<kit-name>)')
  .option('--dry-run', 'Preview what would happen without touching disk')
  .action(async (kitName, options) => {
    printHeader();
    await initCommand(kitName, options);
  });

// ── doctor ────────────────────────────────────────────────────────────────────
program
  .command('doctor')
  .description('Diagnose your local environment and report issues')
  .option('--fix', 'Auto-apply safe fixes (npm install, copy .env)')
  .action(async (options) => {
    printHeader();
    await doctorCommand(options);
  });

// ── deploy ────────────────────────────────────────────────────────────────────
program
  .command('deploy')
  .description('Generate deployment configs (Dockerfile, CI/CD) for your project')
  .option('--provider <provider>', 'Cloud provider (render, railway)', 'render')
  .option('--mock', 'Simulate deployment without real API calls', true)
  .action(async (options) => {
    printHeader();
    await deployCommand(options);
  });

// ── unknown command handler ───────────────────────────────────────────────────
program.on('command:*', (operands) => {
  printHeader();
  console.error(`\n  ✗ Unknown command: '${operands[0]}'\n`);
  console.error(`  Run ${`'openenv --help'`} to see available commands.\n`);
  process.exit(1);
});

program.parse(process.argv);
