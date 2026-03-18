# Module 2

## Introduction

A retriever's job is pretty easy to state. All it needs to do is find documents in the knowledge base that can help an LLM respond to a prompt. If you think about it though, that's a pretty difficult job. Users aren't submitting well-structured SQL queries to your RAG system. They're chatting with your LLM the way they talk to another person. Meanwhile, the documents in your knowledge base might be anything from personal emails to internal company memos or articles from a medical journal. They might be rich in information, but it's usually structured for humans to read, not for a computer to search through it.   
Somehow, a retriever has to handle all of this messily structured information and rapidly return the most relevant pieces, all in fractions of a second.

## Overview

Throughout this module, you'll deep dive on several different search techniques, but it can be useful to have a mental model of the overall system. With that in mind, let's start this module with a high-level look at a retriever's architecture and how each component within it works together. When a RAG system receives your prompt, it's first sent to the retriever. The retriever will have access to the knowledge base, which you can think of as just a bunch of text files sitting in a database. The retriever needs to quickly decide which documents are most relevant to the prompt and return them so they can be passed to the LLM. Most modern retrievers use two different search techniques as a part of this process. The first is a more traditional keyword search.   
This means the retriever looks for documents that contain the exact words found in the prompt. This approach is time-tested and has powered information retrieval systems for decades. The second approach is a semantic search. This means the retriever looks for documents that have a similar meaning to the prompt. This approach makes the retriever more flexible as it allows it to find documents that are relevant to the prompt but might not contain the exact words the user included in their prompt. Each search technique will be used to return a collection of documents, perhaps 20-50 documents each. Usually, there will be many documents that appear in both lists, but because the style of search is different, they might be ranked higher in one than the other.   
At this point, each list is filtered down based on their metadata. For example, some documents in your knowledge base may be relevant to members of your engineering team and others are more relevant to people working in HR. The system would know what team the user is a member of and apply a metadata filter at this point to ensure only the documents relevant to that department are allowed to move forward. Now the retriever has two filtered lists, one generated with a keyword search and the other with a semantic search. These two lists are now combined to create a final ranking of the most relevant documents. The retriever returns the top-ranked documents from this final list and at this point the retrieval is complete. The documents are sent along to be added to the augmented prompt.   
This style of search is called hybrid search because it relies on multiple techniques to produce its final document ranking. Each technique provides benefits that contribute to the overall performance of the retriever. Keyword search ensures the system is sensitive to the exact words the user included in the prompt. Semantic search gives the system more flexibility to find documents whose meaning is similar to the prompt, even if they don't use the same words. Metadata filtering allows the system to exclude documents based on rigid criteria in a way that neither of the other approaches allows. Designing a high-performing retriever means understanding the relative strengths of each of these techniques and then tuning the balance between them to align with the needs of your project. With that in mind, let's start diving in on each of these three techniques, beginning with the simplest of the three, metadata filtering.

### Code examples from the rag-2 notebooks

The examples below map this theory to your lab notebooks.
For a full M1-M5 notebook mapping, see `lab-snippet-map.md` in this folder.

```python
# Source: rag-2/2-Retrieval metrics/C1M2_Ungraded_Lab_2.ipynb
# Core retrieval flow: encode query -> cosine similarity -> top-k docs
query_embedding = model.encode(query_clean, convert_to_tensor=True)
cosine_scores = [cosine_similarity(query_embedding, x) for x in embeddings]
top_indices = np.argsort(cosine_scores)[::-1][:top_k]
```

```python
# Source: rag-2/3-Implement Retrival/C1M2_Assignment.ipynb
# Sparse retrieval with BM25
BM25_RETRIEVER = bm25s.BM25(corpus=corpus)
BM25_RETRIEVER.index(TOKENIZED_DATA)
results, scores = BM25_RETRIEVER.retrieve(tokenized_query, corpus=corpus, k=top_k)
```

```python
# Source: rag-2/2-Retrieval metrics/C1M2_Ungraded_Lab_2.ipynb
# Basic retrieval quality metrics
def precision(tp, tn, fp, fn):
    return tp / (tp + fp) if (tp + fp) > 0 else 0.0

def recall(tp, tn, fp, fn):
    return tp / (tp + fn) if (tp + fn) > 0 else 0.0
```

## Metadata filtering

