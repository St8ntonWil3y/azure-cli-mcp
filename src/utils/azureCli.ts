import { exec } from 'child_process';
import { promisify } from 'util';
import { findAzureCliPath } from './findAzCli.js';

const execAsync = promisify(exec);

export interface AzureCliResult {
  success: boolean;
  data?: any;
  output?: string;
  error?: string;
  stderr?: string;
}

/**
 * Execute an Azure CLI command
 */
export async function executeAzCommand(command: string): Promise<AzureCliResult> {
  try {
    const azPath = await findAzureCliPath();
    const fullCommand = `"${azPath}" ${command}`;

    const { stdout, stderr } = await execAsync(fullCommand, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    // Try to parse as JSON if possible
    if (stdout.trim()) {
      try {
        const data = JSON.parse(stdout);
        return {
          success: true,
          data,
          output: stdout,
        };
      } catch {
        // Not JSON, return as string
        return {
          success: true,
          output: stdout,
          stderr: stderr || undefined,
        };
      }
    }

    return {
      success: true,
      output: stdout,
      stderr: stderr || undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stderr: error.stderr,
    };
  }
}

/**
 * Check if user is authenticated to Azure CLI
 */
export async function isAuthenticated(): Promise<boolean> {
  const result = await executeAzCommand('account show');
  return result.success;
}

/**
 * Get current Azure account information
 */
export async function getCurrentAccount(): Promise<any> {
  const result = await executeAzCommand('account show');
  return result.data;
}

/**
 * List all Azure subscriptions
 */
export async function listSubscriptions(): Promise<any[]> {
  const result = await executeAzCommand('account list');
  return result.data || [];
}

/**
 * Set active Azure subscription
 */
export async function setSubscription(subscriptionId: string): Promise<AzureCliResult> {
  return await executeAzCommand(`account set --subscription "${subscriptionId}"`);
}
