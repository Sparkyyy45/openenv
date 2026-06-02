import fs from 'fs';
import path from 'path';

export type Tech = Record<string, string>;

export type HealthCheck = {
  url: string;
  timeout_seconds: number;
  expected_status: number;
};

export type Kit = {
  name: string;
  version?: string;
  description: string;
  author: string;
  tags: string[];
  repo: string;
  template_path: string;
  verified: boolean;
  last_verified: string;
  required_ports: number[];
  tech: Tech;
  setup_commands?: string[];
  health_check?: HealthCheck;
};

export async function getRegistry(): Promise<Kit[]> {
  try {
    // Navigate up from apps/web to the root directory
    const registryPath = path.join(process.cwd(), '..', '..', 'registry.json');
    const fileContents = fs.readFileSync(registryPath, 'utf8');
    return JSON.parse(fileContents) as Kit[];
  } catch (error) {
    console.error('Error reading registry.json:', error);
    return [];
  }
}

export async function getKitByName(name: string): Promise<Kit | undefined> {
  const registry = await getRegistry();
  return registry.find(kit => kit.name === name);
}
