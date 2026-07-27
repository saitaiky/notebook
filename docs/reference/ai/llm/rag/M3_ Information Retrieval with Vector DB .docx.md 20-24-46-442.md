
---
title: "Module 3: Information Retrieval with Vector Databases"
unlisted: true
---

[https://community.deeplearning.ai/c/course-q-a/406?utm\_campaign=forum-engagement\&utm\_medium=long-form-courses\&utm\_source=coursera](https://community.deeplearning.ai/c/course-q-a/406?utm_campaign=forum-engagement&utm_medium=long-form-courses&utm_source=coursera)
## Retrieval with vector database

Now that you have a strong foundation in information retrieval, it's time to move that theory into production. You could use a traditional relational database to implement most of the retrieval techniques from Module 2. But once you need to search millions or even billions of documents, vector operations behind semantic search start to slow down significantly. At that point, you typically switch to a vector database. Vector databases are designed to store and search high-dimensional vectors efficiently, which is why they have become a standard choice for modern RAG systems. In this module, you will see why they scale so well, and how chunking, query parsing, and reranking improve retrieval quality in production settings.
You'll also see a collection of techniques used in production RAG systems, like document chunking, query parsing, and re-ranking, which are used in production settings to further improve the performance of a retriever. 

## Approximate nearest neighbors algorithms (ANN)

The simplest form of vector retrieval is called k-nearest neighbor search, and it's one you've seen throughout the course so far. First, you create an embedding vector for every document in your knowledge base, as well as your prompt. Then, you calculate the distance between the prompt vector and every document vector. You then sort documents based on their distance from the prompt vector.   
The user can then choose a number, k, which is just how many of these nearest neighbor documents to return. k-nearest neighbors is easy to understand and easy to implement. The problem is that it scales terribly. The number of calculations each search requires grows linearly with the number of documents in the knowledge base. If you have a thousand documents, for each search, you have to calculate a thousand vector distances. If you have a billion documents, though, you have to calculate one billion vector distances. That second search will be a million times slower than the first. If you want your retriever to perform well at scale, you'll need a better approach. 

To improve upon k-nearest neighbors, retrievers use a family of algorithms called approximate nearest neighbors, or ANN. These algorithms use clever data structures to enable significantly faster searches. In order to do this, they make a small sacrifice in the quality of results, meaning they aren't guaranteed to find the absolute closest documents in the knowledge base, though they'll still find ones that are very close by. Let's look at one typical ANN algorithm called navigable small world. 

Navigable small world (NSW) is the core idea behind this family of ANN methods.

Before any searching is done, the algorithm creates a data structure called a proximity graph. To do this, first, it calculates the distance between each vector and every other vector. Then, inside this proximity graph, you add one node for every document.   
Finally, you make an edge between each document and a few of the other documents it is closest to. This results in a web-like structure. You can imagine traversing the proximity graph by hopping from one document to its closest neighbors along the edges that connect them  
 Now, the algorithm starts traversing the graph. It looks at each neighbor of the current candidate vector and calculates which of them is closest to the prompt vector. Since there's only a few neighbors to consider, this is a very fast process. Whichever is closest becomes the new candidate. Now, the process repeats. At each candidate vector, the algorithm looks to see which of the connected neighboring vectors is closest to the query vector, and that becomes the new candidate.   
The process continues until none of the neighbors are closer than the current candidate, and the candidate vector is returned. With small modifications, this approach can be made to return multiple documents, but the core idea is still the same. You're just moving across the proximity graph, each time, choosing whichever neighbor gets you closest to the prompt. This approach doesn't necessarily find the best possible vector in the knowledge graph. There might be one out there that's closer to the prompt vector, but just wouldn't be reached by the algorithm, because it can't pick the optimal overall path through the proximity graph. Just the best path in each moment. In practice, though, this algorithm finds very close vectors, and much more rapidly than k-nearest neighbors. 

## Hierarchical graph

While this navigable small world algorithm is already more efficient than KNN, a slight variation called hierarchical navigable small world, or **HNSW**, adds further improvement by significantly speeding up early parts of the search. HNSW depends on having a hierarchical proximity graph with many layers. Here's what that hierarchical proximity graph might look like for a knowledge base with 1,000 documents. Layer 1 contains all 1,000 vectors, and you calculate the proximity graph as normal. In layer 2, you randomly drop out all but 100 vectors, and you make a new proximity graph for just those 100 vectors. Finally, in layer 3, you randomly drop out all but 10 vectors, and again, make a proximity graph for the remaining 10. 

In order to search this proximity graph, searches begin in layer 3, the top layer.   
The algorithm chooses a random entry point in this layer, and then searches as normal to find the best candidate in layer 3. Then, it drops down to layer 2, starting from the best candidate found in layer 3. Since there are more vectors here, there might potentially be one that is closer to the prompt vector. The algorithm moves through layer 2 as normal until it finds the best candidate in layer 2. At that point, it drops down to layer 1, the lowest level, which has every vector in the knowledge base. The algorithm moves through this lowest layer as normal, and this time, the best candidate found is the one the algorithm actually returns. This hierarchical approach is very efficient, because at the highest layers, the algorithm makes big jumps to get into the approximate neighborhood of the prompt vector. 

By the time any possible vectors are considered in layer 1, the candidate vector should already be very close to the prompt vector. This HNSW algorithm is significantly faster than a k-nearest neighbor search. As you go up in layers, there are exponentially fewer vectors to navigate, and so the runtime of HNSW is approximately logarithmic, while KNN is linear. This is what allows vector search to scale up to billions of vectors and still require only a few hundred milliseconds of latency. You won't need to implement ANN algorithms like this one, but understanding a few of their key features is still important. First, they're significantly faster than k-nearest neighbors, allowing vector search to still be possible at scale. Second, while they tend to find documents that are close to the prompt vectors, they can't guarantee they'll find the absolute best matches. 

And finally, the entire process depends on building a good proximity graph, a fairly computationally intensive process that luckily can be precomputed before receiving any prompts. 

## Vector Database

In a production RAG system, you'll typically store and retrieve vectors from a specialized database called a vector database. Let's explore some common operations with a vector database and how they lay the foundation for performing retrieval inside a RAG application. A vector database is a database that has been designed from the ground up to store high-dimensional vector data and implement vector-oriented algorithms like the Approximate Nearest Neighbors algorithm you just saw. They grew in popularity in the early 2020s in response to the widespread availability of large-language models and the explosion of vector-embedding-based techniques like Semantic Search. Standard relational databases performed poorly at Semantic Search, where their performance was much closer to the highly inefficient K-Nearest Neighbors algorithm. Vector databases are optimized for tasks like building the proximity graph that powers HNSW or computing vector distances, and so scale well and operate significantly faster in most vector-based applications, in particular building a RAG system. 

## Steps

 There's a few steps involved in getting a vector database ready to process searches, some of which are handled automatically for you. 

* You'll need to set up the database,   
* load your documents,   
* create the sparse vectors that will power Keyword Search,   
* create dense embedding vectors that power Semantic Search, and

\- finally create the index that will power your ANN search algorithm, like the HNSW index you just saw. 

* At that point, you're ready to run actual searches. 
## Chunking

It's straightforward to set up a database that scales rapidly and supports different retrieval patterns. In most production RAG systems, however, you still need additional techniques to improve quality and cost efficiency. The first is chunking: breaking longer documents into smaller, retrievable units.

* Firstly, many embedding models have limits for the amount of text they can embed into vectors.   
* Secondly, chunking can improve the search relevancy metrics for your retriever.   
* And thirdly, it ensures you're only sending the most relevant text from a document to the LLM. 

## Problem

To understand the value of chunking, imagine you have a knowledge base of a thousand books. If you were to index this knowledge base, each book would be vectorized by an embedding model and the result will be a thousand vectors that each represent the context of one book. 

The problem here is you're compressing the meaning of an entire book down to a single vector. These vectors can't give a sharp representation of any specific topic discussed in a particular chapter or page, and instead kind of averages across all of them. As a result, you'd expect search relevance to be pretty poor.   
Even if you use this system for retrieval, you'd be retrieving an entire book at a time, which would quickly fill up your LLM's context window. For this reason, you typically want to take your books and chunk them up into smaller pieces, like the page, paragraph, or sentence level.  Suddenly, your knowledge base might contain 1 million paragraphs instead of 1,000 books, but vector databases easily scale up to store and search through all those vectors.

## Solution \- Chunking

The first consideration when chunking is what chunk size to use. If you make the chunks too big, say at the chapter level, you run into the same problem you did when trying to vectorize the entire book. The chunks are still too big to capture nuanced meaning with a single vector, and they'll rapidly fill an LLM's context window. Alternatively, it's also possible to make chunks too small.   
Consider the extreme case where you chunk at the word level. Your vectors will lose all the context of the surrounding sentences and paragraphs, which again diminishes search relevance. Even chunking at the sentence level could be too fine-grained. There's no one-size-fits-all approach to chunk size, but usually you'll find a balance between vectors trying to capture too much or too little context all at once. 

### Example: fixed-size chunking with overlap (rag-3)

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
	chunk_size=500,
	chunk_overlap=100,
	separators=["\n\n", "\n", " ", ""],
)

