---
title: Manual Secondary Index Maintenance in DynamoDB
---

In traditional relational databases, you might rely on computed columns or triggers to automatically update derived values—ensuring that your indexes or sort orders remain in sync with the underlying data. However, DynamoDB, with its schema-less, NoSQL design, does not offer built-in computed columns. This requires a different approach: **manual secondary index maintenance**.

#### What Is Manual Secondary Index Maintenance?

Manual secondary index maintenance is the process of explicitly updating an attribute that is used in a Global Secondary Index (GSI) or other derived data, so that it reflects the latest state of your primary data. This practice is a form of **explicit denormalization** where you store redundant or derived information within your item.

For example, consider a scenario where you have a conversation metadata item. Alongside fields like `lastActivity` or `updatedAt`, you maintain a GSI sort key (`GSI1SK`) that is composed as follows:
```
LASTUPDATE#{timestamp}#CONVERSATION#{conversationId}
```
Every time a new message is sent or an artifact is updated, you update the metadata's `lastActivity` field. But because DynamoDB doesn't automatically propagate this change to a derived field, you must also update the `GSI1SK` manually. This ensures that your queries—especially those used to display a sorted list of conversations—always reflect the latest activity.

#### Why Is This Approach Necessary?

- **No Automatic Computation:**  
  Unlike relational databases, DynamoDB does not recalculate a derived attribute automatically. When you update one field (e.g., `lastActivity`), you must also update any field that depends on it (e.g., `GSI1SK`).

- **Ensuring Up-to-Date Sorting:**  
  The GSI sort key (in our example, `LASTUPDATE#{timestamp}#CONVERSATION#{conversationId}`) is critical for correctly ordering your query results. By updating it manually along with `lastActivity`, you guarantee that the sorting in your UI (or admin panel) is accurate and reflects the most recent changes.

- **Explicit Denormalization:**  
  This approach is a type of explicit denormalization—storing extra, computed data within your items to make queries more efficient. While it introduces some redundancy, it allows for faster queries and simpler index design, which is especially valuable in NoSQL databases.

#### Trade-Offs Compared to Relational Databases

- **Relational Databases:**  
  In a relational setup, you might use a computed column or a trigger to automatically update a derived field whenever the base field changes. This keeps your data consistent with minimal manual intervention.

- **DynamoDB:**  
  Here, you must incorporate the logic to update both the original field (e.g., `lastActivity`) and the derived field (`GSI1SK`) in your application code. While this adds some complexity, it gives you full control over how and when your secondary indexes are maintained.

#### Practical Example

Consider the following update operation in DynamoDB (using the AWS SDK):

```js
const command = new UpdateItemCommand({
  TableName: process.env.DYNAMODB_TABLE_v2!,
  Key: {
    PK: { S: `CONVERSATION#${conversationId}` },
    SK: { S: "METADATA" }
  },
  UpdateExpression: 'SET lastActivity = :now, GSI1SK = :gsi1sk',
  ExpressionAttributeValues: {
    ':now': { S: now },
    ':gsi1sk': { S: `LASTUPDATE#${now}#CONVERSATION#${conversationId}` }
  },
  ReturnValues: 'UPDATED_NEW'
});
```

In this code, both `lastActivity` and `GSI1SK` are updated together. Even if the action that triggered the update is only conceptually a change in activity (a new message, for example), updating `GSI1SK` is crucial so that the GSI sorting used in your UI reflects this new state.

#### Conclusion

Manual secondary index maintenance in DynamoDB—updating a derived field explicitly as part of your application logic—is a key pattern when working with NoSQL databases. This approach ensures that your Global Secondary Indexes remain in sync with the most recent data, enabling efficient and accurate query results for features like conversation sorting in your dashboard. Although it adds a bit of overhead compared to automatic computed columns in relational databases, it offers the flexibility and control needed in a schema-less environment.
