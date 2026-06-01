import chalk from 'chalk';
import ora from 'ora';

/**
 * Simulated cloud provider provisioning.
 * In a real implementation this would call the provider's API.
 * When `mock` is true (default), it simulates the process with a spinner.
 *
 * @param {string} provider - 'render' | 'railway' | other
 * @param {boolean} mock - Whether to run in mock mode (no real API calls)
 * @returns {Promise<string>} The deployed URL
 */
export async function provisionInstance(provider, mock = true) {
  const providerLower = provider.toLowerCase();

  const providerConfig = {
    render: {
      name: 'Render',
      urlTemplate: (id) => `https://${id}.onrender.com`,
    },
    railway: {
      name: 'Railway',
      urlTemplate: (id) => `https://${id}.up.railway.app`,
    },
  };

  const config = providerConfig[providerLower] || {
    name: provider,
    urlTemplate: (id) => `https://${id}.example.com`,
  };

  if (mock) {
    const spinner = ora({
      text: `Provisioning on ${chalk.cyan(config.name)}...`,
      color: 'cyan',
    }).start();

    // Simulate provisioning delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockId = `openenv-app-${Date.now().toString(36)}`;
    const url = config.urlTemplate(mockId);

    spinner.succeed(chalk.green(`Provisioned on ${config.name}`));
    return url;
  }

  // Real provisioning would go here
  throw new Error(
    `Live provisioning for ${config.name} is not yet implemented. ` +
    `Use --mock or push to GitHub with the generated workflow.`
  );
}
