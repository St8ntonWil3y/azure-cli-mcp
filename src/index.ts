#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import tools
import {
  azureAuthStatusTool,
  handleAzureAuthStatus,
  azureAuthLoginTool,
  handleAzureAuthLogin,
  azureSubscriptionListTool,
  handleAzureSubscriptionList,
  azureSubscriptionSetTool,
  handleAzureSubscriptionSet,
} from './tools/auth.js';

import {
  azureFunctionListTool,
  handleAzureFunctionList,
  azureFunctionDeployTool,
  handleAzureFunctionDeploy,
  azureFunctionLogsTool,
  handleAzureFunctionLogs,
  azureFunctionSettingsTool,
  handleAzureFunctionSettings,
  azureFunctionRestartTool,
  handleAzureFunctionRestart,
} from './tools/functions.js';

import {
  azureCliTool,
  handleAzureCli,
  azureResourceGroupListTool,
  handleAzureResourceGroupList,
  azureResourceListTool,
  handleAzureResourceList,
  azureStorageKeyTool,
  handleAzureStorageKey,
} from './tools/general.js';

// Create MCP server
const server = new Server(
  {
    name: 'azure-cli-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define all tools
const tools = [
  // Authentication
  azureAuthStatusTool,
  azureAuthLoginTool,
  azureSubscriptionListTool,
  azureSubscriptionSetTool,

  // Azure Functions
  azureFunctionListTool,
  azureFunctionDeployTool,
  azureFunctionLogsTool,
  azureFunctionSettingsTool,
  azureFunctionRestartTool,

  // General
  azureCliTool,
  azureResourceGroupListTool,
  azureResourceListTool,
  azureStorageKeyTool,
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    // Route to appropriate handler
    switch (name) {
      // Authentication
      case 'azure_auth_status':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureAuthStatus(), null, 2) }] };
      case 'azure_auth_login':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureAuthLogin(), null, 2) }] };
      case 'azure_subscription_list':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureSubscriptionList(), null, 2) }] };
      case 'azure_subscription_set':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureSubscriptionSet(args as any), null, 2) }] };

      // Azure Functions
      case 'azure_function_list':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureFunctionList(args as any), null, 2) }] };
      case 'azure_function_deploy':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureFunctionDeploy(args as any), null, 2) }] };
      case 'azure_function_logs':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureFunctionLogs(args as any), null, 2) }] };
      case 'azure_function_settings':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureFunctionSettings(args as any), null, 2) }] };
      case 'azure_function_restart':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureFunctionRestart(args as any), null, 2) }] };

      // General
      case 'azure_cli':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureCli(args as any), null, 2) }] };
      case 'azure_resource_group_list':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureResourceGroupList(), null, 2) }] };
      case 'azure_resource_list':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureResourceList(args as any), null, 2) }] };
      case 'azure_storage_key':
        return { content: [{ type: 'text', text: JSON.stringify(await handleAzureStorageKey(args as any), null, 2) }] };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: false,
              error: error.message,
              stack: error.stack,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Azure CLI MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
