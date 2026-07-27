---
title: "Module 5: RAG Systems in Production"
unlisted: true
---

At this point, you know all the skills you'll need to design and build your own RAG system. Once you're ready to move that application into production, however, a number of new considerations arise. In this module, you'll learn how to get your RAG system production ready. To start, you'll review a variety of evaluation strategies for RAG systems and platforms for running those evals. Whether you're looking at individual components or your overall system, you'll want the ability to observe your system's performance. You'll also explore how logging can help you trace individual calls to your RAG system and identify the cause of low-quality responses. To conclude this look at evals, you'll learn how to build custom datasets from your application's traffic in order to test changes to your RAG system using actual customer data. 

In the next section, you'll explore a variety of trade-offs you'll often encounter when designing and tweaking your RAG system. Whether you're looking to control cost, memory footprint, or latency, you'll investigate strategies that help align a RAG system with your project's needs without significant loss in response quality. Finally, you'll explore some cutting-edge approaches to incorporate multimodal data into RAG systems, allowing your systems to pull from a knowledge base that contains image or PDF data in addition to text. As always, the module concludes with a programming assignment where you can try out all the skills you've learned. I think you'll enjoy this final module focused on making your production RAG system even higher performing. Join me in the next video and let's get started.

## What makes production challenging

Production environments put entirely new strains on your RAG system, and navigating those challenges requires a different set of skills than is required when prototyping. To start this module, let's just review what new challenges your system will face once it's being used by actual customers.

### Scaling performance

The first set of challenges you'll encounter in production simply arise from scaling up more traffic. More users constrain the throughput of your system, whether it's how many requests it can handle at once, or the latency between receiving a request and returning a reply. More requests also means more memory and compute usage, which eventually means higher costs. Keeping up raw system performance at scale can be challenging.

### Unpredictability of prompts

A second category of challenges comes from the variety and unpredictability of prompts your system will receive once it's in the hands of your users.   
Even with rigorous testing, it's difficult to predict every type of request your RAG system will receive. You may find your system struggling on some of these new requests, even if it performed well on pre-launch testing.

### Messy Real world data

Another challenge in production is just that real-world data is often a mess. It's not uncommon for data to be fragmented, poorly formatted, missing metadata, and so forth. A lot of data also isn't even in a text format at all, but instead is found in images, PDFs, and slide decks. If you want to include this data in your knowledge base, you'll need a way to access it.

#### Security and Privacy

Security and privacy issues are also a concern.   
A lot of RAG systems are deployed expressly because the data in your knowledge base is private or proprietary. Ensuring the data remains private while allowing authorized users to access it when using your RAG system is important functionality.

### Mistakes can harm the company's reputation or financially

#### Case 1:

On top of all these challenges, the biggest issue with production is that mistakes can have real business impact, whether financial or reputational. When Google first launched its AI Search Summaries feature, it responded to some prompt by advising users eat rocks for the nutritional benefits they provided. When Google investigated the cause of this issue, it turned out that a user had asked, How many rocks should I eat? An admittedly silly and hard-to-predict question. When the system retrieved information on the question, many of the articles or forum conversations it found were comical.   
But the system failed to recognize that fact. Google subsequently fixed this issue and even wrote a blog post explaining the source of the bug.

#### Case 2:

But they're far from the only company to run into trouble after launching an LLM-based product. Airline chatbots have promised well-meaning customers discounts that don't actually exist. Malicious actors will try to trick your RAG system to sell them your product for free or reveal secret information. Production is simply a challenging environment for your RAG system to operate in. And so having systems in place to anticipate problems before they happen, track them down when they do, and verify that changes you make lead to real improvements is critical.   
There's a variety of techniques you can use to address all of these production challenges. Join me in the next video to see the first of these, building a robust observability system. 

## Implementing RAG evaluation Strategies

### Key Metrics

A good first step to handling production challenges is building a robust observability system. To start, let's look at the different components it should include. An observability platform needs to track a few different kinds of information. First, it should track common software performance metrics like latency, throughput, memory, and compute usage. As with almost any production software system, you'll want to know how many requests your system is handling, how long it takes, and how many resources it's consuming. Next, you'll need to track a variety of quality metrics. Quality here could mean everything from user satisfaction with the final replies they receive to the recall of your retriever.   
Beyond knowing how quickly or efficiently your system is operating, you'll want to know if the final results meet the quality standards you've set.

### How to track

It also matters how this information is collected and reported. Your system should capture aggregate statistics over time to help you track high-level trends in performance and quickly identify regressions. Separately, the system should record detailed logs. These will allow you to trace the journeys of individual prompts through your RAG pipeline, particularly useful when you're trying to understand the source of poorly performing responses. Finally, your evaluation system should ideally enable experimentation. If you're considering switching to a new language model, adjusting a system prompt, or tweaking the settings on your retriever, you want to either run customized experiments in a secure environment or A-B test changes with users in production.   
The ability to monitor the impact on performance and quality metrics is what should ultimately help you decide if you want to move these experiments into your production system. With that high-level structure in mind, let's look at the specific metrics you'll want to track.

