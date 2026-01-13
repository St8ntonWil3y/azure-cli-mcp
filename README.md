# Azure CLI MCP Server

Model Context Protocol (MCP) server that wraps Azure CLI for seamless Azure operations in Claude Code.

## Features

- **Authentication Management**: Check auth status, login, manage subscriptions
- **Azure Functions**: List, deploy, get logs, manage settings, restart
- **Resource Management**: List resource groups and resources
- **Storage**: Get storage account keys
- **General CLI**: Execute any Azure CLI command

## Prerequisites

1. **Azure CLI** - Must be installed
   - Download: https://aka.ms/installazurecliwindows
   - Or check if installed: `az --version`

2. **Node.js 18+** - To run the MCP server
   - Download: https://nodejs.org/

3. **Claude Code (Windows App)** - The environment where you'll use this

## Installation

### Quick Install (Recommended)

Install globally via npm:

```bash
npm install -g azure-cli-mcp
```

### Alternative: Install from GitHub

```bash
npm install -g https://github.com/St8ntonWil3y/azure-cli-mcp
```

### Development Install

If you want to contribute or modify the code:

```bash
git clone https://github.com/St8ntonWil3y/azure-cli-mcp.git
cd azure-cli-mcp
npm install
npm run build
npm link
```

## Configuration

### 1. Configure Claude Code

Edit your Claude Code MCP configuration file:
- Location: `%APPDATA%\Claude\claude_desktop_config.json`
- Or: `C:\Users\YOUR_USERNAME\AppData\Roaming\Claude\claude_desktop_config.json`

Add the Azure MCP server:

```json
{
  "mcpServers": {
    "azure": {
      "command": "azure-cli-mcp"
    }
  }
}
```

### 2. Authenticate to Azure

Open a terminal and login to Azure:

```bash
az login
```

Follow the browser authentication flow.

### 3. Restart Claude Code

Close and reopen Claude Code for the changes to take effect.

## Available Tools

### Authentication

- **`azure_auth_status`** - Check if authenticated and show current subscription
- **`azure_auth_login`** - Trigger Azure CLI login flow
- **`azure_subscription_list`** - List all available subscriptions
- **`azure_subscription_set`** - Switch to a different subscription

### Azure Functions

- **`azure_function_list`** - List all function apps
- **`azure_function_deploy`** - Deploy a function app from local directory
- **`azure_function_logs`** - Get recent logs from a function app
- **`azure_function_settings`** - Get application settings
- **`azure_function_restart`** - Restart a function app

### General Azure Operations

- **`azure_cli`** - Execute any Azure CLI command
- **`azure_resource_group_list`** - List all resource groups
- **`azure_resource_list`** - List resources in a resource group
- **`azure_storage_key`** - Get storage account access keys

## Usage Examples

Once configured, you can use Claude Code naturally:

### Example 1: Check Authentication
```
You: "Am I logged into Azure?"

Claude: [Calls azure_auth_status]
You're authenticated as user@company.com
Current subscription: My Subscription (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
```

### Example 2: Deploy Function App
```
You: "Deploy my function app in C:\Projects\my-app\api"

Claude: [Calls azure_auth_status to verify auth]
[Calls azure_function_list to find the app]
[Calls azure_function_deploy]
✅ Successfully deployed my-function-app
URL: https://my-function-app.azurewebsites.net
```

### Example 3: Get Storage Keys
```
You: "Get the storage keys for mystorageaccount"

Claude: [Calls azure_storage_key]
Retrieved 2 keys for mystorageaccount:
- key1: [access key displayed]
- key2: [access key displayed]
```

### Example 4: Check Function Logs
```
You: "Show me the latest logs for my-function-app"

Claude: [Calls azure_function_logs]
[Displays recent log entries...]
```

## How It Works

```
Claude Code (Your Machine)
    ↓ (prompt)
Claude AI (Anthropic Cloud)
    ↓ (tool call)
Azure MCP Server (Your Machine - this package)
    ↓ (executes command)
Azure CLI (Your Machine)
    ↓ (API call with your credentials)
Azure Cloud (Microsoft)
```

**Security**: Everything runs locally on your machine using your Azure CLI authentication. Claude (the AI) only sees the tool calls and results, not your credentials.

## Troubleshooting

### "Azure CLI not found"
- Install Azure CLI from: https://aka.ms/installazurecliwindows
- Ensure it's in your PATH: `az --version`

### "Not authenticated"
- Run: `az login`
- Follow the browser authentication flow

### "MCP server not appearing in Claude Code"
- Check `claude_desktop_config.json` syntax is valid
- Restart Claude Code completely
- Check server is installed: `azure-cli-mcp --version` (if applicable)

### "Permission denied" errors
- Ensure you have the necessary Azure RBAC permissions
- Check you're using the correct subscription: `az account show`

## Development

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run watch
```

### Test Locally
```bash
npm run dev
```

## License

MIT

## Contributing

Issues and pull requests welcome!

## Credits

Built with the [Model Context Protocol SDK](https://github.com/anthropics/mcp)
