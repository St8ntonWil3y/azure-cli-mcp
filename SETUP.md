# Quick Setup Guide

## Step 1: Link the Package Locally

```bash
cd C:\Projects\Azure_MCP
npm link
```

This makes `azure-cli-mcp` available globally on your system.

## Step 2: Configure Claude Code

1. Open: `C:\Users\YOUR_USERNAME\AppData\Roaming\Claude\claude_desktop_config.json`

2. Add this configuration:

```json
{
  "mcpServers": {
    "azure": {
      "command": "azure-cli-mcp"
    }
  }
}
```

If the file doesn't exist, create it with the content above.

## Step 3: Verify Azure CLI Authentication

```bash
az login
az account show
```

## Step 4: Restart Claude Code

Close and reopen the Claude Code Windows app completely.

## Step 5: Test It!

Open Claude Code and try:

```
"Am I authenticated to Azure?"
```

Claude should call the `azure_auth_status` tool and show you your current Azure subscription.

## Troubleshooting

### Can't find claude_desktop_config.json?

The file location depends on your Windows user:
- `%APPDATA%\Claude\claude_desktop_config.json`
- Usually: `C:\Users\YOUR_USERNAME\AppData\Roaming\Claude\claude_desktop_config.json`

Create it if it doesn't exist.

### "azure-cli-mcp: command not found"

Make sure you ran `npm link` in the Azure_MCP directory.

### MCP server not showing in Claude Code

1. Check the config file has valid JSON syntax
2. Restart Claude Code completely (not just close the window)
3. Check Windows Task Manager to ensure all Claude processes are closed before restarting

## What You Can Do Now

Try these commands in Claude Code:

- "Am I authenticated to Azure?"
- "List all my function apps"
- "Deploy C:\Projects\my-app\api to Azure"
- "Get the logs for my-function-app"
- "Get storage keys for mystorageaccount in my-resource-group"
- "List all resources in my-resource-group"

Claude will automatically use the appropriate Azure CLI MCP tools!
