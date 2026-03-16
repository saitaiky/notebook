---
title: Mindshift from Relational Databases to DynamoDB (NoSQL)
description: NoSQL design patterns for DynamoDB including denormalization, single-table design, access pattern optimization, and salting partition keys for hot partition prevention.
keywords:
  - aws
  - amazon web services
  - database
  - shifting the mindset
  - mindshift from relational databases to dynamodb (nosql) aws
  - mindshift from relational databases to dynamodb (nosql) guide
  - database on aws
  - mindshift from relational tutorial
---

# Mindshift from Relational Databases to DynamoDB (NoSQL)

When transitioning from a relational database (RDBMS) to a NoSQL database like **DynamoDB**, it's essential to understand the **paradigm shift** in data modelling, access patterns, and scalability strategies. Unlike traditional relational databases that rely on structured tables, predefined schemas, and joins, NoSQL databases like DynamoDB are designed to optimize for scalability, speed, and flexibility in modern, data-driven applications.

In this post, we’ll explore the key mindset shifts when moving from relational databases to DynamoDB and dive deep into two essential NoSQL concepts: **salting** and **prefixing**. We will also illustrate these concepts with practical examples.

---

## 1. **From Structured Tables to Flexible Schema:**

### Relational Databases: Fixed Schema with Joins

In relational databases, the **schema is rigid**: tables are predefined with specific columns and relationships between them. The **tables** are often normalized to eliminate redundancy and ensure **data consistency** through foreign keys and joins. This structure is fantastic for maintaining **ACID (Atomicity, Consistency, Isolation, Durability)** properties in a transactional system.

- **Example**:
  - `users` table: Stores user details (user_id, name, email).
  - `orders` table: Stores orders (order_id, user_id, amount).
  - To get a user and their orders, you would join the two tables on `user_id`.

### DynamoDB: Schema-less and Optimized for Access Patterns

DynamoDB follows a **schema-less** approach where you don’t need to define your tables and relationships upfront. Instead of joins, **data is denormalized** and stored in a single table in a way that **optimizes read and write patterns**. The primary goal is to model your data based on **how it will be accessed**, rather than focusing on relationships.

This **denormalization** can feel unnatural for someone coming from a relational background, but it allows for **faster and more efficient reads** since there’s no need for complex joins. Each piece of data is designed to be accessed in a **single, efficient operation**.

- **Example**:
  - **PK = `user#123`** (for user-specific data)
  - **SK = `order#001`** (for an order by that user)

Here, user data and order data are **stored together** under the same partition, making it easier to retrieve both with one query.

---

## 2. **From Joins to Single-Table Design:**

### Relational Databases: Normalized Tables with Joins

In relational databases, you often use **foreign keys** and **joins** to retrieve related data from multiple tables. This process ensures that the data is not duplicated and maintains **data integrity**.

- **Example**: 
    - A `users` table and an `orders` table are joined on `user_id` to fetch a user and their corresponding orders.

### DynamoDB: Single-Table Design

DynamoDB encourages **single-table design** where all related data is stored in a single table. Instead of using joins, you organize data based on **access patterns** using the **partition key (PK)** and **sort key (SK)**.

- **Example**:
  - **PK = `user#123`**
  - **SK = `order#001`**
  - **SK = `order#002`**
  
With this design, all orders related to a user are stored under the same **PK**, making it efficient to retrieve all data for that user in a single **Query** operation.

---

## 3. **From Fixed Relationships to Flexible Access Patterns:**

### Relational Databases: Predefined Queries

Relational databases enforce **fixed relationships** between tables (e.g., `one-to-many`, `many-to-many`) and rely on **SQL queries** to retrieve data.

### DynamoDB: Optimizing for Access Patterns

In DynamoDB, the focus shifts from defining relationships upfront to **optimizing your table schema** for the queries you need to execute. DynamoDB is designed to handle **key-value and document data**, and it allows you to model your data based on the **primary access patterns** of your application.

For example, if you often need to retrieve all orders for a user, your table should be designed to retrieve them efficiently using a **partition key** (`PK = user#123`) and a **sort key** (`SK = order#001`, `SK = order#002`). This eliminates the need for additional queries or joins.

---

## 4. **Salting the Partition Key (PK) to Prevent Hot Partitions:**

One of the unique challenges of NoSQL databases like DynamoDB is the risk of **hot partitions**. A hot partition occurs when too much data is assigned to a single partition key, causing **performance bottlenecks**.

### What is Salting?

**Salting** involves **randomly distributing data** across multiple partitions by adding a random value (e.g., a suffix) to the partition key. This ensures that data isn’t concentrated in a single partition, thus preventing **hot partitions** and ensuring **even data distribution**.

### Why Salting is Important?

In DynamoDB, the partition key determines the physical partition where data is stored. If all your data shares the same partition key, it can create a **hot partition** that slows down performance, as it may exceed the throughput capacity of a single partition.

By salting the partition key, you **split the data** across multiple partitions, improving the load distribution and preventing bottlenecks.

### Example of Salting:

- **Without Salting:**
  - **PK = `user#123`**
    - All orders for `user#123` will be stored under the same partition, causing potential performance issues as the user grows in popularity.

- **With Salting:**
  - **PK = `user#123#A`**
  - **PK = `user#123#B`**
  - **PK = `user#123#C`**
  
In this case, you have three partitions for the same user, distributing the load and ensuring efficient scaling.

---

## 5. **Prefixing to Add Context and Avoid Collisions:**

### What is Prefixing?

**Prefixing** is the practice of adding a **string prefix** to your partition key (PK) and sort key (SK) to give context to the data and avoid **name collisions**. This is particularly useful when you have different types of data that share the same logical entity (e.g., a user, a product, an order).

### Why Use Prefixing?

Without prefixes, all your data for an entity (like `123`) could collide in the partition, especially when you add more data types (e.g., user details, orders, products). Prefixing helps to clearly differentiate between different types of data stored under the same partition key.

### Example of Prefixing:

- **Without Prefixing**:
    - **PK = `123`**
    - **SK = `profile`**
    - **SK = `order#001`**
  
In this case, you have two items (`profile` and `order#001`) with the same **PK = `123`**, but without any prefix, it’s harder to distinguish between them.

- **With Prefixing**:
    - **PK = `user#123`**
    - **SK = `profile`** (user profile)
    - **SK = `order#001`** (user’s order)
    - **PK = `order#123`**
    - **SK = `item#001`** (order item)

Now, you can clearly identify which data belongs to a user (`user#123`) and which belongs to an order (`order#123`). This **improves clarity** and avoids potential collisions between entities.

---

## 6. **Key Takeaways and Best Practices**

- **DynamoDB is designed for speed and scalability**, focusing on efficient access patterns. This often means **denormalizing** data and avoiding complex joins.
- **Salting the partition key** distributes data evenly across partitions, preventing hot partitions and improving performance.
- **Prefixing** your keys adds context and avoids collisions between different types of data, improving clarity and scalability.
- **Single-table design** is a fundamental principle in DynamoDB. While it may feel strange coming from a relational background, it optimizes the database for fast, low-latency access to specific access patterns.

By understanding and implementing these concepts, you can leverage DynamoDB’s strengths and build applications that are **highly scalable, fast**, and efficient. Transitioning from relational databases to DynamoDB may require a shift in thinking, but once you get comfortable with the NoSQL mindset, the flexibility and performance gains are undeniable.