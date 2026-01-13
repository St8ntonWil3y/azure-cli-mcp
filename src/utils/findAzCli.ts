import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { platform } from 'os';

const execAsync = promisify(exec);

let cachedAzPath: string | null = null;

/**
 * Find the Azure CLI executable path
 * Caches the result for subsequent calls
 */
export async function findAzureCliPath(): Promise<string> {
  if (cachedAzPath) {
    return cachedAzPath;
  }

  const isWindows = platform() === 'win32';

  if (isWindows) {
    // Common Windows installation paths
    const windowsPaths = [
      'C:\\Program Files\\Microsoft SDKs\\Azure\\CLI2\\wbin\\az.cmd',
      'C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\wbin\\az.cmd',
    ];

    // Check common paths first
    for (const path of windowsPaths) {
      if (existsSync(path)) {
        cachedAzPath = path;
        return path;
      }
    }

    // Try using 'where' command
    try {
      const { stdout } = await execAsync('where az');
      const azPath = stdout.trim().split('\\n')[0];
      if (azPath) {
        cachedAzPath = azPath;
        return azPath;
      }
    } catch {
      // Continue to error
    }
  } else {
    // For Linux/Mac, use 'which'
    try {
      const { stdout } = await execAsync('which az');
      const azPath = stdout.trim();
      if (azPath) {
        cachedAzPath = azPath;
        return azPath;
      }
    } catch {
      // Continue to error
    }
  }

  throw new Error(
    'Azure CLI not found. Please install Azure CLI from: https://aka.ms/installazurecliwindows'
  );
}

/**
 * Clear the cached Azure CLI path (useful for testing)
 */
export function clearCache() {
  cachedAzPath = null;
}