Inside of a typical RAG system, you won't use metadata filtering to perform retrieval, but rather to help narrow down results returned by other retrieval techniques. The filters themselves also usually aren't determined by what the user said in the prompt, but rather other attributes of the user making the request. For example, consider the newspaper example from before. Say some of your articles are published freely to the open internet, and others can only be accessed by paid subscribers. Each article could have a piece of metadata storing whether it is a free or paid article.   
When a user searches the database, the system can detect whether they're signed in as a paid subscriber. If not, then a metadata filter would be set to exclude paid articles from search results. Similarly, if your newspaper prints articles in many regions of the world, each article could have a piece of metadata storing the region where the article was published. When a reader queries the system, you can detect in which region they're located and only return articles from their region.

Metadata filtering has a number of advantages. Firstly, it's conceptually simple, making it easy to understand how the system works and debug issues. Second, it's a fast, mature, and well-optimized approach.   
Finally, and perhaps most importantly, it's the only approach that allows your system to decide whether documents are retrieved based on rigid criteria. If you want to strictly define what kinds of documents should or should not be included in the retrieval, metadata filtering is the only approach that can give you that behavior. That said, metadata filtering has significant limitations. It's not really a search technique, so much as it is a tool for refining the results of the other two techniques you'll see in this module. It's overly rigid, ignores a document's content, and lacks any way of ranking documents once they've passed the filter. While it's very likely that RAG systems you build will include metadata filters of some kind, building a retriever that relied exclusively on metadata filtering would be essentially useless. Metadata filtering is simple and effective, but needs to be paired with other search techniques in order to provide real value.   
In particular, you'll need a way to determine if a document's contents are actually relevant to your prompt

## Keyword search - TF-IDF

Let's start our exploration of search techniques with keyword search. This technique has powered retrieval in databases and search engines for decades. And yet its simplicity and effectiveness make it a key component of retrieval in modern RAG systems. Let's have a look at how it works and what strengths it brings to your retriever pipeline. Keyword search is a technique that retrieves documents based on whether they share words in common with the prompt. The idea is basically that documents that contain a lot of words from the prompt are more likely to be relevant. Here's how it works.   
Both the prompt and each document are treated as a bag of words. This means the order of the words is totally ignored and all that matters is which words are in the text and how often. For example, the text making pizza without a pizza oven contains the word pizza twice and the words making, without, a, and oven once. These word counts are stored inside of a vector. The vector has one spot for each word in the system's vocabulary. So there could easily be tens of thousands of spots. Each number in the vector counts how often that word appears in the text.   
Since most of the locations hold zeros, these are also called sparse vectors. To prepare the knowledge base for retrieval, a sparse vector is generated for each document. All of these vectors can be arranged in a grid, which is referred to as a term document matrix. Each column is a different document and each row is a different word. This is also sometimes called an inverted index. Because it makes it easy to start from a word and find every document that contains it. It's inverted because usually you start from a document and think of which words it contains, but here you're starting from a word and finding which documents include that word.   
This inverted index can be created once prior to processing any search. When a prompt is sent to the retriever, a sparse vector is quickly generated for the prompt. Now that each document and the prompt have a sparse vector, you're ready to start scoring and ranking documents. The simplest approach is to just award documents points when they contain words in the prompt. Each word of the prompt is called a keyword. In the example prompt from before, you'd start with the first keyword, making, and find its row in the index. Then you go across that row and award one point to every document that contains at least one copy of the keyword.   
You then complete the same process for every other keyword in the prompt. If a document contains the keyword, it scores a point. This prompt contains five keywords, meaning the highest possible score is five. Once you're done, the total scores can be used to rank documents, and the documents with the highest scores are retrieved. One shortcoming of the simple scoring approach is that it doesn't capture whether a document contains keywords multiple times, which likely indicates greater relevance. A simple fix is to increase a document's score every time it contains a keyword, not just the first. Now you can find the row of each keyword in the matrix and just award each document the number of points in its column.   
This introduces a new problem, however, which is that longer documents may contain the keywords many times simply because they're longer. To correct for this, you can divide each document's score by the number of words in that document. This normalized score levels the playing field. It rewards documents in which keywords make up a greater share of the total text and de-emphasizes long documents that might contain keywords many times simply because they're so long. This approach is pretty good, but it awards points for all keywords equally, whether they're filler words like the or less common words like pizza, whose presence is a much better indication of relevance. To correct for this, you can again weight terms, but this time using a measure called inverse document frequency or IDF. To use this approach, you need to calculate an IDF value for each word in the system's vocabulary.   
For each word, you'll count how many documents it appears in and then divide by the total number of documents. If your knowledge base has 100 documents and the word pizza appears in 5 of them, it would have a document frequency of 5 over 100 or 0.05. A common word like the might appear in all 100 documents. So this document frequency would be 100 over 100 or just 1\. Since you want to reward rare words, you now flip the fraction upside down or invert it. Pizza's IDF would now be 20, while the has an IDF of just 1\. At this point, rare words have a significantly higher IDF than common ones, which can overly reward rare words.   
For this reason, the log of the IDF is what's normally used. Rare words still have a greater weight, but it's less exaggerated than before. The result is an IDF value for each word that captures how rare it is across the knowledge base. To use these values in scoring, first the values in the inverted index are updated, multiplying the numbers in each row by that word's IDF score. The resultant matrix is a Term Frequency Inverse Document Frequency matrix, or TF-IDF matrix. To score the documents in the knowledge base, you just use the same approach as before. For each keyword in the prompt, go across its row and award each document the TF-IDF score it has in that row.   
The TF-IDF scores produced by this approach are a standard baseline for the performance of keyword retrieval. The highest scoring documents will frequently use keywords, and in particular, will feature many keywords that are rare across the entire knowledge base. Looking at the earlier prompt, documents containing rare words like pizza or oven will likely score much better than documents that contain common words like a or without. While TF-IDF is a foundational approach to keyword search, modern systems tend to use a slightly refined version of this approach called BM25.

