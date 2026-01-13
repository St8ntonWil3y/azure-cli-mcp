# Installation Guide for End Users

This guide will walk you through installing the Azure CLI MCP Server for Claude Code on Windows.

## Step 1: Prerequisites

Before installing, ensure you have:

### 1.1 Node.js (Required)
- **Download**: https://nodejs.org/
- Install version 18 or higher
- Verify installation:
  ```powershell
  node --version
  ```
  Should show `v18.0.0` or higher

### 1.2 Azure CLI (Required)
- **Download**: https://aka.ms/installazurecliwindows
- Or install via winget:
  ```powershell
  winget install Microsoft.AzureCLI
  ```
- Verify installation:
  ```powershell
  az --version
  ```

### 1.3 Claude for Windows (Required)
- Download from: https://claude.ai/download
- Install and sign in

## Step 2: Install Azure MCP Server

Open PowerShell or Command Prompt and run:

```powershell
npm install -g azure-cli-mcp
```

This will install the server globally on your system.

## Step 3: Configure Claude Code

### 3.1 Locate the Configuration File

The configuration file is at:
```
C:\Users\YOUR_USERNAME\AppData\Roaming\Claude\claude_desktop_config.json
```

You can open it by:
1. Press `Win + R`
2. Type: `%APPDATA%\Claude`
3. Press Enter
4. Open `claude_desktop_config.json` in a text editor

### 3.2 Add the Azure MCP Server

If the file is **empty or doesn't exist**, create it with this content:

```json
{
  "mcpServers": {
    "azure": {
      "command": "azure-cli-mcp"
    }
  }
}
```

If the file **already has content**, add the azure server to the existing `mcpServers` object:

```json
{
  "mcpServers": {
    "existing-server": {
      "command": "some-other-mcp"
    },
    "azure": {
      "command": "azure-cli-mcp"
    }
  }
}
```

**Important**: Make sure the JSON is valid (all brackets match, commas are correct).

## Step 4: Authenticate to Azure

Open PowerShell and run:

```powershell
az login
```

This will:
1. Open your browser
2. Ask you to sign in to Azure
3. Authenticate your local Azure CLI

Verify you're logged in:
```powershell
az account show
```

## Step 5: Restart Claude

1. Completely close Claude (check Task Manager to ensure all processes are closed)
2. Reopen Claude for Windows
3. The Azure MCP server should now be available

## Step 6: Test It!

In Claude Code, try asking:

```
"Am I authenticated to Azure?"
```

Claude should use the Azure MCP tools to check your authentication status!

## Troubleshooting

### "Cannot find module 'azure-cli-mcp'"

The npm global install path might not be in your PATH. Try:

1. Find where npm installs global packages:
   ```powershell
   npm config get prefix
   ```

2. Add that path to your system PATH environment variable

3. Restart Claude

### "Azure CLI not found"

Make sure Azure CLI is installed and in your PATH:
```powershell
az --version
```

If not found, reinstall from: https://aka.ms/installazurecliwindows

### "Not authenticated to Azure"

Run the login command:
```powershell
az login
```

### MCP Server Not Appearing

1. Check that `claude_desktop_config.json` has valid JSON syntax
2. Ensure the file is saved
3. Completely close and restart Claude (use Task Manager to verify no Claude processes are running)
4. Check the Claude logs for errors

## What Can You Do Now?

Once installed, you can ask Claude to:

- "List all my Azure resource groups"
- "Show me all function apps"
- "Deploy my function app to Azure"
- "Get the storage keys for [storage-account-name]"
- "Show me the logs for [function-app-name]"
- "List all resources in [resource-group-name]"
- "Switch to subscription [subscription-name]"

Claude will automatically use the appropriate Azure tools!

## Updating

To update to the latest version:

```powershell
npm update -g azure-cli-mcp
```

## Uninstalling

To remove the Azure MCP server:

```powershell
npm uninstall -g azure-cli-mcp
```

Then remove the `"azure"` entry from your `claude_desktop_config.json` file.

## Need Help?

- Report issues: https://github.com/yourusername/azure-cli-mcp/issues
- Read the full README: https://github.com/yourusername/azure-cli-mcp