chunks = splitter.split_text(document_text)
print(f"Created {len(chunks)} chunks")
```

## Fixed-size chunking with overlap

The simplest way to do this is to use a fixed-size chunking strategy where at the outset you determine that every chunk will be the same size. For example, 250 characters. Character 1 to 250 are chunk 1. 251 to 500 are chunk 2. 501 to 750 are chunk 3, and so on and so forth, all the way to the end of the document.   
Of course, there's no guarantee the splits between chunks happen at sensible places. The split will often fall in the middle of a word or separate two pieces of a cohesive thought in a paragraph. This is usually addressed by allowing overlaps in chunks. For example, chunks might be 250 characters long, but overlap by 25 characters with the chunks that come before and after. So chunk 1 is characters 1 to 250. Chunk 2 is 226 to 475. Chunk 3 is 451 to 700, and so forth.   
Typically, this overlap is expressed as a percentage of the overall chunk. So here, this would be a 10% overlap. Overlapping chunks minimizes instances where words are cut off from their context. Words in the middle of a chunk have context to either side of them. Words at the edge of chunks will appear in two chunks, increasing the odds that they appear alongside relevant context. Allowing for more overlap usually positively impacts search relevancy, but at the cost of adding more vectors to your database with redundant information. A more dynamic chunking strategy is called recursive character text splitting. 

## Recursive character text splitting

The idea is you choose one particular character to split on. For example, you could split on the newline character, which often appears between paragraphs. This gives you a variable chunk size, so there's an increased chance that you have very large or very small chunks depending on newline character locations. On the plus side, however, you're accounting for the document structure and increasing the chances that related concepts are kept together within a single chunk. If your knowledge base has a variety of document types, you can of course split different types of documents differently. For example, you might split HTML on paragraph or header tags, Python code on function definitions, and text documents on newline characters. 

\> But you can also find external libraries designed to help you do it. If your documents have metadata, you'll of course want chunks to inherit the metadata of their source document, perhaps with additional information about their location.

\> Chunking your documents has a variety of benefits for vector retrieval, from increasing search relevancy to minimizing the use of your LLM's context window. If you're looking for a good starting point, just use fixed size chunks of about 500 characters with an overlap of 50 to 100 characters. In some other instances, more advanced chunking techniques might be helpful, so join me in the next video to explore what some of those look like. 

### Example: semantic retrieval in Weaviate (rag-3)

```python
response = collection.query.near_text(
	query=search_string,
	filters=where_filter,
	limit=top_k,
)

