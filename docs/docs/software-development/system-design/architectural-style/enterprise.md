---
title: Enterprise Architecture
---

## Overview

:::info Does Enterprise Architecture Mean an Application with Lots of Users?
No, Enterprise Architecture is not about an application with lots of users, but rather about the strategic planning and alignment of an organization's entire IT infrastructure and processes with its business objectives.
:::

Enterprise Architecture (EA) is a strategic framework that aligns an organization's business objectives, processes, and technology to improve efficiency, agility, and effectiveness. It provides a comprehensive view of an organization’s structure, integrating various components such as information systems, business functions, and technology infrastructure. EA ensures that all parts of the organization work together to achieve the business goals while adapting to changes and leveraging new opportunities. It involves methodologies and tools for planning, designing, and governing the enterprise's systems and processes, ensuring they support and drive the overall business strategy.

EA is fundamentally * **an approach** rather than a specific technical guidance*. It focuses on how to use IT resources effectively to support and enhance the overall strategy and operations of an organization. Below is an architecture overview diagram.

:::info Enterprise Architecture diagram
The architecture overview provided in the below diagram was a generalized depiction to illustrate the core elements of Enterprise Architecture (EA), not tied to any specific framework like TOGAF, Zachman, or FEAF. The intent was to give a conceptual understanding of how EA integrates business goals, processes, information systems, and technology infrastructure.
:::

![architectural-style](/img/software-development/system-design/architectural-style/ea.webp)

Source: [visual-paradigm - What is Enterprise Architecture Diagram?](https://online.visual-paradigm.com/knowledge/business-design/what-is-enterprise-archtiecture-diagram/)

1. **Business Architecture**: Defines the business strategy, governance, organization, and key business processes.
2. **Data Architecture**: Describes the structure of an organization's data assets and data management resources.
3. **Application Architecture**: Provides a blueprint for individual applications, their interactions, and relationships to core business processes.
4. **Technology Architecture**: Encompasses the hardware and software infrastructure required to support the deployment of critical applications.
5. **Security Architecture**: Defines security policies and controls to ensure the security of information and technology assets.
6. **Governance**: Provides a framework for decision-making, ensuring alignment, and managing change.

## Top 3 EA frameworks

:::info Is there one common EA framework that can adopt all scenarios?  
There isn't a single "common" Enterprise Architecture (EA) framework universally adopted by all organizations; rather, the choice of framework depends on the specific needs, goals, and context of the organization. Companies typically choose one framework that aligns best with their requirements or even adapt elements from multiple frameworks to create a tailored approach.
:::

Here are three well-known Enterprise Architecture (EA) frameworks:

1. **TOGAF (The Open Group Architecture Framework)**:
   - **Overview**: TOGAF is a comprehensive framework that provides a structured approach for designing, planning, implementing, and governing enterprise information architecture.
   - **Features**: It includes a detailed method for developing an EA (the ADM – Architecture Development Method) and tools for implementation.
   - **Use Case**: Suitable for large organizations aiming for a standardized approach to EA.

2. **Zachman Framework**:
   - **Overview**: The Zachman Framework is a taxonomy for organizing EA artifacts, based on six interrogatives (What, How, Where, Who, When, Why) and six perspectives (Planner, Owner, Designer, Builder, Implementer, Worker).
   - **Features**: It emphasizes creating a holistic view of the enterprise and its information systems.
   - **Use Case**: Useful for structuring and classifying various enterprise artifacts and models.

3. **Federal Enterprise Architecture Framework (FEAF)**:
   - **Overview**: Developed by the U.S. Federal Government, FEAF provides a common methodology for government agencies to develop and manage their architectures.
   - **Features**: Includes models for business, data, service, technology, and performance.
   - **Use Case**: Ideal for federal or governmental organizations needing standardization and alignment across agencies.

## Enterprise Architects vs Domain Architects

![sap-da-ea](/img/software-development/system-design/architectural-style/sap-da-ea.webp)

Source: [SAP - Enterprise Architect vs. Domain Architect vs. Developer](https://www.leanix.net/en/wiki/ea/enterprise-architect-vs-domain-architect-vs-developer#:~:text=Whether%20it's%20'Data%20Services%2C',challenges%20of%20their%20specific%20area.)

Traditionally, **Domain Architects** often work separately from the **Enterprise Architecture (EA)** team, focusing on specific areas such as business, data, application, or technology domains. They are responsible for the architecture within their domain, while the EA team oversees the broader, organization-wide architecture strategy, ensuring alignment across domains. Below is the key distinctions

- **Domain Architects:**
  - Specialize in particular areas (e.g., data, applications).
  - Ensure the architecture within their domain aligns with overall strategies.
  - Work closely with specific teams to implement domain-specific solutions.
- **Enterprise Architects:**
  - Oversee the comprehensive architecture strategy.
  - Ensure consistency and integration across various domains.
  - Focus on aligning technology with business goals across the entire organization.

This separation can lead to silos and misalignment if not properly managed. Integrating their efforts can enhance coherence and adaptability across the organization.

## Enterprise Architecture Is Dead?

> This section is a summary of [Enterprise Architecture Is Dead; Long Live Enterprise Architecture](https://www.linkedin.com/pulse/enterprise-architecture-dead-long-live-daniel-angelucci/)

I found the point of view of [this LinkedIn post](https://www.linkedin.com/pulse/enterprise-architecture-dead-long-live-daniel-angelucci/) is insightful. In this post, Daniel argues that traditional **Enterprise Architecture (EA)** is becoming obsolete due to its inflexibility and the rapidly evolving business and technology landscapes. The classical EA, which focuses on extensive documentation, rigid frameworks, and long-term planning, often fails to deliver value in today's fast-paced environment.

**Key Points:**

1. **Challenges with Traditional EA:**
   - **Slow Adaptation:** Traditional EA cannot keep up with the speed of modern business changes and technological advancements.
   - **Bureaucracy:** It often involves cumbersome processes and excessive documentation, leading to inefficiency.
   - **Misalignment:** There's a frequent misalignment between EA outputs and actual business needs, leading to irrelevant or outdated solutions.
2. **Need for a Modern Approach:**
   - **Agility and Flexibility:** EA needs to evolve to be more agile, focusing on delivering quick, incremental value rather than comprehensive, long-term blueprints.
   - **Use Case Focus:** Modern EA should emphasize specific use cases that directly align with and support business goals and needs.
   - **Collaborative Efforts:** Leveraging domain-specific expertise from **domain architects** within organizations can ensure that EA remains relevant and practical.
3. **Future of EA:**
   - **Integrated Teams:** Future EA practices should integrate closely with development and operations teams to stay aligned with actual implementation and operational realities.
   - **Continuous Evolution:** EA should be viewed as a continuous, evolving practice rather than a set of static documents.
   - **Value-Driven:** The primary measure of success for EA should be the tangible value it provides to the business, rather than the completion of predefined architecture tasks.

In summary, Angelucci calls for a shift from traditional EA to a more dynamic, **value-focused approach** that can effectively respond to and drive business and technological changes.

## Let's call it Value Stream Architects

Let's consider renaming "**Domain Architects**" to "**Value Stream Architects**". This emphasizes optimizing value delivery, aligning with agile principles, and enhancing business understanding. It fosters better collaboration across functions and clearer communication, leading to more effective integration with business goals and modern architectural practices.

