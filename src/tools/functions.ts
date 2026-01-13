import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { executeAzCommand } from '../utils/azureCli.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * List Azure Function Apps
 */
export const azureFunctionListTool: Tool = {
  name: 'azure_function_list',
  description: 'List all Azure Function Apps in the current subscription or resource group',
  inputSchema: {
    type: 'object',
    properties: {
      resourceGroup: {
        type: 'string',
        description: 'Optional: Filter by resource group name',
      },
    },
  },
};

export async function handleAzureFunctionList(args: {
  resourceGroup?: string;
}): Promise<any> {
  let command = 'functionapp list';
  if (args.resourceGroup) {
    command += ` --resource-group "${args.resourceGroup}"`;
  }

  const result = await executeAzCommand(command);

  if (result.success && result.data) {
    return {
      success: true,
      functions: result.data.map((app: any) => ({
        name: app.name,
        resourceGroup: app.resourceGroup,
        location: app.location,
        state: app.state,
        kind: app.kind,
        defaultHostName: app.defaultHostName,
      })),
      count: result.data.length,
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to list function apps',
  };
}

/**
 * Deploy Azure Function App
 */
export const azureFunctionDeployTool: Tool = {
  name: 'azure_function_deploy',
  description: 'Deploy an Azure Function App from a local directory',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Function app name',
      },
      resourceGroup: {
        type: 'string',
        description: 'Resource group name',
      },
      path: {
        type: 'string',
        description: 'Local path to the function app directory',
      },
    },
    required: ['name', 'resourceGroup', 'path'],
  },
};

export async function handleAzureFunctionDeploy(args: {
  name: string;
  resourceGroup: string;
  path: string;
}): Promise<any> {
  try {
    // Build the function app first
    const buildCommand = `cd "${args.path}" && npm run build`;
    await execAsync(buildCommand);

    // Deploy using Azure Functions Core Tools
    const deployCommand = `cd "${args.path}" && npx func azure functionapp publish ${args.name}`;
    const { stdout, stderr } = await execAsync(deployCommand, {
      env: {
        ...process.env,
        PATH: process.env.PATH + ';C:\\Program Files\\Microsoft SDKs\\Azure\\CLI2\\wbin',
      },
      maxBuffer: 10 * 1024 * 1024,
    });

    return {
      success: true,
      message: `Successfully deployed ${args.name}`,
      output: stdout,
      functionApp: {
        name: args.name,
        resourceGroup: args.resourceGroup,
        url: `https://${args.name}.azurewebsites.net`,
      },
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
 * Get Azure Function App logs
 */
export const azureFunctionLogsTool: Tool = {
  name: 'azure_function_logs',
  description: 'Get recent logs from an Azure Function App',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Function app name',
      },
      resourceGroup: {
        type: 'string',
        description: 'Resource group name',
      },
      lines: {
        type: 'number',
        description: 'Number of log lines to retrieve (default: 50)',
      },
    },
    required: ['name', 'resourceGroup'],
  },
};

export async function handleAzureFunctionLogs(args: {
  name: string;
  resourceGroup: string;
  lines?: number;
}): Promise<any> {
  const lines = args.lines || 50;
  const command = `functionapp log tail --name "${args.name}" --resource-group "${args.resourceGroup}" --max-log-lines ${lines}`;

  const result = await executeAzCommand(command);

  if (result.success) {
    return {
      success: true,
      logs: result.output,
      functionApp: args.name,
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to retrieve logs',
  };
}

/**
 * Get Azure Function App settings
 */
export const azureFunctionSettingsTool: Tool = {
  name: 'azure_function_settings',
  description: 'Get application settings for an Azure Function App',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Function app name',
      },
      resourceGroup: {
        type: 'string',
        description: 'Resource group name',
      },
    },
    required: ['name', 'resourceGroup'],
  },
};

export async function handleAzureFunctionSettings(args: {
  name: string;
  resourceGroup: string;
}): Promise<any> {
  const command = `functionapp config appsettings list --name "${args.name}" --resource-group "${args.resourceGroup}"`;

  const result = await executeAzCommand(command);

  if (result.success && result.data) {
    return {
      success: true,
      settings: result.data.map((setting: any) => ({
        name: setting.name,
        value: setting.value,
        slotSetting: setting.slotSetting,
      })),
      count: result.data.length,
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to get settings',
  };
}

/**
 * Restart Azure Function App
 */
export const azureFunctionRestartTool: Tool = {
  name: 'azure_function_restart',
  description: 'Restart an Azure Function App',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Function app name',
      },
      resourceGroup: {
        type: 'string',
        description: 'Resource group name',
      },
    },
    required: ['name', 'resourceGroup'],
  },
};

export async function handleAzureFunctionRestart(args: {
  name: string;
  resourceGroup: string;
}): Promise<any> {
  const command = `functionapp restart --name "${args.name}" --resource-group "${args.resourceGroup}"`;

  const result = await executeAzCommand(command);

  if (result.success) {
    return {
      success: true,
      message: `Successfully restarted ${args.name}`,
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to restart function app',
  };
}