for obj in response.objects:
	print(obj.properties["content"])
```

## Query Parsing

Query parsing improves retrieval by transforming raw user text into a cleaner search query before hitting the vector database. In practice, this can include typo normalization, expansion of abbreviations, extraction of entities (such as product names or versions), and decomposition of broad prompts into more targeted sub-queries.

This step matters because many user prompts mix intent, context, and constraints in one sentence. A parsed query makes those constraints explicit, which often improves both recall and precision. Typical production systems either implement parsing rules directly or use a lightweight LLM to rewrite the query into retriever-friendly form.

## Cross-encoder and ColBert

Initial retrieval is usually optimized for speed, not perfect ranking. To improve final quality, many systems add a reranking stage.

A **cross-encoder** scores each query-document pair jointly, which usually gives high relevance quality but is computationally expensive. A **ColBERT-style** model offers a middle ground: it keeps richer token-level interactions than standard bi-encoder retrieval, while remaining cheaper than full cross-encoding.

In production, a common pattern is:
- Stage 1: fast ANN retrieval returns top-N candidates.
- Stage 2: cross-encoder or ColBERT reranks only those candidates.
- Stage 3: pass top-k reranked chunks to generation.

## Reranking

Reranking is where retrieval quality is refined from "good enough candidates" to "best context for generation." It is especially useful when multiple documents are semantically close but only a subset directly answers the user question.

The key trade-off is latency versus quality. A practical strategy is to keep candidate count small enough for acceptable latency, while still large enough to recover relevant but initially lower-ranked chunks.

### Example: near-text retrieval with rerank (rag-3 assignment)

```python
response = collection.query.near_text(
	query=user_query,
	limit=top_k,
	rerank=reranker,
)
```

## Conclusion

At this point, you have the production retrieval stack: ANN search for speed, chunking for context granularity, query parsing for cleaner intent, and reranking for final relevance quality. In the next module, we shift to the generator side and focus on LLM behavior, prompting, and response quality.