## Keyword search – BM25

While TF-IDF remains a classic keyword search algorithm, the algorithm used in most retrievers is called Best Matching 25, or more simply BM25. It's called this because it was the 25th variant in a series of scoring functions proposed by its creators. It makes a few improvements upon TF-IDF, so let's explore how those work. 

Here's the formula for BM25. It actually works very similarly to TF-IDF with a few key additions you'll see momentarily. This formula generates a relevant score for a single keyword for a particular document. Summing these scores up across all keywords generates a total relevant score for a single document, which can then be used for ranking. Let's now see how BM25 improves on TF-IDS. 

- First, documents score diminishing returns as they include more instances of a keyword. The idea here is that a document that includes the keyword pizza 20 times isn't actually twice as relevant as one that includes pizza 10 times. This behavior of discounting additional instances of a keyword is referred to as term frequency saturation.  
- Second, longer documents are still penalized as they are in TF-IDF, but in BM25 these penalties are also diminishing. While penalizing long documents is important, TF-IDF can do so too aggressively in a way that overly discounts longer documents. BM25 applies diminishing additional penalties as documents grow in length. The result is that long documents still score highly as long as they have a fairly high frequency of the keywords. This process of adjusting scores based on document length is called document length normalization.

### Hyperparameters

BM25 also differs from TF-IDF in that it includes two tunable hyperparameters. These allow you to control the degree of term frequency saturation and document length normalization, or in other words how rapidly documents stop being rewarded for repeated keywords and penalized for increased length. In a production retriever, you would tune these hyperparameters in order to land on an overall scoring system that best fits the data in your knowledge base.

In a production retriever, the standard keyword search algorithm is BM25.  It tends to perform significantly better than TF-IDF at finding relevant documents, is roughly equivalent in terms of the computational resources it requires, and the ability to tune its hyperparameters to your dataset makes it much more flexible.  

### Strengths and weaknesses

Let's briefly review keyword search and talk about how its strengths are used inside of a typical retriever pipeline. The core idea of keyword search is that you match documents to prompts based on how frequently keywords from the prompt appear in each document. As a part of this process, both prompts and documents are converted to sparse vectors that count how often each word in the system's vocabulary appears in that piece of text. TF-IDF or BM25 are just different approaches for processing these sparse vectors in order to score and then rank documents. These methods also account for important factors like the rarity of a keyword, how often a document contains a keyword, and document length. BM25 is the most commonly used keyword search algorithm that has withstood the test of time for decades since its invention. It strikes a good balance between complexity and performance in real-world applications. The primary strength of keyword search is its simplicity. It's a relatively straightforward approach that works well in practice, often capable of performing quite well on its own and frequently setting a competitive benchmark that more advanced techniques may struggle to surpass. It also ensures that retrieved documents will contain the keywords from your user's prompt. Especially in situations when you expect users to use technical terminology or exact product names, this kind of exact keyword matching is particularly important.

