---
title: Database
---

## Relational Databases

Below are the 4 important aspects of relational databases

### SQL

SQL or Structured Query Language is the primary interface used to communicate with Relational Databases. SQL became a standard of the American National Standards Institute (ANSI) in 1986. The standard ANSI SQL is supported by all popular relational database engines, and some of these engines also have extension to ANSI SQL to support functionality which is specific to that engine. SQL is used to add, update or delete rows of data, retrieving subsets of data for transaction processing and analytics applications, and to manage all aspects of the database.

### Data Integrity 

Data integrity is the overall completeness, accuracy and consistency of data. Relational databases use a set of constraints to enforce data integrity in the database. These include primary Keys, Foreign Keys, ‘Not NULL’ constraint, ‘Unique’ constraint, ‘Default’ constraint and ‘Check’ constraints. These integrity constraints help enforce business rules on data in the tables to ensure the accuracy and reliability of the data. In addition to these, most relation databases also allow custom code to be embedded in triggers that execute based on an action on the database.

### Transactions

> TL;DR - If one of a SQL statement in a db transaction fails, the whole db transaction will be forbidden

A database transaction is one or more SQL statements that are executed as a sequence of operations that form a single logical unit of work. *Transactions provide an "all-or-nothing" proposition, meaning that the entire transaction must complete as a single unit and be written to the database or none of the individual components of the transaction should go through.* 

In the relation database terminology, a transaction results in a COMMIT or a ROLLBACK. Each transaction is treated in a coherent and reliable way independent of other transactions.

### ACID Compliance

All database transactions must be ACID compliant or be Atomic, Consistent, Isolated and Durable to ensure data integrity.

- **Atomicity** requires that either transaction as a whole be successfully executed or if a part of the transaction fails, then the entire transaction be invalidated. 
- **Consistency** mandates the data written to the database as part of the transaction must adhere to all defined rules, and restrictions including constraints, cascades, and triggers. 
- **Isolation** is critical to achieving concurrency control and makes sure each transaction is independent unto itself.
- **Durability** requires that all of the changes made to the database be permanent once a transaction is successfully completed.



