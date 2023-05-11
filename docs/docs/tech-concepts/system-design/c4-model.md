
# C4 model

The C4 model is a visual modeling language used to describe software architecture at different levels of abstraction, from a high-level system context diagram to detailed component diagrams. The model was developed by Simon Brown and is intended to be a lightweight, pragmatic approach to software architecture that can be easily understood and communicated by all stakeholders.

The C4 model consists of four levels, each of which corresponds to a different level of abstraction:

Level 1: System Context Diagram
At this level, the software system is depicted as a single box with external actors represented as stick figures. This diagram shows the system's relationships to other systems, people, and organizations.

Level 2: Container Diagram
At this level, the system is decomposed into containers, which are high-level runtime entities such as web servers, databases, and messaging queues. The containers are depicted as boxes with their dependencies shown as lines between them.

Level 3: Component Diagram
At this level, each container is decomposed into components, which are the building blocks of the system. Components are represented as boxes with their dependencies shown as lines between them.

Level 4: Code Level
At this level, the internal details of each component are shown, including classes, modules, and other code artifacts.

Here is an example of a C4 model diagram:

![C4 model](/img/tech-concepts/system-design/c4-overview.png)
Source: [C4 Model, Architecture Viewpoint and Archi 4.7](https://www.archimatetool.com/blog/2020/04/18/c4-model-architecture-viewpoint-and-archi-4-7/)




This is a Level 1 diagram that shows the system context for an online shop. The customer and payment system are shown as external actors, with the online shop depicted as a single box. The relationships between the online shop, payment gateway, and payment system are shown as arrows.

The C4 model is a useful tool for software architects and developers to communicate the design of a software system to a wide range of stakeholders, from business analysts to developers and operations staff. By using a consistent modeling language, it helps ensure that all stakeholders have a shared understanding of the system's architecture and how it works.