---
title: Data modeling
---

## 3 Levels Of Data Abstraction in data modeling

In data modeling, there are typically three levels of data abstraction, known as the three-schema architecture. Each level represents a different perspective of the data and serves a specific purpose in the data modeling process. 

### External Data Model / User View

![erd](/img/software-development/database/data-modeling/logical.webp)

Source: [What is Data Modelling? Types (Conceptual, Logical, Physical)](https://www.guru99.com/data-modelling-conceptual-logical.html)

- It is the **view level** to answer - WHAT the system contains 
- The External Schema represents the user's view of the data.
- It defines how individual applications or users perceive the data and the specific data elements they need to access.
- This level provides a customized view of the data to different user groups, tailoring the data representation to their specific requirements.


### Conceptual Data Model / Logical View

![erd](/img/software-development/database/data-modeling/conceptual.webp)

Source: [What is Data Modelling? Types (Conceptual, Logical, Physical)](https://www.guru99.com/data-modelling-conceptual-logical.html)

- It is **conceptual level** to answer - how of the system should be implemented regardless of the DBMS:
- The Conceptual Schema represents the overall logical structure of the entire database.
- It focuses on the high-level, abstract representation of the data, defining the relationships between major entities and the overall data model.
- This level is designed to be independent of any specific database management system (DBMS) and is concerned with capturing the essential business entities and their relationships.


### Internal Data Model / Physical View

![erd](/img/software-development/database/data-modeling/physical.webp)

Source: [What is Data Modelling? Types (Conceptual, Logical, Physical)](https://www.guru99.com/data-modelling-conceptual-logical.html)

- It is the **physical level** to answer - the how of the system will be implemented using a specific DBMS system:
- The Internal Schema represents the physical storage and implementation details of the database on a specific DBMS or hardware platform.
- It describes how the data is physically stored, indexed, and accessed within the underlying storage system.
- This level is concerned with optimizing performance and storage efficiency.

The three-schema architecture provides a clear separation of concerns between users' views, logical data organization, and physical storage implementation, enabling data modeling to be more organized, flexible, and maintainable. It also allows changes at one level without affecting the other levels, providing a higher degree of data independence and adaptability.


## Data Modelling Techniques

Data modeling is a technique used to create a conceptual representation of data and its relationships within a system. It involves defining the structure, attributes, constraints, and interdependencies of data elements to provide a clear and organized view of how data is organized and used in an organization or application.

The main two types of Data Modeling Techniques are Entity Relationship (E-R) Model and UML (Unified Modelling Language).

### ERD

![erd](/img/software-development/database/data-modeling/erd.png)

Used for modeling relational databases, ER diagrams represent entities, attributes, and relationships between objects. They are suitable for visualizing database schemas and top-level data views.


### UML - Class diagram

![uml_class_diagram](/img/software-development/database/data-modeling/uml_class_diagram.png)

Derived from the Unified Modeling Language, these diagrams are mainly used for object-oriented programming and represent classes, attributes, methods, and various types of relationships between objects.


### Others

#### Data Dictionary

![data_dictionary](/img/software-development/database/data-modeling/data_dictionary.png)

A tabular representation of data assets, the data dictionary includes lists of tables and their attributes, providing a detailed specification of data assets and can be used in conjunction with ER diagrams for comprehensive data modeling.



## Check

- data modeling techniques graph