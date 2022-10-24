---
title: 'YMAL'
---

## Always look at the YAML information before you apply it to your system

Because `kubectl apply` is the new `curl | sh`, so essentially, treat the YAML like it's a Superuser, because it can..
- starts bitcoin miners on the whole cluster
- It could hide resources in a non-default namespace so that you didn't see them.
- it could hide things in the system namespace so you wouldn't really pay attention to that if you're just using a default. 
- It could do things like bind mount host file systems as root.
- It could insert SSH keys into the root account of the physical server.
- It has root on the host machine.It could encrypt data and cause you to have a ransomware situation.


