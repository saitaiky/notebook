---
title: Serverless vs K8s
---

> Reference : https://chaordic.io/blog/serverless-vs-kubernetes/

## When should we use Serverless instead of Kubernetes?

We will preface our recommendation here with this:

We would suggest using Serverless in every use-case, which does not strictly fit the criteria of using something else. When circumstances do not push us strongly away from Serverless, as described in the Kubernetes section, we believe the benefits heavily outweigh the drawbacks.

We would also state that this recommendation specifically holds true for the Amazon Web Services flavour of Serverless. While Azure and Google Cloud also have Serverless offerings as of this being written in late 2020, the AWS offering has a higher level of maturity, combined with the breadth of functionality to implement almost any kind of system imaginable.

We see five specific motivations making Serverless a good option:

### Time-to-market is a priority

You want to enable developers to iterate quickly and focus on putting new and improved functionality in front of users without being constrained by access to environments or infrastructure. Once past the initial learning curve, the productivity of a FaaS approach is quite impressive. Further, if you follow our [five practices for Serverless productivity](https://chaordic.io/blog/serverless-distributed-system-productivity/), the cycle from code change to change deployed in an environment can be near instantaneous.

### You want to shift operational effort to enabling business innovation

Good DevOps skills are hard to come by. Serverless does not eliminate the need for it either. We still need these skills for CI/CD automation, observability, security and setting system constraints. But since we no longer need to babysit resources such as disks, servers or networks, the effort is significantly reduced. This allows us to better put to use the skills and people we already have - their efforts will be shifted from fire-fighting and operations to enabling business & developer productivity.

### Your use-case translates well to being implemented using FaaS & an event-driven approach

An absolute pre-requisite is that your system can be implemented with stateless functions with an event-driven approach. Outside of a small number of use-cases, this should generally not be a problem for any modern system.

### You prefer operational cost scaling with use & utility: 0 use = $0 cost

Especially for startups and new products in established companies, the near 0 cost of unused Serverless code is very appealing. No need to sweat about wasting money on running infrastructure for code that may not be used, nor if there is a sudden surge in popularity.

### Your system has an unpredictable load profile

Capacity planning is difficult and either takes great effort, or devolves to guesswork. Serverless removes 90% of the need for this.

The elastic scaling means we primarily need to concern ourselves with the provisioned quotas of our system for the various services we use. While still technically capacity planning, and not quite the "unlimited scalability" promised by some Serverless proponents, it is very close. Some educated guesses and back-of-the-envelope calculations will ensure you have the right quotas set. This is much easier than trying to size Kubernetes clusters correctly with number of nodes, node sizing, disks etc, not to mention that you still won't pay much at all for any excess capacity you may have provisioned.

With near infinite elastic scaling and close to 0 overhead cost, you can sleep easier at night.

## When should we use Kubernetes instead of Serverless?

### You are building stateful components

If your system is made up of stateful components, for instance in-memory caches and other type of services that rely on some internal state, they are unsuitable to be built as Serverless functions. FaaS requires a heavy emphasis on stateless services/functions.

> Future reading: [Stateful vs Stateless](/tech-concepts/stateful-vs-stateless)

### You have long running tasks

AWS lambda has an upper limit of 15 minutes runtime, after that a function will be terminated whether it is done or not. If you have long running batch-job type tasks, Serverless may be entirely unsuitable. Likewise, even if it is possible to break down a job into smaller parts that fit within the constraints, the data-transport cost (in time, and money) may exceed any benefit from running Serverless.

### Your system has real-time or low-latency requirements

You do not have control of the infrastructure, the precise resource allocation provided, or even concurrency in a Serverless model. If your system has real-time, or very low-latency requirements, non-Serverless solutions are preferable. Many are likely going to say *"we want low latency!"*, but this does not automatically mean Serverless is unsuitable. Serverless can be very fast, but, if consistent <50ms response times for API's are business critical, Serverless is not suitable. There are however very few cases in real life where <50ms response times are crucial, and I'd venture a guess in many existing systems, those sort of response times are also the exception rather than the norm. As a side note, if requirements are truly real-time, this is an indicator your system may be more suited for running on bare-metal.

### For existing systems, which are not easily migrated to Serverless

It is often easier to "lift-and-shift" systems in their entirety by putting them in Docker containers. If a service is truly stateless, it may be possible to work around this particular issue by the use of so called ["shims"](https://en.wikipedia.org/wiki/Shim_(computing)), which wrap the API's of the libraries the existing system uses. Shims may be useful even with Greenfield Serverless projects, in order to reduce vendor lock-in and keep the target runtime flexible.

Existing systems that are not easily migrated, are highly likely to fit one of the previous three criteria mentioned.

### Your system has even, predictable & high load over time

While Serverless gives you the ability for elastic scaling and costs that scale with the utility of the system, it is not necessarily cheaper under all circumstances. If you have a high and predictably even load 24/7/365, running on Kubernetes or traditional infrastructure may actually be cheaper.

If we inspect the concept of "even" load, we quickly notice that this is actually rarely the case with most systems. Business applications have peaks during office hours. eCommerce might peak during busy holiday periods. Trading system loads are highly coupled to trading hours, with open and close particularly peaky. Finally, it may turn out the direct cost of Serverless is higher than Kubernetes, but this may still be offset by lower operational costs in human effort.


## Conclusions

As we have mentioned in a [previous post](https://chaordic.io/blog/from-punch-cards-to-serverless/), we believe Serverless & Kubernetes will live side-by-side in the future, with the lines blurring over time.

Things change quickly: in 2018, AWS Serverless was not yet ready for prime-time other than for a small number of use-cases. We did our first forays into Serverless in 2017, but even our 2018 recommendation would have had a very different balance than today.

But the relentless pace with which AWS has improved its services across the board makes Serverless the go-to infrastructure choice for any organisation that wants to move fast in 2020.