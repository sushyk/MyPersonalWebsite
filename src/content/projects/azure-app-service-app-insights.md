---
title: "Azure App Service with App Insights"
summary: "A Node.js app deployed to Azure App Service by a GitHub Actions pipeline using OIDC login, with Application Insights collecting telemetry."
kind: personal
role: "Sole developer — app, pipeline and Azure setup"
stack: ["Node.js", "Express", "GitHub Actions", "Azure App Service", "Application Insights", "OIDC federated login"]
cloud: ["azure"]
tags: ["devops", "observability"]
repo: "https://github.com/sushyk/my-app-insights"
featured: false
order: 4
---

## The problem

I wanted a small, real end-to-end path to Azure: a commit to `master` becomes a running App Service app, and the running app reports its own telemetry. The app is a stock Express site on purpose. The point is the delivery pipeline and the instrumentation.

## Architecture

A GitHub Actions workflow builds the app and publishes a zip as a pipeline artifact. A separate deploy job, attached to a `Production` environment, downloads it, logs in to Azure and deploys to the App Service. The app starts Application Insights at boot, before the rest of the app loads, so requests, dependencies, exceptions, performance counters and console output are collected automatically.

```text
git push (master) -> GitHub Actions
  build job:  npm install/build/test -> release.zip artifact
  deploy job: azure/login (OIDC) -> azure/webapps-deploy
                                         |
                                 Azure App Service (Node 20)
                                         |  connection string from app settings
                                 Application Insights
```

## Key decisions

- **OIDC federated login, not a stored service principal secret.** The deploy job requests a short-lived token, so there is no long-lived Azure credential in the repository. The client, tenant and subscription IDs are kept as repository secrets.
- **Build and deploy as separate jobs.** The artifact built once is the artifact deployed, and only the deploy job has `id-token: write`.
- **The Application Insights connection string comes from the environment**, not from source, so the same code runs locally without telemetry and in Azure with it.
- **Telemetry initialised first in `app.js`**, so dependency correlation and auto-collection cover the whole app.

## Cloud

Azure App Service for hosting and Application Insights for telemetry. The workflow follows the standard Azure App Service deployment template, with OIDC login. This is a small project and I'd call it a worked example, not a production system.

AWS path: Elastic Beanstalk or App Runner with GitHub OIDC to an IAM role, and CloudWatch or X-Ray in place of Application Insights. Not built.

## What I'd do next

- Add a real test step and a staging slot with swap, so a bad build never goes straight to `Production`.
- Provision the App Service and Application Insights with Bicep so the environment is reproducible from code.
- Add an availability test and alert on the site's home page.
