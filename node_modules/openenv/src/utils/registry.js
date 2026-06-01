import axios from 'axios';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** GitHub raw URL for the live registry. Override with env var for forks/testing. */
const REGISTRY_URL =
  process.env.OPENENV_REGISTRY_URL ||
  'https://raw.githubusercontent.com/openenv/openenv/main/registry.json';

const CACHE_DIR = path.join(os.homedir(), '.openenv');
const CACHE_FILE = path.join(CACHE_DIR, 'registry.cache.json');
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/** In-process memory cache — avoids double-fetch within one command */
let _memoryCache = null;

/**
 * Read the disk cache if it exists and is within TTL.
 * @returns {Promise<Array|null>}
 */
async function readDiskCache() {
  try {
    if (!(await fs.pathExists(CACHE_FILE))) return null;
    const { timestamp, data } = await fs.readJson(CACHE_FILE);
    if (Date.now() - timestamp > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Write registry data to the disk cache with a timestamp.
 * Non-fatal: silently skips on permission errors.
 * @param {Array} data
 */
async function writeDiskCache(data) {
  try {
    await fs.ensureDir(CACHE_DIR);
    await fs.writeJson(CACHE_FILE, { timestamp: Date.now(), data });
  } catch {
    // Cache writes are best-effort
  }
}

/**
 * Read the bundled fallback registry shipped inside the CLI package.
 * @returns {Promise<Array>}
 */
async function readBundledRegistry() {
  const bundledPath = path.resolve(__dirname, '../../registry.json');
  return fs.readJson(bundledPath);
}

/**
 * Fetch the kit registry.
 *
 * Resolution order:
 * 1. In-memory cache (same process)
 * 2. Disk cache (~/.openenv/registry.cache.json, 1-hour TTL)
 * 3. Live GitHub raw URL (or OPENENV_REGISTRY_URL)
 * 4. Stale disk cache (any age) on network failure
 * 5. Bundled registry.json shipped with the CLI
 *
 * @returns {Promise<Array>} Array of kit objects from the registry
 */
export async function fetchRegistry() {
  if (_memoryCache) return _memoryCache;

  // Fast path: fresh disk cache
  const cached = await readDiskCache();
  if (cached) {
    _memoryCache = cached;
    return cached;
  }

  // Network fetch
  try {
    const { data } = await axios.get(REGISTRY_URL, {
      timeout: 8000,
      headers: { 'User-Agent': 'openenv-cli/0.1.0' },
    });
    const registry = Array.isArray(data) ? data : [];
    _memoryCache = registry;
    await writeDiskCache(registry);
    return registry;
  } catch {
    // Network failed — try stale disk cache before giving up
    try {
      const { data } = await fs.readJson(CACHE_FILE);
      _memoryCache = data;
      return data;
    } catch {
      // Absolute last resort: bundled copy
      const bundled = await readBundledRegistry();
      _memoryCache = bundled;
      return bundled;
    }
  }
}

/**
 * Find a kit by exact name, with fuzzy suggestions if not found.
 *
 * @param {string} name - The kit name to search for
 * @returns {Promise<{ exact: Object|null, suggestions: Array }>}
 *   `exact` is the matched kit object, or null.
 *   `suggestions` is a list of partial/fuzzy matches when exact is null.
 */
export async function findKit(name) {
  const registry = await fetchRegistry();
  const nameLower = name.toLowerCase();

  const exact = registry.find((k) => k.name === name) || null;
  if (exact) return { exact, suggestions: [] };

  const suggestions = registry.filter((k) => {
    const kLower = k.name.toLowerCase();
    return (
      kLower.includes(nameLower) ||
      nameLower.includes(kLower) ||
      k.tags.some(
        (t) => t.includes(nameLower) || nameLower.includes(t)
      ) ||
      k.name.split('-').some((part) => nameLower.includes(part))
    );
  });

  return { exact: null, suggestions };
}