### Scope & evaluator table

With that high-level structure in mind, let's look at the specific metrics you'll want to track. A good framework for thinking through all of these is scope and evaluator type. Scope here means whether an evaluation is targeting a component of your RAG system or the overall system. Evaluator type, meanwhile, asks whether the eval is code-based, uses LLM as a judge, or relies on human feedback. You can think of these two dimensions forming a grid, with the evals you choose living in one of the resulting squares. Let's explore each dimension and then look at where some common evals fall within that grid.

#### Scope

Let's start with eval scope. Common-level evals are usually for summarizing overall system performance or giving a high-level view of how things are going. Component-level evals, meanwhile, help you debug the source of individual issues. For example, you might track the latency on your overall system and find that it's too high. In order to track down the source of that issue, however, you'd need component-level evals to track whether the retriever, your LLM, or another component entirely is ultimately causing the problem.

#### Evaluator types

Evaluator type focuses on how the evaluation is generated. 

- **Code-based** evals are the cheapest, simplest, and most straightforward to implement. This could be everything from just recording the number of prompts your system processes a second to running unit tests to ensure your LLM is outputting valid JSON. What matters here is that these evals can be run automatically, are deterministic, and are nearly free-to-run.  
-  On the other hand of the spectrum is **human feedback** and evaluation. One common example is users of your application marking responses with a thumbs up or thumbs down. Even if it doesn't give you a lot of detailed information, the fact that more users mark your responses with thumbs down is a useful indication that you have a problem to fix. You might give users a text box to give more detailed feedback as well. Other evals can be run automatically but depend on human input at the outset.   
  For example, you can have humans pre-compile datasets of the prompt and the relevant documents that should be retrieved. Once that dataset is compiled, you can rapidly calculate common metrics like precision and recall. But it's worth remembering that at some point a human needed to compile that initial test dataset. In general, human feedback and annotation is a more costly approach but it captures the information that code-based evals will miss.   
- **LLM as a judge** tries to split the difference by using a language model to grade different components of your system's performance. For example, an LLM might determine whether the documents retrieved by a retriever are actually relevant to the user's prompt. LLM as a judge is more flexible than code-based evals and cheaper than human feedback.   
- LLM as a judge still needs to be carefully tuned however. Models can have biases and favor responses generated by a model from their own family. They also need clear rubrics and typically perform best with discrete standards like relevant or irrelevant rather than a grading on a scale from 0 to 100\.

### How they work together

Let's see how all of these different evaluation concepts can be put together into a simple but comprehensive set of metrics you could start out collecting. A good idea to start is to collect both software performance and quality metrics for each major component and then the overall system. 

#### Software performance 

System performance metrics like latency, throughput, memory usage, or tokens generated per second are code-based evals, making them cheap and easy to collect. You can readily capture this data at both the component and system-wide level. 

#### Quality metrics

For quality metrics, you typically will need to rely on techniques that use human annotation or LLM as a judge. For system-wide quality metrics, you could allow users to give you thumbs up or thumbs down on generated responses, giving you feedback on overall response quality. For evaluating a retriever, you could spend the time to compile a human-annotated test dataset of prompt and expected retrieved documents, allowing you to calculate common metrics like recall and precision. To evaluate LLM quality, you'll typically use LLM-based evals, like those found in the Ragas library, to assess things like response relevancy, the quality of citations, or how well the LLM is ignoring irrelevant retrieved information. 

An approach like this gives you visibility into both the performance and quality of your overall system and individual components. It also captures a nice balance of cheap evals like latency and more expensive metrics that rely on human annotation or LLM calls. From there, you can decide which additional areas you'd like to look more closely at.

## Logging, monitoring, and observability

Once you know what metrics you want to collect about your RAG system, you actually need to build the system to collect that data. Let's look at the tools available to you to implement your observability system. There are many observability platforms available for LLM-based applications. These are designed to perform common evaluation tasks like capturing the system-wide or component-level metrics, helping log system traffic, and enabling experimentation with new system settings. Using a platform like this means you're spending less time designing and implementing your observability system, and more time monitoring your RAG system's performance and experimenting with ways to improve it.

An observability and evaluation platform provides a number of tools that help you evaluate your RAG system's performance.   
Let's look at a few of those tools, starting with perhaps the most commonly used one, traces

### Traces

A trace allows you to follow a prompt's path through the entire RAG pipeline, seeing how it's modified by each component in the system. For example, you could see the initial text prompt, the query that is sent to your retriever, what chunks the retriever returned, how those chunks were processed by your re-ranker, what prompt was ultimately sent to your core language model, and the final response that was generated. Useful information like the latency of each step can also be recorded.

Following traces is a common tool for evaluating your RAG system, whether it's an early prototype or already in production. For example, if you know that a prompt performed poorly in your RAG system, you can trace its path and try to determine which step is the source of the error. 

### Example: OpenTelemetry spans for a RAG pipeline (rag-5)

