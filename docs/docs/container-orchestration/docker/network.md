---
title: Network
sidebar_position: 2
---

## 3 different networks
When you install docker it creates three networks automatically - Bridge, Host, and None. Of which, Bridge is the default network a container gets attached to when it is run. To attach the container to any other network you can use the `--network` flag of the run command.

### None
This mode **will not configure any IP for the container** and **doesn’t have any access to the external network as well as for other containers**. It does have the loopback address and can be used for running batch jobs.

```
# docker run -it --network=none ubuntu:14.04 /bin/bash
root@66308c6686be:/# ifconfig
lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

# 
# docker inspect 66308c6686be | grep -i ipaddr
            "SecondaryIPAddresses": null,
            "IPAddress": "",
                    "IPAddress": "",
```

### Host

> TL;DR - Even the IP configuration is same as the host system's IP configuration

In this mode **container will share the host’s network stack and all interfaces from the host will be available to the container**. The container’s host name will match the host name on the host system. 

For instance, if you run a container on port 5000, it will be accessible on the same port on the docker host without any explicit port mapping. The only downside of this approach is that you can not use the same port twice for any container.

```
# docker run -it --net=host ubuntu:14.04 /bin/bash
root@labadmin-VirtualBox:/# hostname
labadmin-VirtualBox
```

```
root@labadmin-VirtualBox:/# ip addr | grep -A 2 eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:b5:82:2f brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.15/24 brd 10.0.2.255 scope global eth0
       valid_lft forever preferred_lft forever
3: lxcbr0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN group default 
root@labadmin-VirtualBox:/# exit
exit

HOST SYSTEM IP CONFIGURATION

# ip addr | grep -A 2 eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:b5:82:2f brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.15/24 brd 10.0.2.255 scope global eth0
       valid_lft forever preferred_lft forever
3: lxcbr0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN group default 
```

In host and none mode are not configured directly but default bridge network can be configured as well as create your own user-defined bridge networks.

### Bridge Mode

It is the Docker **default networking mode** which will enable the connectivity to the other interfaces of the host machine as well as among containers. 

The **Bridge** network assigns IPs in the range of 172.17.x.x to the containers within it. The containers can reach each other using their names. This is made possible by an Embedded DNS which runs on the address **127.0.0.11**. To access these containers from outside you need to map the ports of these containers to the ports on the host. 

- Accessibility to other containers is possible in bridge mode.
- Connectivity to external network.
- Connectivity to host machine

![Default network](/img/container-orchestration/docker/default-network.png)
Source: [Docker Networking](https://towardsdatascience.com/docker-networking-919461b7f498)


We can define a user-defined network for this purpose by using the following command and assigning this network when running the containers.
```
docker network create \
	--driver bridge \
	--subnet 182.18.0.0/16 \
	user-def
```

![Seperated network](/img/container-orchestration/docker/seperated-network.png)
Source: [Docker Networking](https://towardsdatascience.com/docker-networking-919461b7f498)

Can't have the same port at the host level
As a reminder, on any interface on your host, you can't listen on more than one port for multiple containers. So, you can't have two containers listening on the port 80 at the host level. Only one can do that. If you try to start another container, it would actually error out and say that there's already something else on that port. That's not a Docker limitation; that's just a limitation of how IP networking typically works.


## DNS

Because using IP to communicate amoung containers is anti-pattern. So a built-in solution for this is **DNS naming**. Docker uses the container names as the equivalent of a host name for containers talking to each other.

> Continaers shouldn't rely on IP's for inter-communication
It may not change very much on your local machine, but if you stop containers, and then you start the same containers, and you start them in a different order, they may not have the same IP address. But their host names, or their container names, will always be the same.

Always create custom networks since it's just easier that way than doing a `--link` all the time.

- **User-defined bridges** provide automatic DNS resolution between containers
- Containers on the **default bridge network** can only access each other by IP addresses, unless you use the [--link option](https://docs.docker.com/network/links/), which is considered legacy. On a user-defined bridge network, containers can resolve each other by name or alias.

    Imagine an application with a web front-end and a database back-end. If you call your containers web and db, the web container can connect to the db container at db, no matter which Docker host the application stack is running on.

    If you run the same application stack on the default bridge network, you need to manually create links between the containers (using the legacy --link flag). These links need to be created in both directions, so you can see this gets complex with more than two containers which need to communicate. Alternatively, you can manipulate the /etc/hosts files within the containers, but this creates problems that are difficult to debug.
## Further reading

- [Differences between user-defined bridges and the default bridge](https://docs.docker.com/network/bridge/#differences-between-user-defined-bridges-and-the-default-bridge)



