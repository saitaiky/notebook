


## Liveness vs readiness

**Q1: Liveness, readiness, or both?**
To answer that question, we need to see the app run for a while

- Do we get temporary, recoverable glitches?
    - then use readiness
- Or do we get hard lock-ups requiring a restart?
    - then use liveness

**Q2: Do we have HTTP endpoints that we can use?**

We need to find a HTTP endpoint which
- don't seem to perform anything complex or expensive
- don't seem to call other services



## Generate traffic to monitor a service

### Choose your healthcheck type wisely

> TL;DR - Don't use liveness to healthcheck performance which degrades due to external pressure

Apache Bench is designed to test a HTTP endpoint, but its main purpose is to throw a ton of connections at something all at once. So, with this command, we're going to have ab, which is the Apache Bench binary.

1. The `-c` parameter indicates the number of concurrent requests
2. The final `/1` is important to generate actual traffic service load (otherwise we would use the ping endpoint, which doesn't sleep 0.1s per request - check below python code for explanation)
3. If you download Apache Bench yourself on your machine, and you're also able to talk to the ClusterIP directly because maybe you're on Linux, then you don't have to do this shpod. (**shpod** is a helper pod which contain some libraries we use in a course)

The python code which handle the service endpoint request. This is a function which simulate a crypto hash valuable for the miner the solve. It has a `time.sleep(0.1)` to act like a **load** of a request. If you use a single threaded system and it receives a ton of requests at the same time, it may fails to respond with in the **readiness prob** that you set in K8s yml file.

:::dangerWhat will happen if you use **liveness prob** to check an endpoint which its performance degrades due to external pressure
1. It respond time will be above a given threshold, the liveness probe starts failing(about 10 concurrent requests per backend should be plenty enough)
2. When the liveness probe fails 3 times in a row, the container is restarted
3. During the restart, there is less capacity available
    - Meaning that the other backends are likely to timeout as well
    - Eventually causing all backends to be restarted
    - And each fresh backend gets restarted, too

This goes on until the load goes down, or we add capacity. This wouldn't be a good healthcheck in a real application!
:::


```python
# https://github.com/dockersamples/dockercoins/blob/master/rng/rng.py
@app.route("/<int:how_many_bytes>")
def rng(how_many_bytes):
    # Simulate a little bit of delay
    time.sleep(0.1)
    return Response(
        os.read(urandom, how_many_bytes),
        content_type="application/octet-stream")
```

Attach a pod command line  and use Apache Bench to send requests for healthcheck.
```bash
kubectl attach --namespace=shpod -ti shpod
ab -c 10 -n 1000 http://<ClusterIP>/1
```

### Readiness to check Independent service (e.g. Redis) 

A liveness probe is enough.(it's not useful to remove a backend from rotation when it's the only one)We could use an exec probe running redis-cli ping

Readiness checks don't add a lot of value when there's not any level of redundancy because they're really meant for pulling something out of a service. Now, technically, we have a service with redis, but that's just so that it has a stable endpoint and not for multiple container pods that we need to switch back and forth between. That's not why we have it.

So, in this case, if we had a **readiness** check, all it would do is make sure that we couldn't access redis. **liveness** is enough. You may use the redis command line `redis-cli ping` to check its health.



## Zombie Problem and PID 1 process (Liveness check on redis container)

> For more details about Zombie problem in Linux, check [Process](/linux/process) in Linux section.

Linux

- When using exec probes, we should make sure that we have a zombie reaper
- When a process terminates, its parent must call wait()/waitpid() (this is how the parent process retrieves the child's exit status)
- In the meantime, the process is in zombie state (the process state will show as Z in ps, top ...)
- When a process is killed, its children are orphaned and attached to PID 1
- PID 1 has the responsibility of reaping these processes when they terminate

--------

- On ordinary systems, PID 1 (/sbin/init) has logic to reap processes
- In containers, PID 1 is typically our application process (e.g. Apache, the JVM, NGINX, Redis ...)
- These do not take care of reaping orphans
- If we use exec probes, we need to add a process reaper
- We can add [tini](https://github.com/krallin/tini) to our images or [share the PID namespace between containers of a pod](https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/)(and have gcr.io/pause take care of the reaping)

Discussion of this in Video - [10 Ways to Shoot Yourself in the Foot with Kubernetes, #9 Will Surprise You](https://www.youtube.com/watch?v=QKI-JRs2RIE)



### Tini and redis ping in a liveness probe

1. Add tini to your own custom redis image
2. Change the kubercoins YAML to use your own image
3. Create a liveness probe in kubercoins YAML
4. Use exec handeler and run tini -s -- redis-cli ping
5. Example repo here: github.com/BretFisher/redis-tini

We're going to have it run tini. We're telling tini then to run the redis CLI for us. In case there's anything that goes wrong with the redis CLI when it's doing that ping command, maybe it times out, whatever, then it'll be tini's job to reap it, or make sure that it properly has a parent, which is tini, and then properly shut down when the exec quits. 