```python
with tracer.start_as_current_span("rag_pipeline"):
  with tracer.start_as_current_span("retrieving_documents"):
    docs = retriever(query)

  with tracer.start_as_current_span("augment_prompt"):
    prompt = build_prompt(query, docs)

  with tracer.start_as_current_span("generate"):
    answer = llm(prompt)
```

### Evaluation

It integrates with the RAGAS library you've used for different evaluation metrics. So, if you wanted to calculate the search relevancy of your retriever, or whether your LLM is accurately citing retrieved sources, it's easy to add those evaluation steps. Once you have a basic evaluation pipeline set up, you can start running simple experiments. For example, you can iteratively try your own prompts and see how they would be processed by your RAG pipeline. You can also A-B test changes to your system to see how they impact system performance. Features like this help you decide if a new system prompt actually improves response quality, or see what kind of performance gains you get from adding a re-ranker. While tracing gives you access to low-level information, you also typically want high-level aggregate statistics to track system performance. 

While Phoenix and other LLM observability platforms cover most of the evals you'll want to collect about your RAG system, there will be **some gaps**. For example, it's not a great tool for monitoring the compute and memory usage of your vector database. In these instances, you can use more classical monitoring and observability tools like Datadog and Grafana.

### Example: retrieval + citation eval loop (rag-5 style)

```python
sample = {
  "question": query,
  "contexts": [d.page_content for d in docs],
  "answer": answer,
  "ground_truth": reference_answer,
}

# Run with your chosen evaluator stack (for example, RAGAS metrics)
evaluation_results = evaluate([sample], metrics=["context_recall", "faithfulness"])
```

### Closure

A good observability pipeline ultimately leads to a flywheel of system improvements. By seeing how your system handles real production traffic, you're able to identify bugs or target areas for improvement, and then see the impacts of changes you make. Over time, this lets you tune each component over your system to best match the way your users are actually using it. 

A valuable tool in this process is the ability to create custom datasets of prompts your RAG system has previously processed. By saving and then re-running these prompts through your system, you can see the impact of system changes on actual prompts your application has received. So let's go on to the next video and see what it looks like to build one of those custom datasets.

## Customised evaluation

A customized dataset is just a collection of prompts your system has previously processed, as well as any information you choose to collect about that prompt's journey through your system. You could choose to save just the initial prompt and final response, or you could add tons of information to your custom dataset, like which documents your vector database retrieved, the way those documents were ranked before and after your re-ranker, the output of your query rewriter, and so on and so forth. 

With so much flexibility, an important decision when building a custom dataset is what data do I store? The simple answer is, what do you want to evaluate? For example, you'll almost certainly want to save the **input** prompt submitted by users and the **final responses** generated by your RAG system.   
These two basic data points give some sense of system performance and would let you track how responses change with edits to prompts. 

That information, however, really only helps with end-to-end evaluation. If you want to do component-level evaluations to know how well your retriever, re-ranker, or query rewriter are performing, you'll need to save the input and output data used by each of those components. 

Typically, you'll want to have these detailed component-level steps recorded, and as a result, the tables used for logging calls to a RAG system can easily have dozens of columns, storing everything from the ID of the customer who made the call, to the text chunks your re-ranker sifted through, to the output of each router LLM in your agentic workflow. 

Storing a wide variety of data like this allows you to analyze each component of the system individually and examine performance across many dimensions.

### Example Analysis

For example, if you're building a customer service chatbot, you could filter by question topic to detect that questions about refunds are receiving high-quality responses, but questions about product delays are not performing well at all. When you go to investigate why those product delay-related prompts led to low-quality responses, you might be able to analyze the logs to detect that your retriever isn't able to find many relevant documents for those prompts.   
Maybe you need to add more relevant information to your knowledge base. If you build the right observability system in place, you'll be able to detect problems, pinpoint their sources, and feel confident that solutions are working.

### Example

Let me share one example of this from my own career. I was working on a specialized RAG system that had the ability to generate text, images, and code-backed charts and diagrams using Mermaid.js. We started to receive complaints that the quality of some of the diagrams generated by the system was quite low. Working backwards through our logs, we realized that many of these issues arose when users asked the system to draw a diagram. The router language model misinterpreted this prompt and so sent it to the text-to-image model used for image generation.   
These models are pretty good at generating images of people or things, but pretty bad at generating charts. Once we realized the source of the problem, we were able to update the system prompt for the router LLM so that those prompts would create code-backed charts and not generated images. Thanks to a robust monitoring and logging system, once we received customer reports of the issue, it was straightforward to track down its source and quickly get a fix into production
### Visualizing Data

While sometimes you'll want to track down poorly performing individual prompts like this, once you're logging lots of data, you'll often want to visualize it. This can let you identify high-level trends in the performance of the overall system or of each component. For example, you could visualize all of the input prompts that go through your system and use some sort of clustering algorithm to identify the high-level topics your customers are asking about, like product launches or troubleshooting questions. If you can differentiate all of these different prompts, then you can run your eval pipeline on only that type of prompt and see if your system is underperforming for certain types of questions. 

