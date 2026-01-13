import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { executeAzCommand } from '../utils/azureCli.js';

/**
 * Execute any Azure CLI command
 */
export const azureCliTool: Tool = {
  name: 'azure_cli',
  description:
    'Execute any Azure CLI command. Use this for operations not covered by specific tools. ' +
    'Example: "functionapp list --resource-group MyRG" or "storage account keys list --account-name mystorage --resource-group MyRG"',
  inputSchema: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description:
          'The Azure CLI command to execute (without the "az" prefix). Example: "account show" or "group list"',
      },
    },
    required: ['command'],
  },
};

export async function handleAzureCli(args: { command: string }): Promise<any> {
  const result = await executeAzCommand(args.command);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      output: result.output,
      command: `az ${args.command}`,
    };
  }

  return {
    success: false,
    error: result.error || 'Command execution failed',
    stderr: result.stderr,
    command: `az ${args.command}`,
  };
}

/**
 * List resource groups
 */
export const azureResourceGroupListTool: Tool = {
  name: 'azure_resource_group_list',
  description: 'List all resource groups in the current subscription',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export async function handleAzureResourceGroupList(): Promise<any> {
  const result = await executeAzCommand('group list');

  if (result.success && result.data) {
    return {
      success: true,
      resourceGroups: result.data.map((rg: any) => ({
        name: rg.name,
        location: rg.location,
        id: rg.id,
      })),
      count: result.data.length,
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to list resource groups',
  };
}

/**
 * List resources in a resource group
 */
export const azureResourceListTool: Tool = {
  name: 'azure_resource_list',
  description: 'List all resources in a specific resource group',
  inputSchema: {
    type: 'object',
    properties: {
      resourceGroup: {
        type: 'string',
        description: 'Resource group name',
      },
    },
    required: ['resourceGroup'],
  },
};

export async function handleAzureResourceList(args: {
  resourceGroup: string;
}): Promise<any> {
  const command = `resource list --resource-group "${args.resourceGroup}"`;
  const result = await executeAzCommand(command);

  if (result.success && result.data) {
    return {
      success: true,
      resources: result.data.map((resource: any) => ({
        name: resource.name,
        type: resource.type,
        location: resource.location,
        id: resource.id,
      })),
      count: result.data.length,
      resourceGroup: args.resourceGroup,
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to list resources',
  };
}

/**
 * Get storage account keys
 */
export const azureStorageKeyTool: Tool = {
  name: 'azure_storage_key',
  description: 'Get access keys for an Azure Storage account',
  inputSchema: {
    type: 'object',
    properties: {
      accountName: {
        type: 'string',
        description: 'Storage account name',
      },
      resourceGroup: {
        type: 'string',
        description: 'Resource group name',
      },
    },
    required: ['accountName', 'resourceGroup'],
  },
};

export async function handleAzureStorageKey(args: {
  accountName: string;
  resourceGroup: string;
}): Promise<any> {
  const command = `storage account keys list --account-name "${args.accountName}" --resource-group "${args.resourceGroup}"`;
  const result = await executeAzCommand(command);

  if (result.success && result.data) {
    return {
      success: true,
      keys: result.data.map((key: any) => ({
        keyName: key.keyName,
        value: key.value,
        permissions: key.permissions,
      })),
      accountName: args.accountName,
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to get storage keys',
  };
}
