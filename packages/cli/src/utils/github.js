/**
 * Generate a GitHub Actions deployment workflow.
 * @param {string} provider - render or railway
 * @returns {string} The workflow YAML content
 */
export function generateGithubAction(provider) {
  const providerLower = provider.toLowerCase();

  if (providerLower === 'render') {
    return `
name: Deploy to Render

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  deploy:
    name: Deploy to Render Production
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Trigger Render Deploy Hook
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: \${{ secrets.RENDER_SERVICE_ID }}
          api-key: \${{ secrets.RENDER_API_KEY }}
    `.trim();
  }

  if (providerLower === 'railway') {
    return `
name: Deploy to Railway

on:
  push:
    branches: [ main, master ]

jobs:
  deploy:
    name: Deploy to Railway
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy
        run: railway up --service \${{ secrets.RAILWAY_SERVICE_NAME }}
        env:
          RAILWAY_TOKEN: \${{ secrets.RAILWAY_TOKEN }}
    `.trim();
  }

  // Generic backup deployment pipeline
  return `
name: Continuous Deployment

on:
  push:
    branches: [ main, master ]

jobs:
  deploy:
    name: Build & Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Image
        run: |
          docker build -t app:latest .
          echo "Image built successfully!"
          echo "Please configure your deployment targets in this workflow."
  `.trim();
}