Custom datasets are an important tool for personalizing your RAG application to the requests to your system processes. Incorporating them into how you evaluate your system is the best way to improve the way your system responds to the actual prompt and questions your users are asking.
## Quantization

Once you're able to evaluate your RAG system and experiment with different configurations, you'll be ready to take on some familiar trade-offs in many software projects. Cost, speed, and quality. You'll explore these trade-offs over the next few videos, but first let's introduce an important concept, quantization.

### Overview: Quantisation is just compression

Quantization replaces the model weights inside an LLM or the values of an embedding vector with a compressed, lower precision data type. This makes the models or vectors respectively smaller, cheaper, and faster to run, often without much sacrifice in retrieval relevance or response quality. Let's have a look to see how it works. A good analogy for quantization is image compression.   
This high-quality image uses 24 bits of data to represent the color at each pixel. The colors look great, but it does use quite a lot of data to store all that information. You can compress the image by using 12 or even 6 bits for each pixel. The compressed images are 1 half and 1 quarter of the size of the original, which is a significant memory saving. That said, the 12-bit image already doesn't look as nice, and in the 6-bit image, there are many visible color artifacts. Depending on where you're using the image, however, this drop in quality might be worth the substantial memory savings. Quantization takes the same approach to LLMs and embedding vectors, shrinking their size with some loss in quality as a trade-off.

### Example: quantization experiment checklist

```python
# Pseudo-workflow for safe rollout
configs = [
  {"precision": "fp16"},
  {"precision": "int8"},
  {"precision": "int4"},
]

for cfg in configs:
  metrics = run_eval_suite(model_config=cfg)
  print(cfg, metrics["latency_ms"], metrics["faithfulness"])
```

### How it works in LLM

The parameters in a typical language model use 16 bits of memory each. With modern models ranging between roughly a billion to a trillion parameters, these models are huge, requiring lots of memory to store them and powerful GPUs to run them. Quantized models compress those 16-bit parameters down to 8 or even 4-bit equivalents. This significantly reduces the GPU memory required to run the model at the cost of a little model performance and quality.

#### How it works in Embedding Vector

Quantized embedding vectors work similarly. A fairly typical 768-dimensional vector will use 768 32-bit floating point numbers.   
That's 3 kilobytes of data for every vector in your knowledge base. Higher dimensional models can easily require many times that much. Once you're storing millions or even billions of these vectors, you've got huge amounts of vector data to deal with. These vectors need to be stored somewhere to use them, and especially if you want to use them in rapid vector search, they need to be loaded into expensive RAM. Integer quantization is a commonly used approach for shrinking these vectors.

#### How it works in a formula

Integer quantization is a commonly used approach for shrinking these vectors. It replaces the 32-bit floating point numbers with a much smaller integer, for example, an 8-bit integer. This means that your vectors are now immediately one quarter of their original size, a massive space saving.   
These integer values are also remarkably easy to calculate. Here's how the process works. You find the minimum and maximum values that appear in each dimension for your vector data. This will define the range that values in that dimension will fall between. Then you divide that range into 256 equally sized sections. The amount of unique values you can make with 8 bits. Those sections are then numbered 0, 1, 2, 3, and so on up to 255\. 

Each floating point number from your original vectors are then just assigned an integer value equal to whatever section it falls within. If you also store the minimum value and the width of each section, you have all the information you need to calculate an approximation of the original 32-bit float, but using only 8 bits of data.

### Performance 

#### in 8 bits quantised embedding models

For benchmarks like Recall at K, you might only see a drop of a few percentage points with 8-bit quantization. These quantized embedding vectors, meanwhile, allow for less data to be stored in your vector database while powering faster search as the calculations required have been simplified. Quantized LLMs also often have only minor drops in performance when measured using commonly referenced benchmarks. Meanwhile, they use less GPU memory and can generate text more rapidly.   
In other words, these are huge memory and performance gains for a small drop in quality.

#### in 1-bit quantised embedding models

While 8-bit integer quantized vectors are commonly used, 1-bit or binary quantized vectors are also gaining popularity. This approach compresses the size of a vector by a factor of 32, from 32 bits per dimension to just 1 bit, which is a massive saving. At this level of compression, each value in your vector is either a 1 or a 0, and just tells you if that value at that dimension was a positive or a negative number. As you might imagine, at these extreme compression levels, performance can drop noticeably for embedding model-based retrieval. That said, 1-bit quantization results in significantly smaller and faster vector-based retrieval. It can also be paired with other techniques, for example, performing fast retrieval based on a 1-bit quantized embedding model, and then rescoring using the full original 32-bit vector.

### The other way to Quantization (Matryoshka quantization)

