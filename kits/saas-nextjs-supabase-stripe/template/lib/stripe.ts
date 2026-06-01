import Stripe from 'stripe';

/**
 * Stripe SDK singleton.
 *
 * Uses the secret key from environment variables.
 * Sets the API version explicitly for stability.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
  appInfo: {
    name: 'openenv-saas-starter',
    version: '0.1.0',
    url: 'https://openenv.dev',
  },
});