### Moving to similarity search

Despite all its strengths, keyword search does have weaknesses.   
It ultimately depends on the query containing keywords that exactly match the words in the document. If a user sends a prompt that has a similar meaning to a document but just doesn't include the right words, keyword search won't be able to find that match. So let's have a look at semantic search and how it addresses this problem.

## Semantic search – introduction

Now let's turn our attention to semantic search. Semantic search is able to match documents to prompts based on shared meaning and can capture nuances that keyword search misses. For example, a keyword search is unable to match the words happy and glad, even though they're synonyms, and would incorrectly match Python, the programming language, and Python, the snake. The technology underlying semantic search is quite remarkable, so let's dive in to see how it works. On a very high level, semantic search works just like keyword search. Every document is mapped to a vector, and so is a prompt. Then the prompt vectors and document vectors are compared to generate scores, and find the documents that most closely match the prompt.   
The primary difference is the way vectors are assigned to each document and prompt. In keyword search, you just count how often each word appears in the piece of text. In semantic search, however, you generate vectors by running the document or prompt through a special mathematical model called an embedding model. Embedding models map words to a location in space. This location is represented by a vector. For example, the embedding model might map the word pizza to the vector 3, 1, and the word bear to the vector 5, 2\. In two dimensions, you could represent these as points on the x-y axis.   
Now here comes the part that almost feels like magic. The embedding model will map semantically similar words to nearby locations in space. For example, the word food and cuisine would get embedded closer to one another, and the words trombone and cat would be embedded further apart. Similar meanings lead to similar positions. The x and y axes here don't have any simple interpretation. There's no food axis and animal axis here, or at least not one that's easy to see. Instead, you should just think about points floating around on the 2D plane, with similar meaning words clustered together.   
Vectors have many complex relationships, and creating sensible clusters in two dimensions probably won't work. If the vectors each had three components, you can imagine embedding them into three-dimensional space. Now there's more room where clusters of related concepts can form, and to capture nuanced relationships between them. In most embedding models, however, these vectors have hundreds or even thousands of components, giving an incredible amount of flexibility on where to embed each point. It's impossible to graph or maybe even imagine this high-dimensional space, but mathematically, all the same principles hold. The vectors give the coordinates of locations in that space. Similar concepts are embedded close together, and dissimilar concepts are embedded farther apart.

Even though this example is focused on individual words, embedding models exist for many kinds of input data. There are embedding models for individual words, sentences, and even entire documents. These models take different kinds of inputs, but in each case, output a single vector that specifies a point in space. Just as with single words, if the vectors are closer together, the pieces of text have similar meaning.

### Euclidean distance and cosine similarity

Consider three sentences. He spoke softly in class. He whispered quietly during class.   
Her daughter brightened the gloomy day. When projected into vector space, the vectors for the first two sentences will be closer together, while the third sentence would be far away from the other two. In order to quantify the similarity of different pieces of text, you can measure the distance between their vectors. There's a few ways to do this. For example, the Euclidean distance you might remember from geometry class just measures how far apart two vectors are by drawing a straight line from one vector to the other, the shortest possible distance between them. The formula to calculate this is essentially the Pythagorean theorem, but scaled up across more dimensions. In very high dimensional space, however, every point tends to be pretty far away from every other point.   
A much more commonly used measure of distance is cosine similarity, which measures the similarity in the direction of two vectors, regardless of whether they're that close to one another in space. The vector 10, 10, and 100, 100 aren't that close to one another, but they face in the same direction. Cosine similarities range from 1, when the vectors face exactly the same direction, to negative 1, when they face exactly the opposite from one another. You will also occasionally see the dot product, which measures the length of the projection of one vector onto another. If two vectors are similar in length and direction, the projection will be larger. If they're at a 90 degree angle, the projection length will be zero. If they're facing opposite directions, the dot product will be negative.

If math's not your forte, don't worry. You'll likely never need to implement these distance measures, but knowing how they work is helpful. For example, for both the dot product and cosine similarity, higher values reflect closer vectors, which ultimately reflects more similar concepts. Cosine similarity ranges from negative 1 to 1, and the dot product can take any value between negative and positive infinity.

