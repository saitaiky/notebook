---
title: Others
sidebar_position: 3
---

## Glossary
Docker image and container image are the same term for the same thing.

## Commands
```
// -it means
// The t gives us a pseudo tty or a prompt similar to what you would have through ssh.
// The i allows us to keep that session open so that we can keep running more commands.
docker container run -it

// bash shell with -it, will give you a terminal inside the running container
docker container run -it proxy nginx bash

// If we exit the bash shell
// The containers only run as long as the command that it ran on startup runs. Since we changed it to Bash, simply exiting Bash quit it
exit
```


## What's Alpine? 

Alpine is small simple and secure. Alpine Linux is a security-oriented, lightweight Linux distribution based on musl libc and busybox. It's actually only 5MB in size which is 30x smaller than Debian(123MB).  The neat thing about Alpine is that it also comes with its own package manager.


### Cost benefit 

The Main Benefit Is Shrinkage - In most other contexts (such as doing laundry), “shrinkage” is a pretty bad thing, but in the world of Docker, you should look forward to it because it means your Docker images will be smaller. Being able to cut your image size down by over 100MB is a big deal if you're using cloud storage like AWS S3.

### Kickstart server faster 

When pulling down new Docker images onto a fresh server, you can expect the initial pull to be quite a bit faster on Alpine. The slower your network is, the bigger the difference it will be.

If you’re in a position where you have auto-scaling in place and are spinning up A LOT of servers then this is a pretty big deal. It means your servers will be ready to accept traffic at a faster rate.

If you’re not spinning up a lot of servers then the speed benefit goes way down, but hey, you’re still saving over 100MB in data transfer and storage costs.


### Alpine is Secure

Another perk of being much smaller in size is that the surface area to be attacked is much less.

When there’s not a lot of packages and libraries on your system, there’s very little that can go wrong.

A few years ago there was a nasty Bash exploit that let an attacker gain control over your machine if you were afflicted by what they named “ShellShock”.

Alpine was immune to that attack because Bash isn’t installed by default.