Another way to shrink the size of your vectors is to use a Matryoshka embedding model, based on the Russian word for nesting dolls. These vectors are designed so that you can choose to use only a subset of a vector's dimensions when doing things like comparing similarity. For example, if the full vector has 1000 dimensions, you could choose to use only the first 500 or the first 100 dimensions. To enable this behavior, Matryoshka embedding models have a special property. Their dimensions are sorted by how information-dense they are. Here, information means how much statistical variance you'd expect to see in that dimension when embedding large amounts of text. In a typical embedding model, every dimension would have roughly the same amount of variance or information. 

In a Matryoshka model, thanks to the training process used, earlier dimensions will have more variance, which means more information content. Later dimensions have less variance, meaning they provide relatively less information, and so you pay less of a penalty for excluding them. There's a few ways to use Matryoshka vectors. You could choose to only ever use the first 100 dimensions, saving space and leading to faster computations, while preserving the maximum possible amount of information. Or you could always perform initial retrieval using the first 100 dimensions, then pull the remaining 900, now using the full 1000 dimensions, out of slower, cheaper memory to essentially help rescore the initial set of documents you retrieved. The flexible properties of Matryoshka models make it best suited for dynamic environments where you may want to quickly switch from low to high fidelity vector representations.

### Important points

While these advanced techniques show what's possible at the cutting edge of quantization, the core takeaway is that you probably should experiment with using integer quantized LLMs and embedding models.   
Most LLM and embedding model providers will make 8 or 4-bit quantized models available alongside their base models. The space and cost savings they provide can be significant, and the quality reductions are quite small.

## Cost vs Response Quality

Now, it's time to talk about every engineer's favorite topic, the budget. When you're designing your first RAG system, you'll probably focus on exploring what's possible and getting a working prototype. As you start scaling your system to hundreds, thousands, or even millions of requests, cost considerations become increasingly important. So let's have a look at what strategies are available to you to limit a system's costs while still providing high-quality responses.

The two largest costs in a typical RAG application will be your vector database and your large language models. Let's start by looking at some ways to manage LLM costs. 

### Smaller Models and Smaller Prompts

One way to reduce LLM costs is to experiment with using smaller models.   
Whether it's the core LLM responsible for generating a final response or router LLMs in an agentic system, you might be able to achieve similar overall quality with smaller and therefore cheaper models. Models can be smaller either because they contain fewer parameters from the outset or because the values of their parameters have been quantized to a lower precision format like 8-bit. In either case, you'll often be pleasantly surprised at how well smaller models perform, especially if your LLM will be performing a limited number of tasks. Fine-tuning a small model can lead to good results at a low cost. 

A second straightforward approach is to experiment with ways to limit the number of input and output tokens. RAG prompts can rapidly grow in size, especially if you retrieve many lengthy chunks for each prompt. Experiment with retrieving fewer documents, or in other words, reducing top-k. 

### Example: controllable top-k for prompt cost

```python
def answer_with_budget(query: str, top_k: int = 4, max_tokens: int = 256):
  docs = retriever(query, top_k=top_k)
  prompt = build_prompt(query, docs)
  return llm(prompt, max_tokens=max_tokens)
```

Many LLMs can be long-winded, and remember, you pay for every token they generate. Updating system prompts to encourage succinct responses or even setting a firm token limit is another straightforward way to reduce costs. Whether you're reducing model size or prompt length, having a robust observability pipeline in place will allow you to assess the impacts of these changes and decide if the trade-off between cost savings and response quality reduction are actually worth it. 

### Host models on Dedicated Endpoints

Another possible approach is to host LLMs on dedicated hardware. Cloud LLM providers like TogetherAI, AWS, and Google offer convenient inference endpoints, and they often make sense to use when you're building a prototype. If your project is scaled to thousands or millions of requests, however, you might want to save money by running models on dedicated hardware rented from those same companies. The additional benefit of dedicated endpoints is better **reliability**, since that hardware is only serving your user traffic and nothing else. 

When using dedicated hardware to host models, you'll pay per hour for the GPUs your model requires. At scale, however, the cost savings by paying **hourly** versus paying per token can be very significant. 

### Cost model comparison: per-token vs dedicated endpoints

#### Per-token pricing (typical API)

- You pay per request based on input and output token counts.
- Cost scales linearly with usage.

#### Hourly pricing (dedicated hardware)

- You rent compute by the hour regardless of token count.
- At high throughput, hourly pricing can be much cheaper per token.

#### Quick intuition

- If traffic is low or bursty, per-token pricing is often simpler.
- If traffic is high and sustained, dedicated endpoints can significantly reduce cost.

### Vector Database Cost Reduction

When looking to save money on your vector database, it's important to know that most databases offer you multiple types of memory. Typically, there are three kinds of memory to consider here – RAM, disk memory, and cloud object storage. 

- RAM is the fastest, but most expensive.   
- Cloud object storage is the slowest, but cheapest.   
- And disk memory sits somewhere in between. 

RAM is often several times more expensive per gigabyte than disk memory, which is itself several times more expensive than cloud storage. If you want to save money, then you want to make sure you're only paying to keep information in fast and expensive storage if it'll actually benefit your system's performance. 

