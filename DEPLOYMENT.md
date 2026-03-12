# Azure Deployment Guide

Step-by-step instructions to deploy **Cloud Quest – Microsoft Azure Workshop** to Azure App Service.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Azure CLI | 2.x+ | [Install Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) |
| Node.js | 18.x | [Download Node.js](https://nodejs.org/) |
| .NET SDK | 8.0 | [Download .NET 8](https://dotnet.microsoft.com/download/dotnet/8.0) |
| Git | Latest | [Download Git](https://git-scm.com/) |
| GitHub Account | — | [github.com](https://github.com) |
| Azure Subscription | Free/Pay-As-You-Go | [Create Free Account](https://azure.microsoft.com/free/) |

---

## Option 1: Deploy via Azure CLI (Recommended)

### Step 1 — Login to Azure

```bash
az login
```

### Step 2 — Set variables

```bash
# Choose your own names
RESOURCE_GROUP="rg-cloudquest-workshop"
APP_NAME="cloudquest-workshop"        # Must be globally unique
LOCATION="centralindia"               # Choose your nearest region
PLAN_NAME="plan-cloudquest-free"
```

### Step 3 — Create a Resource Group

```bash
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

### Step 4 — Create an App Service Plan (Free F1 Tier)

```bash
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku F1 \
  --is-linux
```

### Step 5 — Create the Web App

```bash
az webapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --runtime "DOTNETCORE:8.0"
```

### Step 6 — Build the application locally

```bash
# Build the React SPA (outputs to server/wwwroot/)
cd client
npm ci
npm run build
cd ..

# Publish the .NET API
cd server
dotnet publish -c Release -o ../publish
cd ..
```

### Step 7 — Deploy via Zip

```bash
# Create a zip of the publish folder
cd publish
zip -r ../deploy.zip .
cd ..

# Deploy to Azure
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src-path deploy.zip \
  --type zip
```

### Step 8 — Verify deployment

```bash
# Check the health endpoint
curl https://$APP_NAME.azurewebsites.net/api/health

# Open in browser
az webapp browse --name $APP_NAME --resource-group $RESOURCE_GROUP
```

---

## Option 2: Deploy via GitHub Actions (CI/CD)

### Step 1 — Create Azure resources (Steps 1–5 from Option 1)

Follow Steps 1–5 above to create the Resource Group, App Service Plan, and Web App.

### Step 2 — Download the Publish Profile

```bash
az webapp deployment list-publishing-profiles \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --xml
```

Or via the Azure Portal:
1. Go to your **App Service** → **Overview**
2. Click **Download publish profile**

### Step 3 — Add the secret to GitHub

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Value: Paste the entire XML content of the publish profile
5. Click **Add secret**

### Step 4 — Update the workflow file

Open `.github/workflows/azure-deploy.yml` and set the `AZURE_WEBAPP_NAME` environment variable to your app name:

```yaml
env:
  AZURE_WEBAPP_NAME: cloudquest-workshop   # ← Your App Service name
```

### Step 5 — Push to main

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

The GitHub Actions workflow will automatically build and deploy your application.

### Step 6 — Monitor the deployment

1. Go to your GitHub repository → **Actions** tab
2. Click the running workflow to see build logs
3. Once complete, visit `https://<APP_NAME>.azurewebsites.net`

---

## Option 3: Deploy via Azure Deployment Center (Portal)

### Step 1 — Create Azure resources

Follow Steps 1–5 from Option 1, or create them via the Azure Portal:

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** → **Web App**
3. Configure:
   - **Resource Group**: Create new → `rg-cloudquest-workshop`
   - **Name**: `cloudquest-workshop`
   - **Publish**: Code
   - **Runtime stack**: .NET 8
   - **Operating System**: Linux
   - **Region**: Central India (or nearest)
   - **App Service Plan**: Create new → Free F1
4. Click **Review + create** → **Create**

### Step 2 — Connect GitHub via Deployment Center

1. Go to your **App Service** in the Azure Portal
2. In the left menu, click **Deployment Center**
3. Under **Source**, select **GitHub**
4. Authorize Azure to access your GitHub account
5. Configure:
   - **Organization**: Your GitHub username/org
   - **Repository**: `CloudQuestWorkshop`
   - **Branch**: `main`
6. Azure will automatically create a GitHub Actions workflow
7. Click **Save**

### Step 3 — Verify

Push any change to `main` and Azure will automatically build & deploy.

---

## Useful Commands

```bash
# View app logs (live stream)
az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP

# Restart the app
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP

# View app settings
az webapp config show --name $APP_NAME --resource-group $RESOURCE_GROUP

# Delete all resources when done
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on page load | Ensure `app.MapFallbackToFile("index.html")` is in `Program.cs` |
| API returns 500 | Check logs with `az webapp log tail` |
| Build fails in GitHub Actions | Check Node.js/npm version, ensure `package-lock.json` is committed |
| Static files not served | Verify `vite build` outputs to `server/wwwroot/` |
| App not starting | Confirm runtime is set to `DOTNETCORE:8.0` |