Let's see how this distance measure is used to power semantic search. First, all the documents are projected into vector space by the embedding model. Thanks to how the embedding model is designed, documents with similar meaning will be closer together, and documents with dissimilar meaning will be farther apart.   
Next, you embed the prompt to get a vector of its own. Now, you can measure the distance between the prompt vector and the vector of each document. Thanks to the way the embedding model is designed, whichever documents are closest will also have the most similar meaning. At this point, ranking documents is easy. You just sort documents by their distance from the prompt and return the documents which have the shortest distance. Thanks to the way the embedding model works,

## Semantic search – embedding model

### How could a computer possibly understand the meaning of a piece of text?

### Contrastive training

You can think of the job of the embedding model in terms of positive and negative pairs. A positive pair is two pieces of similar text, like good morning and hello, which should be embedded close together.   
A negative pair, like good morning and that's a noisy trombone, have dissimilar meanings, and should be embedded further apart. Embedding models need to work so that positive pairs end up closer together, and negative pairs end up farther apart. The first step to training an embedding model is compiling a large collection of positive and negative pairs, also called examples. In many systems, this means truly massive data collections, often with multi-millions of pairs included. An individual word or piece of text will be included in many examples to capture its relationship to a wide variety of texts and concepts. Once these examples have been compiled, training can begin. 

At the beginning of training, embedding models embed each piece of text to a random vector.   
These vectors are nonsense, and will have no relationship to the text's meaning. If you use this untrained embedding model for retrieval, the results would be gibberish.  
Now the model looks at all the positive and negative pairs in its training data, and asks how well did I place the positive pairs together and the negative pairs apart. Since the model is using the contrast provided by the positive and negative examples to evaluate its performance, this technique is called contrastive training.

### Contrastive training process

Based on how well it did, the model updates its internal parameters. It uses an algorithm that attempts to move positive pairs closer together and negative pairs further apart. Once the embedding model's parameters are updated, you just repeat the process.   
Text is embedded to new vectors using the model's updated parameters. The model's performance is again evaluated using the positive and negative pairs, and based on that performance, its parameters are again updated. This process is repeated many times, iteratively updating the model's parameters, pushing and pulling pairs closer together or further apart. After many rounds of training, the positive pairs will have been pulled close together, and the negative pairs should have been pushed far apart.

### Real-world training uses far more than two pairs

That said, you'd never train an embedding model with just two pairs. When you try to complete this process with millions of anchor, positive, and negative points, the process gets a lot messier. Every vector is simultaneously being pushed and pulled in many directions. This helps explain why models use vectors with hundreds or even thousands of dimensions.   
High dimensional space gives the algorithm a lot of options for where to push and pull vectors to reflect the nuanced relationships in the training data. After training, the vectors capture meaning because similar words or text have been pulled to similar areas of the vector space. You don't need to train an embedding model to build a RAG system, but understanding how they're trained can help you better understand the vectors they generate.

### Key takeaway

The main point to know are that semantic vectors are abstract and somewhat random. Before training, a location in space doesn't have any meaning, and vectors are placed randomly. After training, different locations in space do have a semantic meaning, but only because that's where a cluster of similar concepts is formed. For example, somewhere there can be a cluster of words that all have to do with lions, and another cluster that has to do with trombones.   
If you ran the training process twice, but with different initial random vectors, these same clusters would still form, but they would be at different locations in the vector space. Another key takeaway is that you only compare vectors generated by the same embedding model. Each model was trained with different training data, different numbers of dimensions, and with different randomly initialized values. Trying to compare vectors from two different models will just result in nonsense. 

In practice, you'll likely use off-the-shelf embedding models, and they'll do a remarkably good job of placing similar words, sentences, or documents at similar locations in vector space. You probably won't even implement the distance measurements between these vectors. That said, understanding a bit more deeply how they work can help you better reason about how to use them in your RAG system, so join me in the next video to see how you can put these dense vectors to use in your retriever.

## Hybrid search

