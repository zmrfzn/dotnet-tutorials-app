---
slug: java-server
id: tqtmrmxzk9a1
type: challenge
title: Instrument Java Spring Boot application with New Relic
teaser: Instrument a Java Spring Boot application with New Relic's Application Performance Monitoring.
notes:
- type: text
  contents: |-
    New Relic's Application Performance Monitoring (APM) is a comprehensive monitoring service that tracks the performance of your applications and microservices.

    With APM, you can monitor every aspect of your tech stack, including all dependencies, web transaction times, and throughput. Whether you have a complex system with hundreds of dependencies or a simple app, APM provides a unified monitoring solution that helps you keep your applications running smoothly.

    This challenge will demonstrate how to instrument a simple Java Spring Boot application with New Relic's Application Performance Monitoring.
tabs:
- id: gwoghs63nmxo
  title: Terminal 1
  type: terminal
  hostname: fullstack-o11y-dotnet
  workdir: /root/java-tutorials-app
- id: 0y0ovoj8psk7
  title: LoadGen Terminal
  type: terminal
  hostname: fullstack-o11y-dotnet
  workdir: /root/
- id: kjgqxgnjmpfh
  title: Editor
  type: code
  hostname: fullstack-o11y-dotnet
  path: /root/java-tutorials-app/src/main/java/com/newrelic/tutorials
- id: q1xqan2hovbu
  title: Backend Service
  type: service
  hostname: fullstack-o11y-dotnet
  path: /api/tutorials
  port: 5182
difficulty: basic
timelimit: 600
enhanced_loading: null
---
While you were waiting on the loading screen a moment ago, Instruqt was deploying the environment used in this workshop on the Linux VM you are accessing via this page.

This is what Instruqt did behind the scenes:
- Installed Java 21, Maven, and PostgreSQL, which are needed for this workshop.
- Cloned all the files from GitHub for this workshop.

***

Now that the deployment has been completed, run the following commands to validate all the required modules are installed and set up properly.

Verify Node & NPM
=================
Node.js is needed for this workshop for the frontend app.

Run the following cmd in [button label="Terminal 1"](tab-0), and you should see **v22.x.x**.

```run
node -v
```

Run the following cmd in [button label="Terminal 1"](tab-0), and you should see **v10.x.x**.

```run
npm -v
```


Verify Java & Maven
=================
Run the following cmd in [button label="Terminal 1"](tab-0), and you should see **21.x.x**.

```run
java -version
```

Run the following cmd in [button label="Terminal 1"](tab-0), and you should see **Apache Maven 3.9.x**.

```run
mvn -v
```

***

- run ``ls`` to see all the files in this Java app were cloned properly from Github.
- run the command below verify the PATH environment variable is available and set to **development**. This is because we are going to run the apps in development mode
```bash,run
echo $NODE_ENV
```

***

Start & Verify your Java API service
=================
Now, Run the following cmd in [button label="Terminal 1"](tab-0) to start the application and seed the database.

```run
./manage-java.sh seed && ./manage-java.sh start
```

Switch to [button label="Terminal 2"](tab-1) & test your Java server. by running the command you will get the URL, open this in a new tab

```run
echo https://$HOSTNAME.$_SANDBOX_ID.instruqt.io:5182/api/tutorials/categories
```

Should return JSON in response
```json
[{"id":"1","category":"Frontend Development"},{"id":"2","category":"Backend Development"}]
```

> [!IMPORTANT]
> Once you have **validated** that the deployment has gone well, proceed to next step. If you encountered issues /or the environment is not properly set up, stop the server by pressing `Ctrl+C` in [button label="Terminal 1"](tab-0), return to the home screen of this lab, exit the current session, and redeploy the workshop.

Instrumenting Java application with APM
=================

In the previous section, we simply verified our application. Now, its time to instrument it

### Step 1 - Install the New Relic Java Agent

If your server is still running, stop it by pressing `Ctrl+C` in [button label="Terminal 1"](tab-0).

Then run the following cmd in [button label="Terminal 1"](tab-0) to download the agent,
```run
curl -O https://download.newrelic.com/newrelic/java-agent/newrelic-agent/current/newrelic-java.zip
```

```run
unzip newrelic-java.zip -d /root/
```

---
### Step 2 - Configure the New Relic Agent

Set up the required environment variables for New Relic monitoring.

Run the following cmd in [button label="Terminal 1"](tab-0),
```copy,run
export NEW_RELIC_APP_NAME="java-tutorials-server"
```

```copy,run
export NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
```

```copy
export NEW_RELIC_LICENSE_KEY=<YOUR INGEST LICENSE KEY>
```


> [!IMPORTANT]
> Replace `<YOUR INGEST LICENSE KEY>` with your actual New Relic license key from your New Relic account.

---
### Step 3 - Start the Instrumented Java Service

Now start your Java service with New Relic monitoring enabled using the `-javaagent` flag.

Switch to [button label="Terminal 1"](tab-0) and run:
```run
export JAVA_TOOL_OPTIONS="-javaagent:/root/newrelic/newrelic.jar"
mvn spring-boot:run
```

The New Relic agent will automatically instrument your Java application when it starts up.

---
### Step 4 - Generate Traffic & Test Data

Switch to [button label="LoadGen Terminal"](tab-2) & generate some API traffic to create monitoring data.

Generate continuous load to create more monitoring data:
```run
npx load-generator --workers 4 --pause 500 https://$HOSTNAME.$_SANDBOX_ID.instruqt.io:5182/api/tutorials https://$HOSTNAME.$_SANDBOX_ID.instruqt.io:5182/api/tutorials/categories
```

You can also test other endpoints:
```run
curl https://$HOSTNAME.$_SANDBOX_ID.instruqt.io:5182/api/tutorials/categories
```

> [!NOTE]
> Press `Ctrl+C` to stop the load generation when you have enough data.

---
### Step 5 - Verify APM in New Relic

Head to **New Relic > APM & Services**. If everything is configured correctly, you should see an entity with the name **"java-tutorials-server"** under the **APM & Services** screen in New Relic.

You should see:
- Transaction traces from your API calls
- Database queries (PostgreSQL)
- Response times and throughput metrics
- Error rates and performance data

> [!NOTE]
> Please wait a few minutes for the service to appear in New Relic UI. It may take 2-5 minutes for data to start appearing.

![APM in New Relic](../assets/instruqt-APM-summary.png)
