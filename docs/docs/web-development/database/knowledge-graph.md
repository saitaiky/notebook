---
title: Knowledge graph
---

## What is a knowledge graph?

A knowledge graph, also known as a **semantic** network, is a knowledge model represents a network of real-world entities—i.e. objects, events, situations, or concepts—and illustrates(interlinked descriptions) the relationship between them. This information is usually stored in a graph database and visualized as a graph structure, prompting the term knowledge “graph.”

In the below diagram - A represents the subject, B represents the predicate, C represents the object
![Knowledge Graph basic](/img/web-development/database/Knowledge_Graph-basic.png)
Source: [What is a Knowledge Graph?](https://www.ibm.com/cloud/learn/knowledge-graph#:~:text=A%20knowledge%20graph%2C%20also%20known,the%20term%20knowledge%20%E2%80%9Cgraph.%E2%80%9D)


![500-women-scientist](/img/web-development/database/500-women-scientist.gif)
Knowledge graph of 500 Women Scientists by [KgBase](https://www.kgbase.com/pages/release-notes/55)


### Key Characteristics

A knowledge graph is made up of three main components: nodes, edges, and labels. Any object, place, or person can be a node. An edge defines the relationship between the nodes.

Knowledge graphs combine characteristics of several data management paradigms:

- **Database**, because the data can be explored via structured queries;
- **Graph**, because they can be analyzed as any other network data structure;
- **Knowledge base**, because they bear formal semantics, which can be used to interpret the data and infer new facts.

Knowledge graphs, represented in **Resource Description Framework (RDF)**, provide the best framework for data integration, unification, linking and reuse.

### Examples

There are many different types of knowledge graphs developed by different companies that are used for different purposes. While many companies use an internal or smaller knowledge graph for online functions, some of the biggest ones are being used by many people all over the world. Below lists a selection of some of the largest knowledge graphs to date from Microsoft, Google, Facebook, IBM and eBay.

Most people conducting SEO will tend to focus on the Google Knowledge Graph as it’s the most frequently used and relevant knowledge graph for SEO. As Google, being the most popular search engine and the driver behind a lot of search engine innovation, it’s important to focus on developing entities and embedding them into the knowledge graph. 

| Developer | Purpose & Function | Stage of Development       |
|-----------|----------------------|----------------------------|
| Microsoft | Uses knowledge graph for the Bing search engine, LinkedIn data Academics.          | Actively used in products  |
| Google    | Knowledge graph is used as a massive categorization function across Google’s devices and directly embedded in the&nbsp;search engine. | Actively used in products  |
| Facebook  | Develops connections between people, events and ideas, mainly focusing on news, people and events related to the social network.      | Actively used in products  |
| IBM       | Provides a framework for other companies and/or industries to develop internal knowledge graphs.                                      | Actively used by clients   |
| eBay      | Currently developing a knowledge graph that functions to provide connections between users and products provided on the website.      | Early Stage of Development |

Source: [What is a Knowledge Graph? A comprehensive Guide](https://wordlift.io/blog/en/entity/knowledge-graph/)

Microsoft’s knowledge graph is still something to pay close attention to, as while not as many people use Bing, plenty of people do use Microsoft’s services, including LinkedIn. So while Google may be the primary focus of SEO and entity development, it’s important not to forget about Microsoft. Thankfully, they both use schema markup, so developing entries for both of them shouldn’t be too difficult.

Other knowledge graphs may be useful in SEO in certain circumstances. For example, Facebook’s knowledge graph might be useful for branding, local businesses, and people hosting events for embedding in their social network. IBM’s knowledge graph might be useful in working within the internal knowledge graphs of other companies but may still hold value for SEO. The same goes for eBay’s knowledge graph, though it is more uncertain as their knowledge graph is still in the early stages of implementation and development. There are also many more knowledge graphs not listed above that are used by many publishers and developers across many different platforms.
## The Google Knowledge Graph 

> Google’s search results sometimes show information that comes from our Knowledge Graph, our database of billions of facts about people, places and things. The Knowledge Graph allows us to answer factual questions - [Google](https://support.google.com/knowledgepanel/answer/9787176?hl=en-GB)

When talk about Knowledge Graph, people instantly think of **Google Knowledge Graph**, along with the rasie of AI, it makes Knowledge Graph becomes a hot keyword once again. For example, the Knowledge Graph allows Google to answer factual questions such as 'How tall is the Eiffel Tower?' or 'Where were the 2016 Summer Olympics held?' 

When we search 'where did Obama's wife graduate?' The search enginee isn't only give you the answer 'Michelle Obama is a graduate of Princeton University and Harvard Law School' but also listed her biography in the **knowledge panels**

![Google Knowledge Graph](/img/web-development/database/google-knowledge-graph.png)

Of course, to be able to answer this question can't be leverage only the powerful **Google Knowledge Graph** but also the **machine learning algorithm** takes a huge part to understand the semantic meaning of the search keywords and the gramma of the sentence. Without these technologies, the search enginee won't be able to understand what you intended to search for isn't Obama but his wife.

## Semantic Network

A semantic network, or frame network is a knowledge base that represents **semantic relations** between **concepts** in a network. This is often used as a form of knowledge representation. It is a directed or undirected graph consisting of vertices, which represent concepts, and edges, which represent **semantic relations** between **concepts**, mapping or connecting semantic fields. A semantic network may be instantiated as, for example, a graph database or a concept map. Typical standardized semantic networks are expressed as semantic triples.

One of the semantic network example is called **[WordNet](https://wordnet.princeton.edu/)**. It's a large lexical database of English. Nouns, verbs, adjectives and adverbs are grouped into sets of cognitive synonyms (synsets), each expressing a distinct concept. Synsets are interlinked by means of conceptual-semantic and lexical relations. 

Compare with Knowledge graph, **WordNet** emphasises **how to express a word semantically correct** whilist **Knowledge Graph** emphasises **the relationship of our physical world**.

:::info Example
Let's see how Knowledge Graph and WordNet represent this sentence `Barack Obama and Michelle Obama are couple`.

Knowledge Graph represent this concept as (Barack Obama)---couple---(Michelle Obama). It focuses on 
- the the concept of class which is human 
- relationship between them which is couple

WordNet focuses on the meaning of words 
- what are the synonyms of those words?
- what is the meaning of those words?
:::

## Ontologies (本體論)

Ontologies represent the backbone of the **formal semantics** of a **knowledge graph**. They can be seen as the data schema of the graph. They serve as a formal contract between the developers of the **knowledge graph** and its users regarding the meaning of the data in it. 

A user could be another human being or a software application that wants to interpret the data in a reliable and precise way. Ontologies ensure a shared understanding of the data and its meanings.

Ontologies are also frequently mentioned in the context of **knowledge graphs**, but again, there is still debate around how they differ from **knowledge graphs**. Ultimately, ontologies serve to create a formal representation of the entities in the graph. They are usually based on a *taxonomy*, but since they can contain multiple taxonomies, it maintains its own separate definition. Since **knowledge graphs** and **ontologies** are represented in a similar manner—i.e. through nodes and edges—and are based on the **Resource Description Framework (RDF)** triples, they tend to resemble each other in visualizations.

### Examples

An example of an **ontology** might be if we examine a particular venue, like Madison Square Garden. An **ontology** distinguishes between the events at that location using a variable such as time. A sports team, like the New York Rangers, has a series of games within a season that will be hosted in that arena. They are all hockey games, and they are all located in the same venue. However, each event is distinguished by their date and time.

The Web **Ontology Language (OWL)** is an example of a widely adopted **ontology**, that is supported by the World Wide Web Consortium (W3C), an international community that champions open standards for the longevity of the internet.  Ultimately, this organization of knowledge is supported by technological infrastructure such as databases, APIs, and machine learning algorithms, which exist to help people and services to access and process information more efficiently.

### Formal Semantics

When formal semantics are used to express and interpret the data of a knowledge graph, there are a number of representation and modeling instruments:

- **Classes**. Most often an entity description contains a classification of the entity with respect to a class hierarchy.  Persons and organizations can have a common superclass Agent. Location usually has numerous sub-classes, e.g., Country, Populated place, City, etc. 

- **Relationship types**. The relationships between entities are usually tagged with types, which provide information about the nature of the relationship, e.g., friend, relative, competitor, etc. Relationship types can also have formal definitions, e.g., that parent-of is inverse relation of child-of, they both are special cases of relative-of, which is a symmetric relationship. Or defining that sub-region and subsidiary are transitive relationships.

- **Categories / taxonomies**. An entity can be associated with categories, which describe some aspect of its semantics, e.g., “Big four consultants” or “XIX century composers”. A book can belong simultaneously to all these categories: “Books about Africa”, “Bestseller”, “Books by Italian authors”, “Books for kids”, etc. The categories are described and ordered into taxonomy.

## Knowledge Base

Knowledge base 早在1970年代就被提出來，主要有二個特徵，一是有一個知識呈現方式來表達事實(facts)，通常是知識本體，並有儲存庫(repository)來儲存這些事實，這裡的事實和資料不一樣的地方在於結構化和正規化，以知識本體的角度而言，就是一個被陳述的事實一定會有一個類別來說明並表明這個事實應有或可有的關係。另一個特徵是推理機(inference engine)，可以使用邏輯規則來推論以減少這些事實的不一致(inconsistence)，當然早期許多以Knowledge base為基礎的專家系統會強調，推理機可以透過規則和邏輯關係的建立，回答問題，或預測更多事實。

### ABox and TBox

Knowledge Base和Knowledge Graph應該是被混用最多的二個名詞，本質上，這二個東西確實是相似，有綱要(schema)部份，也就是圖4中TBox (Terminology Box)，一般而言，是以OWL來實現，以及ABox (Assertion Box)，就是事實(facts)，一般由RDF來實現。
![Knowledge base的組成ABox 和 Tbox](/img/web-development/database/knowledge-base-Abox-Tbox.png)

### Example
圖5中在雲朵中的都屬於TBox的部份，都是類別(classes)，而方框中的是ABox，是根據TBox類別所定義的實例(instances)，或者是事實(facts)。
![ABox和TBox的實際範例](/img/web-development/database/ABox-&-TBox.png)

最大的差別在於Knowledge base在提出時，並沒有想到是一個網路規模(Web scale)的應用，內容(也就是事實)如此龐大，對於資料的綱要(schema)(TBox)要求較多，相對而，knowledge graph的TBox部份就比較沒這麼複雜。另一方面，knowledge base的建立常常只是單一領域，例如，Geonames 只有地名，和knowledge graph盡量收納所有知識的基調，是完全不一樣的。

## Further Reading
- [What is a Knowledge Graph?](https://www.ontotext.com/knowledgehub/fundamentals/what-is-a-knowledge-graph/)
- [What is RDF?](https://www.ontotext.com/knowledgehub/fundamentals/what-is-rdf/)
- [A reintroduction to our Knowledge Graph and knowledge panels](https://blog.google/products/search/about-knowledge-graph-and-knowledge-panels/)
- [What is a Knowledge Graph? A comprehensive Guide](https://wordlift.io/blog/en/entity/knowledge-graph/)
- [Knowledge Graph (知識圖譜)的前世今生](http://geocyber.org/blog/?p=1335)