let's have a look at how they can be used together as part of a hybrid search technique to take advantage of their different strengths. To start, let's review how each technique operates and its key benefits. Metadata filtering uses rigid criteria stored in document metadata to narrow down search results. It's fast, easy to implement, and easy to interpret. It may not be a great search technique on its own, but it provides a strict yes-no filter that neither of the other approaches can provide. Keyword search scores and ranks documents based on having the same keywords found in the prompt.   
Keyword search is still quite fast and easy to implement, and it can even do an excellent job at finding relevant documents. It performs particularly well in instances where prompts and documents contain technical keywords or product names, as results will contain those exact words. Keyword search relies on exact matches, however, and so is unable to retrieve documents with similar meanings but different words. Semantic search scores and ranks documents based on having similar meaning to the prompt. Documents and prompts are embedded as vectors whose location in space captures their meaning. Finding the most similar documents to a prompt just means you need to find the document whose vector embedding is closest to the prompt's vector. Semantic search is slower and more computationally intensive than keyword search, but it provides a flexibility that no other search technique can.

With all three approaches having relative strengths, here's how they're typically combined into a hybrid search pipeline. First, as always, a prompt is received by the retriever. The retriever then performs both a keyword search and a semantic search using that prompt. The result are two ranked lists of documents, one that was scored and ranked using keyword search and another using semantic search. If you like, imagine each search technique returning 50 documents, with many documents appearing in both rankings, but perhaps in different order. Next, both of these lists are filtered using a metadata filter to remove documents that are irrelevant. For example, the filter might remove documents that aren't relevant to their work.   
In this example, the keyword search list is left with 35 documents, and the semantic search only 30\. Now, these two ranked lists need to be combined to form a single ranking. A commonly used algorithm for combining these rankings is called reciprocal rank fusion.  

### Reciprocal rank fusion

This algorithm rewards documents for being ranked highly on either list, while allowing you to control whether to give more weight to the keyword or semantic ranking. Here's the formula for reciprocal rank fusion. Documents score points based on their ranking in each list. K is a hyperparameter, but for now, pretend it's zero.  
   
In that case, each document scores points equal to the reciprocal of their ranking. So first place scores one point, second place scores a half a point, and so on. Documents acquire points from each ranked list, and their total scores are used to calculate a final ranking.

In the case of your retriever, that's just two rankings, their keyword rank and semantic rank. If a document appeared second in one list and 10th in another, it would score 1 over 2 or half a point from the first ranking, and 1 over 10 or 0.1 points from the second, for a total score of 0.6. These scores are then used to re-rank all the documents.

### K parameter

K is used to control the impact of the highest ranked documents. When K is zero, the top ranked document in any list will instantly shoot to the top of the overall ranking. Even if it's only highly ranked once. For example, the top ranked document scores 1 point, and the 10th ranked document scores 1 tenth. That's a 10x difference. Increasing K to something like 50 balances things out. Now, the top ranked document scores 1 over 50 points, and the 10th ranked document scores 1 over 60, which is a much more modest difference in scores.   
It still pays to be ranked first, but not to such a degree that it dominates rankings on any other list. Notice that RRF only cares about the rank of the document in each list, not the scores that led to those rankings. Even if the top ranked document scored considerably better than the second, that information is not considered.

### Beta

Inside a retriever, hybrid search typically has a second hyperparameter called beta, which allows you to weight the rankings produced by either the semantic or keyword search. For example, you could set beta to 0.8, assigning 80% of the importance or weight to the ranking provided by semantic search, and only 20% to the ranking provided by keyword search. A 70-30 split, 70% semantic, 30% keyword search, is typically a good starting point, and you can tune this for your particular system to see what works best. For applications where exact word matching is really important, but you want some semantic similarity, you'll want to weight keyword search results more heavily than semantic search results.   
In other cases where semantic similarity is more important and keywords are less crucial, you'll want to weight vector search results more heavily than keyword search results

### Closure

Depending on how many documents were originally requested, usually referred to as top K, the most similar K documents from this final hybrid ranking are returned by the retriever. Hybrid search allows a retriever to take advantage of the different benefits that keyword search, semantic search, and metadata filtering provide. Keyword search provides exact word matching, semantic search allows for fuzzier matching based on meaning, and metadata filtering filters documents out using strict criteria. There's also ample opportunity to change how this hybrid system works, whether it's adjusting the parameters of the BM25 algorithm, choosing which metadata to filter on, or changing the weighting of keyword versus semantic search in the reciprocal rank fusion step. This hybrid approach lets you play to each approach's strengths and tune the system's performance to the data in your knowledge base or the needs of your overall project.   
To do that tuning, however, you need a way to measure how well a retriever is performing, so join me in the next video to look at how retrievers are evaluated.

