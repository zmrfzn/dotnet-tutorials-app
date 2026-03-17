---
slug: react-app
id: cng90kdvkbzc
type: challenge
title: Frontend Real User Monitoring with Browser
teaser: Real User Monitoring with Single Page Application (SPA) built on React.js.
notes:
- type: text
  contents: |-
    New Relic enables you to monitor data from browser activity and optimize performance across your entire stack. You can use browser monitoring to ensure successful deployments and troubleshoot customer-visible problems quickly.

    To begin using browser monitoring, you need to add the New Relic browser agent to your webpage's HTML in this challenge. This is a customized JavaScript code snippet that monitors your app's performance and sends the data to New Relic.
tabs:
- id: d5jhrmtycdbb
  title: Terminal 1
  type: terminal
  hostname: fullstack-o11y-java
  workdir: /root/java-tutorials-app
- id: muocbgdkytnx
  title: Terminal 2
  type: terminal
  hostname: fullstack-o11y-java
  workdir: /root/java-tutorials-app
- id: m7ih0xhxdpff
  title: React Editor
  type: code
  hostname: fullstack-o11y-java
  path: /root/java-tutorials-app/Tutorials/ClientApp
- id: bi9ogvcyrhfv
  title: Java Editor
  type: code
  hostname: fullstack-o11y-java
  path: /root/java-tutorials-app/src/main/java/com/newrelic/tutorials
difficulty: ""
timelimit: 600
enhanced_loading: null
---
In this exercise, we will instrument a React single-page application (SPA) that is served by our Java Spring Boot application. Our Spring Boot application serves both the API endpoints and the React frontend, providing a unified full-stack monitoring experience with New Relic Browser monitoring.

Verify the Java Application with React Frontend
============

Our Java application is configured to serve both the API and the React frontend. Let's verify that everything is working correctly.

### Step 1 - Start the Java Application

In [button label="Terminal 1"](tab-0), start the Java application with New Relic monitoring:

First, set up the environment variables for the Java agent:

```copy,run
export NEW_RELIC_APP_NAME="java-tutorials-server"
export NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
```

```copy
export NEW_RELIC_LICENSE_KEY=<YOUR INGEST LICENSE KEY>
```

```run
export JAVA_TOOL_OPTIONS="-javaagent:/root/newrelic/newrelic.jar"
mvn spring-boot:run
```

This command starts both the Java API backend and serves the React frontend from the same application.

---
### Step 2 - Verify the Application

Switch to [button label="Terminal 2"](tab-1) and test both the API and frontend:

Test the API endpoint:
```run
echo https://$HOSTNAME.$_SANDBOX_ID.instruqt.io:5182/api/tutorials
```

Get the frontend URL:
```run
echo https://$HOSTNAME.$_SANDBOX_ID.instruqt.io:5182
```

Copy the output URL and open it in a new browser tab to verify the React frontend loads correctly.

> [!NOTE]
> The Java application serves both the API (at `/api/tutorials`) and the React SPA (at the root `/`)

Setup Browser SPA Agent for React Frontend
============

There are two ways to add a browser agent to our React application:
1. **Via the Java APM Agent** (automatic browser injection)
2. **Manual JavaScript snippet** (copy/paste)

In this lab, we will set up browser monitoring manually. The snippet copy/paste option gives you precise control over JavaScript snippet placement and is the recommended approach for SPA applications.

First, let's disable the automatic browser instrumentation if it's enabled.

### Disable Automatic Browser Monitoring

For the Java agent, automatic instrumentation is often disabled by default in `newrelic.yml`. Ensure `browser_monitoring: auto_instrument: false` is set in your configuration.

The manual option is recommended for:
- Single Page Applications (SPAs) like our React app
- Standalone apps, static sites, and cached pages delivered by a CDN
- Applications where the client-side app communicates with a REST API backend (our current architecture)

---
### Step 1 - Set Up New Relic Browser Monitoring

To set up New Relic Browser monitoring for your React application:

1. Go to [one.newrelic.com](https://one.newrelic.com/) and log into your account
2. Click on **Add data** in the left sidebar
3. Select **Browser & Mobile** from the options
4. Choose **React** as your data source for browser monitoring
5. In the *deployment method* section, select **Copy/Paste JavaScript code**

6. Leave all other configurations as default and scroll to the bottom
7. Select **No (Name your standalone app)** to create a standalone browser application
8. Enter the application name: **"java-tutorials-frontend"**
9. Click the **Enable** button to generate your monitoring snippet
10. Copy the generated JavaScript snippet to your clipboard

---
### Step 2 - Add Browser Agent to React App

Now we'll add the New Relic browser monitoring snippet to our React application:

1. Switch to [button label="React Editor"](tab-2)
2. Open the `index.html` file in the React application root directory (not in the public folder)
3. Locate the `<head>` section of the HTML file
4. Paste the New Relic snippet you copied into the `<head>` section, right after the `<meta>` tags and before the `<title>` tag

### Step 3 - Build the Application

Run the following command in [button label="Terminal 2"](tab-1) to rebuild the frontend application and copy it to the Java static resources:

```run
./manage-java.sh build
```

### Step 4 - Restart the Application

If your Java application is still running, stop it by pressing `Ctrl+C` in [button label="Terminal 1"](tab-0).

Then restart the application to pick up the React changes:

```run
export JAVA_TOOL_OPTIONS="-javaagent:/root/newrelic/newrelic.jar"
mvn spring-boot:run
```

---
### Step 5 - Generate Traffic and Test

Switch to [button label="Terminal 2"](tab-1) and get the application URL:

```run
echo https://$HOSTNAME.$_SANDBOX_ID.instruqt.io:5182
```

1. Copy the output URL and open it in your browser
2. Navigate through the React application to generate meaningful traffic.

---
### Step 6 - Verify Browser Data in New Relic

Navigate to your New Relic account and click on **Browser** from the left sidebar.

You should see your **"java-tutorials-frontend"** application listed with comprehensive metrics.