The HNSW index, for example, should be kept in RAM to ensure vector search runs as rapidly as possible. Your document's contents, however, probably don't need to be stored in **RAM**. You might then decide to put your most commonly accessed documents in disk memory and your rarely accessed objects in cloud object storage. 

Many vector databases include features that help you monitor this trade-off and can even help dynamically move data into different kinds of storage based on your application's needs. 

A typical example of this approach is multi-tenancy, which means dividing all the documents in your vector database by the user or organization they belong to. 

For example, you might have one million documents in your vector database, owned by a thousand different users. Each user should only be able to access their own documents, so each user will actually have their own HNSW index for the documents associated with them. This system makes it easy to quickly load a tenant's data into fast, expensive memory only when necessary. For example, you might wait until a customer actually logs into your website to load their vectors into RAM, or you could default to keeping the data of your European tenants in slower storage during nighttime in Europe. 

In either case, you're just moving data in and out of expensive memory, but organizing information by tenant makes it easier to perform this task in an efficient way. 

### Closure

The core idea of all of these optimizations is that as an engineer, you need to understand the source of your **costs** and ensure they're justified by **performance**. 

- For LLMs, smaller models and shorter prompts is usually the way.   
- For vector databases, storing smaller amounts of data in expensive storage and moving between RAM, disk, and object storage are the primary ways to save costs. 

Experimenting and monitoring the performance impacts of these changes will allow you to decide if the cost savings they bring are worth it.
## Latency vs Response Quality

Another important balancing act that you have to consider for a RAG application in production is the time any one query takes, or latency, versus the response quality. Simply adding a retriever to your system adds latency. And as you add more components to increase response quality, like re-ranking or building more complex agentic systems, latency can increase. So let's look more closely at this trade-off and how you can find the right balance for your system.

### Why Latency Matters

How important latency is to your system depends heavily on the context in which it'll be used. Customers browsing an e-commerce site have notoriously little patience for slow response times. So you'd probably optimize your item recommendation service to have very low latency, possibly at the cost of not recommending the perfect item from your catalog.   
A RAG system designed to help doctors diagnose rare diseases, on the other hand, would likely be optimized for response quality, even if that means responses take much longer to produce. 
### Latency Culprit \- LLM

When tackling latency, an easy guideline to remember is that almost all of it is the result of running a transformer. As a result, the biggest culprit will be your large language model calls. While retrieval does add a little bit of latency, in particular, some transformer-based re-ranking techniques, modern databases, and in particular vector databases, are very fast and scale well. 

#### LLM Latency Techniques

If you want to cut down on latency, the best place to start is your core language model. One effective approach here is to just use a smaller language model. 

Smaller LLMs, or quantized models, will always run faster on the same hardware, assuming the same memory is available. Another approach is to use a smaller router LLM, whose job it is to look at the prompt and decide whether a smaller or larger LLM is the right tool for the job. If a query requires complex reasoning, it can be routed to a larger and more powerful model. Meanwhile, simple queries can be routed to smaller and faster models. This helps keep latency down for simpler prompts while allowing latency to increase only for the more complex prompts that require it. 

#### Caching

For systems that often receive very similar prompts, caching can also help with latency. To do this, you maintain a cache of frequently submitted prompts and their responses. When new prompt is received, you rapidly compute similarity scores between the new prompt and those in the cache. If you find a close enough match, you can immediately return the cached response, entirely skipping the relatively slow generation process. With careful tuning, this approach can greatly improve system latency for many prompts. 

If you want to still make use of caching, but somewhat personalized responses, you can still retrieve cached responses, but then **feed the cached response and user prompt** to a **smaller** and **faster** LLM to make small adjustments to the response to make it more relevant to the prompt. 

### Address the transformer-based components

Once you've optimized that latency of your core LLM, the next step is to address other transformer-based components in your pipeline. This might be a query rewriter, a re-ranker, or a router LLM, and so forth. Each of these components serves an important role, but they also increase latency. 

My advice here is to measure both the **latency** each **component** is adding to your system and the incremental response quality they provide.   
You might realise you're not getting much benefit from your query-rewriter, for example, and opt to remove that component.   
### Retrieval Latency

While generation is typically the biggest source of latency, there are still ways to eliminate latency caused by your retriever. 

- One approach is to use embeddings that are binary quantized in your vector database. This simplifies the underlying vector distance calculations and helps speed up retrieval.   
- Sharding larger databases into separate instances, especially once they get quite large, can also help reduce search latency. 

These are common approaches to improve latency in any database, and most vector database providers include tools to help you implement them. 

### Closure

There's almost always some latency versus quality trade-off in your RAG system. To start, you should understand how much latency your system can tolerate. If you need to reduce latency, start by addressing your core LLM. Then, move to the other transformer or LLM-based features. If latency is still an issue, take on other components of your pipeline. With a robust observability system in place, you should be able to see the impact of your changes and iteratively reduce latency to the levels your project needs.

## Security

Let's talk about securing your RAG application. Cybersecurity is a deep and constantly evolving field, so it'd be impossible to address every possible security risk. Instead, let's have a look at some of the security challenges and opportunities that are unique to a RAG system.