## Evaluating retrieval

While you can evaluate a retriever in terms of latency, throughput, resource usage, and so forth, what ultimately matters is search quality. In other words, is it finding relevant documents? Let's look at a few ways you can answer that question.  

- First, you'll need the prompt itself, as retrievers may perform well on one prompt and poorly on another.   
- Second, you need the ranked list of documents the retriever returns from that prompt.   
- And finally, you need a ground truth list of all the relevant documents in your knowledge base that the retriever should return. In other words, if you want to grade your retriever, you need to know the correct answers.

Two of the most common retriever quality metrics are precision and recall. 

- Precision is calculated by dividing the number of relevant retrieved documents by the total number of documents retrieved.   
- Recall, on the other hand, is calculated by dividing the number of relevant documents retrieved by the total number of relevant documents in the knowledge base. 

### Example

Here's an example to help you understand the difference. Suppose you know that your knowledge base has 10 documents relevant to a prompt because you hand marked them.   
You run your retriever on the prompt and it returns 12 documents, eight of which are relevant. The precision is 66% since eight of the 12 are relevant and the recall is 80% since eight of the 10 relevant documents were retrieved. Now, you adjust your retriever settings and run the prompt through it again. On this second run, it returns 15 documents, nine of which are relevant. Your retriever returned three more documents than last time, but only one more relevant document. Precision dropped to 60% or nine out of 15\. Recall, however, increases to 90% as you found nine of the 10 relevant documents this time.   
In other words, you've traded a little bit of precision away to get a bit more recall. Precision penalizes a retriever for returning irrelevant documents and can be thought of as capturing how trustworthy the results are. Recall penalizes a retriever for leaving out any relevant documents and measures how comprehensive the retriever is. The only way to have perfect recall and precision is to rank the relevant documents most highly and only return those documents. Otherwise, you're often trading off between the two.

### Retrieval with top-k

Retrieval metrics are influenced by how many documents the retriever returns. So to standardize, they're usually talked about in terms of the top K documents, meaning the K documents that the retriever ranked most highly.  

For example, consider this ranked list of documents returned by a retriever. The precision at five in this example is 40% since only two of the top five documents are relevant. The precision at 10 meanwhile rises to 60% as six of the top 10 documents are relevant. Suppose there are eight relevant documents in the knowledge base. The recall at 10 here would be six out of eight or 75%. Depending on which value of top K you choose, you can quickly produce new precision and recall values. Top five, top two, or top one metrics can be used when stricter standards are important.   
Often though, a slightly more generous range between top five and top 15 is used.

### Mean average precision (holistic view of retriever performance)

To give a more holistic view of retriever performance, mean average precision or MAP at K evaluates the average precision for relevant documents in the first K documents retrieved. First, let's calculate a related metric called average precision at six for this example. You list out the six documents the retriever ranked most highly and calculate precision at K for every row. Next, you add up the precisions only for rows that contain relevant documents. Here, those rows are one, four, and five. So you add one, 0.5, and 0.6. 

Finally, you divide by the number of relevant documents retrieved in the top K, which in this case is three. That gives us an average precision of 0.7. To calculate mean average precision, you just calculate average precision across many prompts and sets of documents retrieved and average those values. This just tells you what the average precision would be for a typical prompt your retriever receives. 

MAP rewards ranking relevant documents highly. If an irrelevant document sneaks into a spot high up in the rankings, it'll decrease the precision at the rank of every relevant document below it, bringing down the overall average.

 A high MAP value is therefore a good indication that a retriever is placing the relevant documents it finds high up in the ranking.

### Mean Reciprocal Rank

A final common metric is reciprocal rank, which measures the rank of the first relevant object in a returned list. For example, if the first relevant object appears at rank two, the reciprocal rank would be one over two or 0.5. If it were at rank four, the reciprocal rank would be 0.25. The further down the list the first relevant document appears, the worse the reciprocal rank. 

This is typically performed over multiple prompts to get the mean reciprocal rank or **MRR**. **MRR** reflects how soon on average you can find a relevant item in the retriever's ranking. And emphasizes the importance of including at least one relevant document as high in the ranking as possible.


