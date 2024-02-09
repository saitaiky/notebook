---
title: Authorization (Access control)
---

Authorization is the process of defining and enforcing access policies - that is, what you can do once you're authenticated.

## Authorization

Authorization is a crucial step that follows user authentication, focused on delineating users' access to specific resources. This process is vital to prevent unauthorized access to sensitive information. The principle of least privilege underpins most access policies, meaning users are granted only the essential permissions they need to perform their tasks.

Here are the primary models for managing access:

- **Role-Based Access Control (RBAC)**: Assigns users to roles like 'admin,' 'member,' or 'owner,' with predefined permissions.
    - RBAC is straightforward—e.g., a salesperson might access customer data specific to their region. 
- **Attribute-Based Access Control (ABAC)**: Grants permissions based on user attributes (e.g., job title, certifications) and environmental factors (e.g., location). Also referred to as Policy-Based Access Control (PBAC).
    - ABAC is more dynamic and can adapt to changes such as a security incident, allowing for custom access arrangements without predefined roles. An infosec team dealing with a breach might need access adjustments which could be cumbersome with RBAC but more efficiently handled with ABAC.
    - ABAC also accommodates users with multiple roles—such as editors who are also authors. It provides the flexibility to access various system parts as needed based on their multiple attributes.
    - If you're building a large, dynamic system in which users' needs change frequently and/or users can embody several different attributes, *we recommend going with ABAC, but RBAC works well in simple cases*.
- **Access Control Lists (ACL)**: Provides a detailed list of permissions for each user or entity, similar to app permissions on a smartphone.
    - ACL is more granular, often used to control access to individual files, whereas ABAC and RBAC are implemented as broader organizational policies.


## OAuth