The main focus here will be on securing the information in your knowledge base. A common reason you choose to build a RAG system in the first place is because you have **private** or **proprietary** information. That information has intentionally been kept off the open web where an LLM is much more likely to have been trained on it. Even after you've built a RAG system, you likely still want to keep that data **private**.

### Knowledge base leakage

One is that a user could just request it directly from the prompt they submit. A well-worded prompt could convince an LLM to directly quote information in the retrieved chunks from your knowledge base. Even with safeguards in place, it's a reasonable assumption that users of your application can at least indirectly access the contents of your knowledge base. There's a couple of straightforward solutions here. One is authenticating users in a manner appropriate to the information they're allowed to access. For example, if your knowledge base contains private company data, ensuring only logged in employees can prompt your RAG system is a good start.

### Data tenant separation

A second important approach is to ensure that data is split across multiple tenants based on role-based access or RBAC privileges. In other words, if a user prompt leads to a retrieval from a vector database, the user should theoretically only have access to documents based on their role and access levels. 

While in theory, you could keep all documents in a single tenant and use metadata filters to determine which documents a user should have access to, in practice, this technique **is too prone to failure**. Metadata filtering is best used for personalization, but not security. For security, having multiple separately stored tenants is a much more reliable approach.

### LLM Data Leakage

Another way knowledge base data could theoretically leak is if prompts are being sent to an LLM provider to generate completions. The augmented prompts you're sending will contain documents or chunks of retrieved text from your knowledge base, and at that point, you lose control of security. 

Depending on the security level of the information in your knowledge base, this may not be a tolerable risk. Luckily, in these instances, you can choose to run a RAG system entirely locally on-premises. This means hosting the LLM and the vector database on your own hardware. While this may introduce additional complexity and cost overhead to your project, you also now have control of the contents of your knowledge base across the entire RAG pipeline. If you both want to deploy a RAG system and need to ensure a high level of security for your knowledge base, this step of moving the entire system on-prem might be worth it.

When you run RAG with a cloud-hosted LLM (like OpenAI, Anthropic, Azure OpenAI), **the prompt you send includes pieces of your private documents**. At that point, those document chunks **leave your controlled environment** and are transmitted to an external API provider. Even if the provider promises not to store or train on your data, the data is still:

* **Leaving your network**  
* **Traversing the public internet**  
* **Processed by infrastructure you don’t own or fully control**

This is the *risk boundary*. The sensitive knowledge base is now inside someone else’s system.

### Database Hacking Risk (Vector Store)

Yet another way your knowledge base might be compromised is that it's simply directly hacked just as is possible with any traditional database. One way traditional databases defend against unauthorized access is by encrypting their content. 

This means that even if a hacker gets access to the database, they can't readily access the encrypted information. Vector databases present some unique challenges for this attack vector. In order for an ANN algorithm to operate, at least the dense vector representations of your documents need to be stored in memory in a decrypted manner. The text of the chunks themselves could be stored and retrieved in an encrypted manner, and then later decrypted to build the augmented prompt. Some vector database providers now provide this service, or you could choose to encrypt and decrypt chunks yourself. This adds additional complexity and possibly some latency to your system, but offers an additional level of security.

### Reconstructing vector data hacking (on-going research)

Those dense vectors that need to remain unencrypted unfortunately can still pose some security risks.   
Recent research has shown the possibility of reconstructing the original text from its dense vector representations. 

In other words, if you encrypt your chunks, it's possible a hacker could still reconstruct them from the unencrypted dense vectors. Some techniques are currently being explored to address the security concern, like adding noise to dense vectors, applying transformations to them, or reducing dimensionality in a way that preserves distances while obscuring semantic meaning. Each of these techniques adds complexity to your retriever, however, and tends to reduce system performance. The somewhat unique potential security vulnerability of vector databases is a subject of ongoing research, but is worth being aware of. This attack requires a hacker to both get direct access to your database and use experimental techniques to reconstruct text from dense vectors, but is a possible security concern.

### Closure

This is just a quick look at security for your RAG system, but hopefully helps highlight the concerns that are unique to RAG.   
The primary takeaway here should be to remember that your knowledge base likely contains some private information, and that you should understand and control how that information is accessed. Pairing the techniques in this video with a broader set of cybersecurity precautions should help improve the security of your production RAG system.
## Multimodal RAG

Throughout this course, you've seen RAG systems built on top of text data, but these days, information is stored in a huge variety of formats. Slide decks, PDFs, or images also include valuable information that you'd ideally like to include in your knowledge base and make available to your LLM. Thanks to cutting-edge developments on multimodal models, it's increasingly possible to build RAG systems that handle a wide variety of data types. Let's have a look at how they work. 

A multimodal model is one that is designed to handle multiple data types. The most common pairing is text and images, but audio and video are also possible. A typical multimodal RAG system is one that can accept both text and images as prompts, stores both text and image files in the knowledge base, and ultimately generates text responses.   
In order to power these new capabilities, both the retriever and the LLM need to be updated to have multimodal capabilities. Let's look at how each component needs to be changed. 
### Multi-modal embedding-model