### Example

For example, if you complete four searches using a retriever and the first relevant document in each ranking appeared in the first, third, sixth, and second spot in the ranking, you'd calculate the mean reciprocal rank by dividing one by each of those numbers. You then average those values. Here, that gives you one, one-third, one-sixth, and one-half. Adding those values and dividing by four gives you the mean reciprocal rank of 0.5.


### Conclusion of different metrics

With many metrics available, it's important to know how best to use them together. 

- Recall, or recall at K, is the most foundational and most cited metric for retrievers because it captures the most fundamental goal of the retriever, finding relevant documents.   
- Precision and MAP build upon this by assessing whether the retriever is including many irrelevant documents or how effectively the retriever is ranking them.   
- Mean reciprocal rank is a bit more specialized, but helps identify how well your model performs at the very top end of its ranking. 

These metrics can both help evaluate the performance of your retriever and help you decide if adjustments you make to a system are working. 

For example, you could adjust how heavily you weight semantic or keyword search in your hybrid retrieval system and then see what effect that has on your retriever's recall or precision for a collection of sample prompts. If there's a downside to these metrics, it's just that they all depend on having ground truth, relevant documents for a collection of sample prompts. This can be a time-consuming and manual process to compile. The end result, however, is a system you can monitor during both development and once it's in production.

### Closure

That brings us to the end of our journey through information retrieval principles and how they're combined in a retriever. Let's quickly review the main concepts we explored in this module. To begin, you were introduced to the fact that retrievers actually usually search for documents using a hybrid of three search techniques, keyword search, semantic search, and metadata filtering. You then look closely at how each search technique works and the benefits they provide. Keyword search ranks documents based on the frequency with which they contain keywords from the prompt. It's a mature approach and useful because it ensures documents contain the exact keywords found in the prompt. Semantic search ranks documents based on having similar meaning to the prompt.   
This is enabled thanks to an embedding model which can embed pieces of text to mathematical vectors with the special property that pieces of text with similar meaning will be embedded to vectors close to one another in vector space. Semantic search provides flexibility that keyword search doesn't. Metadata filtering excludes documents based on strict criteria captured in a document's metadata, usually to ensure results are relevant to a user. Hybrid search combines these techniques by performing a keyword and semantic search across the knowledge base, filtering the results using a metadata filter, and then combining the documents from both lists to form a single ranked list of documents from which the top matches can be returned to the user. Finally, you saw a few common metrics used to assess retrieval quality and evaluate whether it increases or decreases in response to adjusting various tunable hyperparameters in the hybrid search pipeline.

### **📚 Study Note: TF-IDF vs BM25 in Document Ranking**

#### **❓ Question:**

You work at a popular cooking website with over 50,000 recipes. Your database includes both short recipe cards (just 1 to 2 paragraphs) and comprehensive cookbook chapters (over 10 pages).

When users search for "chocolate," they're only seeing tiny recipe cards at the top, even when there are excellent 10-page chocolate cake cookbook chapters in your database. The problem is that recipe cards mention "chocolate" in 5% of their words (3 times in 60 words), while the detailed cookbook chapters only mention it in 0.5% of their words (30 times in 6000 words).

Your team must choose between TF-IDF and BM25 to fix this problem where short documents unfairly dominate search results. Which algorithm should you implement?

#### **✅ Correct Answer:**

**BM25, because it penalises long documents less aggressively than TF-IDF.**

#### **🧠 Explanation of All Answer Choices:**

1. **TF-IDF, because it rewards documents that include more copies of a keyword.**  
    ✅ True, but it also heavily favours short documents with high keyword density, which causes the problem you're trying to fix.  
2. **BM25, because it favours longer documents.**  
    ❌ Misleading. BM25 doesn’t favour long documents—it *normalises* for length, allowing longer documents to compete fairly.  
3. **TF-IDF, because it rewards documents for including rare keywords like "chocolate" using its IDF term.**  
    ✅ True, but again, it doesn’t handle document length well, so short documents still dominate.  
4. **BM25, because it penalises long documents less aggressively than TF-IDF.**  
    ✅ **Correct.** BM25 uses a saturation function and length normalisation, making it more balanced for ranking both short and long documents.

With the retrieval foundations in place, the next module focuses on production-scale vector databases, ANN indexing, chunking strategy, and reranking.