import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'node:path';
import { logger } from '../utils/logger.js';
import { generateDockerfile } from '../utils/docker.js';
import { generateGithubAction } from '../utils/github.js';
import { provisionInstance } from '../utils/providers.js';

export async function deployCommand(options) {
  console.log('');
  const cwd = process.cwd();

  // 1. Project Detection
  let stack = 'unknown';
  const hasPackageJson = await fs.pathExists(path.join(cwd, 'package.json'));
  const hasRequirementsTxt = await fs.pathExists(path.join(cwd, 'requirements.txt'));
  const hasGoMod = await fs.pathExists(path.join(cwd, 'go.mod'));

  if (hasPackageJson) stack = 'node';
  else if (hasRequirementsTxt) stack = 'python';
  else if (hasGoMod) stack = 'go';

  if (stack === 'unknown') {
    logger.warn('Could not detect project stack. Are you inside an openenv kit directory?');
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Do you want to proceed with a generic Node.js deployment?',
        default: false,
      },
    ]);
    if (!proceed) {
      logger.info('Aborted deployment.');
      process.exit(0);
    }
    stack = 'node';
  }

  logger.step(`Detected stack: ${chalk.cyan(stack)}`);

  // 2. Select Provider
  const provider = options.provider || 'render';
  
  // 3. Generate Dockerfile
  const spinnerDocker = ora({ text: 'Generating Dockerfile...', color: 'cyan' }).start();
  try {
    const dockerfileContent = generateDockerfile(stack);
    await fs.writeFile(path.join(cwd, 'Dockerfile'), dockerfileContent);
    spinnerDocker.succeed(chalk.green('Generated optimized Dockerfile'));
  } catch (err) {
    spinnerDocker.fail(chalk.red(`Failed to generate Dockerfile: ${err.message}`));
    process.exit(1);
  }

  // 4. Generate GitHub Action
  const spinnerGH = ora({ text: 'Configuring CI/CD Pipeline...', color: 'cyan' }).start();
  try {
    const githubDir = path.join(cwd, '.github', 'workflows');
    await fs.ensureDir(githubDir);
    const actionContent = generateGithubAction(provider);
    await fs.writeFile(path.join(githubDir, 'deploy.yml'), actionContent);
    spinnerGH.succeed(chalk.green('Generated GitHub Actions workflow'));
  } catch (err) {
    spinnerGH.fail(chalk.red(`Failed to generate GitHub workflow: ${err.message}`));
    process.exit(1);
  }

  // 5. Provisioning
  console.log('');
  const isMock = options.mock !== false; // Default to mock for the magic demo
  
  try {
    const url = await provisionInstance(provider, isMock);
    
    console.log('');
    console.log(chalk.green('🚀 Deployment Successful!'));
    console.log('');
    console.log(`  Live URL: ${chalk.cyan.underline(url)}`);
    console.log('');
    logger.step('Push your code to GitHub to trigger the live deployment!');
    
  } catch (err) {
    logger.error(`Deployment failed: ${err.message}`);
    process.exit(1);
  }
}