The first component that needs to be made multimodal is the embedding model used by the vector database. A multimodal embedding model is one that can embed multiple formats of data into the same vector space. If you use this kind of model to embed both the words dog and puppy, you would expect their vectors to be fairly close to one another, as with a text-only embedding model. If you give this same model an image of a dog, however, that image's vector would also end up in a nearby part of the vector space. If you embedded an image of a tree and the word tree, those two objects would also be embedded close to one another, but in a different part of the vector space.   
In other words, multimodal embedding models work just like text embedding models, placing items with similar meanings closer together. Thanks to their design, however, they can perform this same function with multiple types or modalities of data. 

Once you have a multimodal embedding model, vector-based retrieval works in a very familiar way. Both images and text from your knowledge base can be embedded into the same vector space. When a prompt is received, that same multimodal model is used to embed the prompt, whether it's an image or text. Then vector search is completed as normal, returning the images or documents whose vectors are closest to the prompt vector. The text and images retrieved from the knowledge base can then be added to the augmented prompt as normal and sent along to the language model. 

### Multi-modal model
In order for a language model to process both text and images, you'll need to use a language vision model. This kind of model works very similarly to a text-only LLM, but has the ability to process images that have also been tokenized. In order to do that, the images must be tokenized. A typical process for tokenizing an image is to break the image into separate patches which are each represented as a token. Depending on their resolution, images might be represented somewhere on the order of 100 tokens on the lower end to approaching 1000 tokens on the higher end. What matters here, though, isn't so much how many tokens are used, but rather the fact that these models are designed so that both images and text can be converted into a token sequence just as with text-only models. Language vision models then work very similarly to standard LLMs, passing this multimodal token sequence through a transformer that can develop a nuanced understanding of both the text and images in the prompt and their relationships.   
The model then typically will produce text tokens as output, responding to the initial prompt. 

### Treat PDF as images?

Once you have a multimodal embedding model and a language vision model, upgrading your RAG system to store both images and text in the knowledge base is pretty straightforward. The high-level architecture is essentially identical, but it can now handle both text and images. The nice thing about updating a RAG system to handle images is that this enables your system to ingest many common file formats that are readily converted to images. Slides and PDFs, for example, are easily treated as image files. 

A challenge with these formats, however, is just how information-dense slides and PDFs can be. A single page or slide can contain text, charts, captions, and images.   
A single vector would struggle to capture all the **nuance** on one page of a PDF. In other words, you need to chunk your images just like you would chunk your text. Initially, this was done with fairly sophisticated techniques to detect different portions of a PDF page. These algorithms attempt to determine which piece of the page is a chart, which is an image, which is text, and so forth. In practice, however, these techniques are still pretty error-prone and finicky. 

### New approach \- PDF RAG

A newer approach, called PDF RAG, just splits every page into a grid of squares without worrying about whether those boundaries fall at sensible locations. Each square is then embedded into a dense vector by a multimodal embedding model.   
This means your page is represented by, say, a **thousand vectors** instead of one. Vector search then works very similarly to Colbert. Each word in the prompt looks for its best-matching square on a given page. These scores are then added up to score the overall page of the document. 

This approach is very flexible since any image can be split up into a grid of squares. In practice, it also performs well at retrieval tasks. The fact that this approach is so flexible and performs well means it's a promising direction for powering multimodal retrieval. 

Its main downside is that it requires your vector database to store a massive number of vectors. Nevertheless, vector database providers are increasingly implementing tools to enable this kind of multimodal retrieval, and you should expect it to continue to get easier to build RAG systems around multimodal knowledge bases.

### Closure

Multimodal RAG is still a cutting-edge technology with rapid and active developments. Most LLM providers offer a language vision model, while multimodal embedding models are relatively more experimental offerings. That said, as you look to push the frontier of what your RAG system can do, expect to see exciting and ongoing progress in the world of multimodal RAG.
## Conclusion

- In this module, you learned all about managing your RAG system once it's in a production environment. Compared to the prototyping phase of a project, production adds new challenges ranging from higher traffic to unpredictable errors, and of course, higher consequences for mistakes. This is why a well-designed evaluation system is so important. It enables you to ensure your system is running smoothly and trace down problems when they arise.  You saw how a balance between component level and end-to-end evals, as well as a mixture of classic software performance and RAG-specific quality metrics, ensures you have a comprehensive picture of how well your system is handling real-world traffic.  
- Another part of operating a production system is managing trade-offs. Usually, you can't simply optimize your system for response quality, but need to keep system costs under a budget or system latency inside a target range. Having some strategies in mind for tackling both trade-offs, as well as a good evaluation system to track the impacts of your changes, will help you pick the right balance of system settings to fit your project.   
- Finally, you explored some unique security challenges for a RAG system, and explored the ways multimodal RAG is pushing the limits of what RAG systems are able to accomplish. 