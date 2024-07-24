---
title: RAG Implementation
---

## Multi-agent and Single-agent system

In the context of Large Language Models (LLMs), a single-agent approach involves one agent (or model) handling all tasks within an application. This approach is simpler and easier to manage, making it suitable for straightforward applications. However, it can become inefficient or overwhelmed when dealing with complex, multifaceted tasks. Conversely, a multi-agent approach employs multiple specialized agents, each optimized for specific tasks, working collaboratively. This method enhances efficiency and scalability for large-scale, complex applications. Despite its complexity, requiring coordination and a task orchestrator, it offers greater flexibility and robustness in managing diverse tasks.

## Storage for Embeddings

### AWS OpenSearch vs AWS Kendra

The key difference between Amazon OpenSearch (formerly CloudSearch) and Amazon Kendra lies in their underlying technologies and target use cases. OpenSearch, based on Solr, is a keyword search engine suitable for structured data and requires data to be formatted in JSON or XML batches. It primarily returns lists of documents based on keyword matching.

In contrast, Amazon Kendra is an ML-powered search engine designed for unstructured data such as Word documents, PDFs, HTML, PPTs, and FAQs. Kendra excels at handling natural language queries and providing specific answers rather than just document lists. Additionally, Kendra offers out-of-the-box connectors for popular repositories like SharePoint, S3, Salesforce, and ServiceNow, facilitating automatic content indexing directly into Kendra.

Therefore, Kendra is better suited for enterprise search applications or website searches requiring deeper language understanding, while OpenSearch is more appropriate for structured data and keyword-based search scenarios.

## Query Processing and Response Generation

- Receive Query: API Gateway receives the user query.
- Generate Query Embedding: Embed the query using the embedding model.
- Retrieve Documents: Search for the closest embeddings in OpenSearch.
- Generate Response: Pass the retrieved documents to the LLM for response generation.