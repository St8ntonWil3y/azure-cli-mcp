# Publishing Guide

This guide explains how to distribute your Azure CLI MCP Server to others.

## Option 1: Publish to npm Registry (Recommended)

This is the easiest way for users to install your package.

### Prerequisites

1. **npm account**: Create one at https://www.npmjs.com/signup
2. **Update package.json**: Replace placeholder values:
   - `"author": "Your Name <your.email@example.com>"` → Your actual name and email
   - Repository URLs → Your actual GitHub repository

### Steps to Publish

1. **Login to npm**:
   ```bash
   npm login
   ```
   Enter your npm username, password, and email.

2. **Build the package**:
   ```bash
   npm run build
   ```

3. **Test the package locally** (optional but recommended):
   ```bash
   npm pack
   npm install -g ./azure-cli-mcp-1.0.0.tgz
   ```

4. **Publish to npm**:
   ```bash
   npm publish
   ```

5. **Verify it's published**:
   - Visit: https://www.npmjs.com/package/azure-cli-mcp
   - Or search: `npm search azure-cli-mcp`

### Users Can Now Install With:

```bash
npm install -g azure-cli-mcp
```

### Updating Versions

When you make changes:

1. Update the version in `package.json`:
   ```bash
   npm version patch  # for bug fixes (1.0.0 → 1.0.1)
   npm version minor  # for new features (1.0.0 → 1.1.0)
   npm version major  # for breaking changes (1.0.0 → 2.0.0)
   ```

2. Rebuild and publish:
   ```bash
   npm run build
   npm publish
   ```

## Option 2: Publish to GitHub

Share via GitHub repository for users who want to install directly from source.

### Setup

1. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Name it: `azure-cli-mcp`
   - Make it public

2. **Initialize git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/azure-cli-mcp.git
   git push -u origin main
   ```

3. **Update package.json**:
   Replace `yourusername` with your actual GitHub username in the repository URLs.

### Users Can Install With:

```bash
# Install directly from GitHub
npm install -g github:yourusername/azure-cli-mcp

# Or from a specific tag/branch
npm install -g github:yourusername/azure-cli-mcp#v1.0.0
```

### Creating Releases

Create releases for version tracking:

```bash
git tag v1.0.0
git push origin v1.0.0
```

On GitHub, create a release from the tag with release notes.

## Option 3: Distribute as Package File

For offline or manual distribution.

### Create the Package

```bash
npm pack
```

This creates `azure-cli-mcp-1.0.0.tgz`

### Users Can Install With:

```bash
npm install -g path/to/azure-cli-mcp-1.0.0.tgz
```

Or directly from URL:
```bash
npm install -g https://your-domain.com/azure-cli-mcp-1.0.0.tgz
```

## Option 4: Private npm Registry

For enterprise/private distribution.

### Using npm Private Packages

1. **Upgrade to paid npm account** (required for private packages)
2. **Add scope to package name** in `package.json`:
   ```json
   "name": "@yourorg/azure-cli-mcp"
   ```

3. **Publish as private**:
   ```bash
   npm publish --access restricted
   ```

### Using GitHub Packages

1. **Create `.npmrc`** in project root:
   ```
   @yourorg:registry=https://npm.pkg.github.com
   ```

2. **Update package.json**:
   ```json
   {
     "name": "@yourorg/azure-cli-mcp",
     "repository": {
       "type": "git",
       "url": "https://github.com/yourorg/azure-cli-mcp.git"
     },
     "publishConfig": {
       "registry": "https://npm.pkg.github.com"
     }
   }
   ```

3. **Authenticate and publish**:
   ```bash
   npm login --registry=https://npm.pkg.github.com
   npm publish
   ```

Users need to configure their `.npmrc` to install:
```
@yourorg:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

## Recommended Approach

For public distribution:
1. **Publish to npm** (easiest for users)
2. **Also publish to GitHub** (for transparency and contributions)

For private/enterprise:
1. Use GitHub Packages or Azure Artifacts
2. Or distribute the `.tgz` file internally

## Pre-Publication Checklist

- [ ] Update `package.json` with your actual details
- [ ] Add LICENSE file (already included)
- [ ] Update README.md with correct URLs
- [ ] Test installation locally with `npm pack` and `npm install -g`
- [ ] Test the installed package works with Claude Code
- [ ] Build the project: `npm run build`
- [ ] Run `npm pack --dry-run` to preview package contents
- [ ] Update version number appropriately
- [ ] Create git tags for versions
- [ ] Write release notes on GitHub

## Support and Maintenance

After publishing:

1. **Monitor issues**: Watch GitHub issues for bug reports
2. **Release updates**: Fix bugs and add features
3. **Document changes**: Keep CHANGELOG.md or release notes updated
4. **Deprecation policy**: If you need to make breaking changes, increment major version
5. **Security**: Keep dependencies updated with `npm audit` and `npm update`

## Quick Command Reference

```bash
# One-time setup
npm login

# For each release
npm version patch        # Increment version
npm run build           # Build TypeScript
npm publish             # Publish to npm

# Git workflow
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push origin main --tags
```
