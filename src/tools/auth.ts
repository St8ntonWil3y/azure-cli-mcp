import { Tool } from '@modelcontextprotocol/sdk/types.js';
import {
  isAuthenticated,
  getCurrentAccount,
  listSubscriptions,
  setSubscription,
  executeAzCommand,
} from '../utils/azureCli.js';

/**
 * Check Azure authentication status
 */
export const azureAuthStatusTool: Tool = {
  name: 'azure_auth_status',
  description:
    'Check if authenticated to Azure CLI and show current subscription details',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export async function handleAzureAuthStatus(): Promise<any> {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return {
      authenticated: false,
      message: 'Not authenticated to Azure CLI. Please run: az login',
      instructions: [
        '1. Open a terminal',
        '2. Run: az login',
        '3. Follow the browser authentication flow',
        '4. Return to Claude Code and try again',
      ],
    };
  }

  const account = await getCurrentAccount();
  return {
    authenticated: true,
    subscription: {
      id: account.id,
      name: account.name,
      tenantId: account.tenantId,
    },
    user: {
      name: account.user.name,
      type: account.user.type,
    },
    environment: account.environmentName,
  };
}

/**
 * Login to Azure CLI
 */
export const azureAuthLoginTool: Tool = {
  name: 'azure_auth_login',
  description:
    'Trigger Azure CLI login flow (opens browser for authentication)',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export async function handleAzureAuthLogin(): Promise<any> {
  const result = await executeAzCommand('login');

  if (result.success) {
    const account = await getCurrentAccount();
    return {
      success: true,
      message: 'Successfully authenticated to Azure',
      account: {
        subscription: account.name,
        user: account.user.name,
      },
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to authenticate',
  };
}

/**
 * List Azure subscriptions
 */
export const azureSubscriptionListTool: Tool = {
  name: 'azure_subscription_list',
  description: 'List all Azure subscriptions available to the current user',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export async function handleAzureSubscriptionList(): Promise<any> {
  const subscriptions = await listSubscriptions();

  return {
    success: true,
    subscriptions: subscriptions.map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      state: sub.state,
      isDefault: sub.isDefault,
      tenantId: sub.tenantId,
    })),
    count: subscriptions.length,
  };
}

/**
 * Set active Azure subscription
 */
export const azureSubscriptionSetTool: Tool = {
  name: 'azure_subscription_set',
  description: 'Set the active Azure subscription for subsequent commands',
  inputSchema: {
    type: 'object',
    properties: {
      subscriptionId: {
        type: 'string',
        description: 'The subscription ID or name to set as active',
      },
    },
    required: ['subscriptionId'],
  },
};

export async function handleAzureSubscriptionSet(args: {
  subscriptionId: string;
}): Promise<any> {
  const result = await setSubscription(args.subscriptionId);

  if (result.success) {
    const account = await getCurrentAccount();
    return {
      success: true,
      message: `Switched to subscription: ${account.name}`,
      subscription: {
        id: account.id,
        name: account.name,
      },
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to set subscription',
  };
}
