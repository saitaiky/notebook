---
title: Health Check
---

## Basic 

- Each container can have three (optional) probes:
    - liveness = is this container dead or alive? (most important probe)
    - readiness = is this container ready to serve traffic? (only needed if a service)
    - startup = is this container still starting up? (alpha in 1.16)

Different probe handlers are available (HTTP, TCP - check if a port opens, program execution)


### Liveness probe

A dead container cannot come back to life, if the liveness probe fails, the container is killed. What happens next depends on the pod's restartPolicy:
- **Never**: the container is not restarted
- **OnFailure or Always**: the container is restarted

:::cautionWhen to use a liveness probe
- To indicate failures that can't be recovered
    - deadlocks (causing all requests to time out)
    - internal corruption (causing all requests to error)
- Use liveness for situation where our incident response would be "just restart/reboot it"
- Do not use liveness probes for problems that can't be fixed by a restart. Otherwise we just restart our pods for no reason, creating useless load
:::


### Readiness probe

- If a container becomes "unready" it might be ready again soon
- If the readiness probe fails:
    - the container is *not* killed
    - if the pod is a member of a service, it is temporarily removed then re-added as soon as the readiness probe passes again

:::cautionWhen to use a readiness probe

- To indicate failure due to an external cause => it won't work before the external cause is fixed anyways
    - database is down or unreachable
    - mandatory auth or other backend service unavailable
- To indicate temporary failure or unavailability => Give it some time before it resume normal
    - application can only service *N* parallel connections
    - runtime is busy doing garbage collection or initial data load
:::


### Startup probe

- Before Kubernetes 1.16, we had to use a fixed approach which using `initialDelaySeconds` parameter to set a rigid delay (always wait X before running liveness and readiness probes)
- `startupProbe` is a flexible approach when a container start time can vary a lot
-  The `liveness` and the `readiness` won't even start until the startup probe is good.

## Settings

### Different types of probe handler

- HTTP request
    - specify URL of the request (and optional headers)
    - any status code between 200 and 399 indicates success
- TCP connection
  - the probe succeeds if the TCP port is open
- arbitrary exec
    - a command is executed in the container
    - exit status of zero indicates success

### Timing and thresholds

- Probes are executed at intervals of `periodSeconds` (default: 10)
- The timeout for a probe is set with `timeoutSeconds` (default: 1)
- A probe can have an `initialDelaySeconds` parameter (default: 0) Kubernetes will wait that amount of time before running the probe for the first time (this is important to avoid killing services that take a long time to start)

If a probe takes longer than that, it is considered as a FAIL
- A probe is considered successful after `successThreshold` successes (default: 1)
- A probe is considered failing after `failureThreshold` failures (default: 3)

### Questions to ask before adding healthchecks

- Do we want liveness, readiness, both?(sometimes, we can use the same check, but with different failure thresholds)
- Do we have existing HTTP endpoints that we can use? 
    - Use web server > exec to call existing services / custom script > TCP (port checking)
- Do we need to add new endpoints, or perhaps use something else? 
    - the convention of endpoints usually are /health, /liveness, and /readiness
- Are our healthchecks likely to use resources and/or slow down the app? How often do you want to do a healthcheck?
    - Remember, this is per container. So, if you had 10 replicas, every time you do this, you're doing it 10 times.
- Do they depend on additional services for the readiness check?  You be careful there because if you add to many dependency checks, it could likely fail more often, depending on if they're in your cluster or outside your cluster. 


## Examples

### HTTP request example

If the backend serves an error, or takes longer than 1s, 3 times in a row, it gets killed.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: rng-with-liveness
spec:
  containers:
  - name: rng
    image: dockercoins/rng:v0.1
    livenessProbe:
      httpGet:
        path: /
        port: 80
      initialDelaySeconds: 10
      periodSeconds: 1
```

### exec example

If the Redis process becomes unresponsive, it will be killed.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: redis-with-liveness
spec:
  containers:
  - name: redis
    image: redis
    livenessProbe:
      exec:
        command: ["redis-cli", "ping"]
```

:::cautionCaveat of using exec
In Kubernetes, we can run a Docker exec in the container and run a script, or any commands, you want on the local system where that container is running. This tends to be the most expensive type of check. It will end up using more resources because it has to launch another shell and run some form of app, or script, that you've written. 

That's a lot more work than the kubelet process simply checking an HTTP port for a response code, or checking a TCP open connection. So, you want to be careful with these.
:::


## Special healthcheck targets

### Healthcheck for container dependencies

Because a HTTP/TCP probe can't check an external dependency, but a HTTP URL could kick off code to validate a remote dependency

If a web server depends on a database to function, and the database is down:
- the web server's **liveness probe** should succeed **(Liveness should only focus on container itself!)**
- the web server's **readiness probe** should fail **(Any container dependency that your app has to have is really only left to readiness!)**


### Healthcheck for worker

What do I do for healthchecks on applications that don't receive connections, and they don't have a built-in tool like a database? Maybe it's a worker process. 

Things that do processing, but they don't have inbound connections.

-   Readiness isn't useful (because workers aren't backends for a service)
-   Liveness may help us restart a broken worker, but how can we check it? We don't want to embed an HTTP server because it is a potentially expensive option
- 2 approaches:
    - Using a "lease" file can be relatively easy: touch a file during each iteration of the main loop. Then the liveness check to check the timestamp of that file from an exec probe
    - Writing logs (and checking them from the probe) also works


