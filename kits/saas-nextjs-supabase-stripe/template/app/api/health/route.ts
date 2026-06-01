import { NextResponse } from 'next/server';

/**
 * GET /api/health
 *
 * Simple health-check endpoint used by Docker healthchecks,
 * load balancers, and `openenv doctor`.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      uptime: Math.floor(process.uptime()),
    },
    { status: 200 }
  );
}
