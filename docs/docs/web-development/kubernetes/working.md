









Unlike docker which is all about build, ship and run. K8s is not designed to be a building engine. Technically, if you have Kubernetes running on top of Docker, you can still run Docker commands on those servers. We are needing to pull images into our cluster. We need to pull them from a registry. A registry is the way you want to get stuff into Kubernetes. 









The Docker Official Images are a curated set of Docker repositories hosted on Docker Hub. In registry terms means it's a library image, or a root image,











So, here's a couple of tips. 


Look at its build system. See if it has a way to automate the building of images for you like DockerHub does. 


Look at its multi-user features to make sure that it will handle the growth of your team or it will integrate with existing authentication systems you already use.


 Then lastly, really, an image registry is largely just a storage system. It's a huge HTTP-based storage system that sends things through HTTP, but it stores them on hard drives. There's a lot of work there. There's garbage collection of old images and image layers. There's caching of different registries so that you can have downstream registries and master registries. There's even replication between registries so that you can have a global system of registries if you want to run your own. 

====================================


