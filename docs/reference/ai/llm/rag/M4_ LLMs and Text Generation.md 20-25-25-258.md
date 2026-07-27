
---
title: "Module 4: LLMs and Text Generation"
unlisted: true
---

The Retriever is a critical part of your RAG system, but the LLM is the real brains of the operation. The Retriever can find and prepare useful information, but at the end of the day, it's the LLM that needs to actually use that information to generate a high-quality response. In this module, you'll learn all about large language models, how they work, as well as specific techniques that you can use to improve their performance within a RAG system. You'll dive deep on the transformer architecture that LLMs are built on, learn how to construct LLM calls and code, and then iteratively add to that basic workflow to ensure the LLM provides high-quality responses that are grounded in the information provided by the Retriever. You'll see some advanced techniques that push the limits of LLM performance, but also get practical advice for what approaches tend to work for a typical RAG project.

## Transformer architecture

Let’s say there is an example of: The brown dog sat next to the red fox  
The first thing that happens is your prompt is split into tokens.   
Once the text is tokenized, each token is assigned an initial dense vector representation. This vector is basically a first guess of the meaning of that token. These guesses are static, so every time you feed an LLM the same token, it'll be assigned the same first guess vector. Next, each token is given a positional vector that captures where it's located in the prompt. Once these first guess embedding vectors and positional vectors have been created, they're sent along for processing.   
The tokens now enter the attention mechanism of the transformer. Each token essentially looks at every other token in the prompt and can see both their meaning and their position.   
Each token then decides which other tokens it should pay the most attention to. **Attention is basically a fancy way of saying which other tokens should have the biggest impact on my meaning.** 

In a sentence, the brown dog sat next to the red fox, the word dog would probably pay the most attention to brown and sat, since those words directly relate to the dog. You can think of dog as assigning 70% of its attention to brown, 20% to sat, and the remaining 10% distributed across all the other tokens. 

The mechanism used to assign this attention is called an attention head. And most models actually include many attention heads that specialize in different types of relationships between words. You can think of this as one attention head that specializes in relationships between objects and their descriptions.   
So the word fox might focus all of its attention on brown. Another attention head might instead specialize in spatial relationships between objects. And so in that head, fox might pay much more attention to sat and next. In reality, the relationships captured by each attention head are not a neat set of relationships assigned by humans, but are rather a complex and abstract set of relationships learned during the model's training. Smaller models might use 8 to 16 attention heads, but larger ones might use over 100\. The reason this is important is that not only is every token tracking its relationship to every other token in the text, but they're doing so many different times over, each time with a slightly different point of view or focus. The result is the attention mechanism develops a very detailed representation of the relationships between all the tokens in the text. 

Once every token has assigned all its attention scores, the information enters the feedforward phase. This is by far the biggest part of the LLM, meaning it contains by far the most parameters. Based on each token's **original embedding, position, and attention**, it assigns updated vector embeddings for each token. These new vectors are basically a second guess of each token's true meaning, but now informed by the context of the other tokens in the text. Most LLMs then repeat this entire process. The second guess vectors are fed back into the attention and feedforward mechanism, generating new and more refined third guess vectors of each token's meaning. A typical LLM might actually pass these vectors through these layers somewhere between 8 to 64 times, gradually refining its understanding at each stage. 

Now the LLM is ready to start generating. Based on the highly refined vector embeddings it generated, the model asks, based on my training data, what tokens are likely to come next? This is calculated as a probability distribution across all tokens in the model's vocabulary. Typically, a handful of tokens have a high probability of appearing next. But if your model recognizes 100,000 tokens, each one is assigned a probability even if the vast majority are essentially zero. Finally, the LLM picks one token from this distribution, weighting the choice by every token's assigned probability. Multiple tokens are chosen more often, but in theory, any token has at least a tiny chance of being picked.   
You'll learn more about how to adjust these probabilities and so how the LLM chooses new tokens later in this module. The chosen token is appended to the end of the prompt, and after all that work, the LLM has generated **one more token**. If you want to generate a second token, the model has to repeat the entire process, only this time considering both the original tokens and the one it added on. This ensures new tokens make sense in the context of both the original tokens and the ones it generated. This means early random token choices will influence which token is chosen later on as well. 

To generate a full completion, the model does this process over and over again until it either reaches a token limit you've set for that completion, or it chooses to generate a special end of completion token indicating that it's done. The tokens that the LLM generated might complete a phrase or an answer to a question, but whatever their purpose, they can be de-tokenized into plain text and returned to the user. 

Let's look at how parts of this transformer architecture motivate many elements of the design of a RAG system. First, it helps to motivate why RAG works in the first place. LLMs are able to deeply understand the meaning and relevance of the information added to the prompt. This is thanks to the processing done by the attention mechanism and the world knowledge contained in the feedforward layers. Second, it highlights that LLMs are still inherently random. Even if you inject meaningful information in your prompt, LLMs may randomly choose not to generate text based on that information.   
Controlling this randomness and confirming your LLM grounds its answers in retrieved information is still necessary and important. Third, it just highlights how computationally expensive an LLM is. Generating a single token takes a lot of processing, and that cost actually grows as the length of the prompt or completion does. After all, each token needs to look at every other one to fully understand its own meaning. As you'll explore later, most costs from running a RAG system come from running these powerful but expensive transformer models. That's a good summary of how LLMs work under the hood.

## LLM sampling strategies

A big part of working with an LLM is understanding and controlling the randomness at the heart of how they operate. In this video, let's have a look at a typical LLM API and explore the different options they provide to control the way your LLM chooses the next tokens. Every token a large language model adds to your completion is a weighted random choice. If you use an open source large language model, you can see how this choice was made. These models will let you see the token probabilities generated at each step, which was used to select the next token. For example, for the prompt, the sky is, this is what the probability distribution looks like. Blue has a 50% probability of coming next, bright has a 25% probability, and every other token has 10% or less, quickly shrinking to less than 1%.   
Here is what that distribution looks like visually. When the curve has a tall spike on the left side, you could say the model was confident in its choice, with only one or possibly a few other tokens having any real chance of being chosen. 

A flatter distribution like this, on the other hand, can be interpreted as uncertainty. The model has many possible directions it could take the completion next, with no clear winner. Decoding and controlling this distribution curve is a big part of how you tune your LLM's behavior.   
 So let's look at a few strategies to do this. One simple approach is to instruct the LLM to not actually make a random choice, and just always pick the token with the highest probability.   
This is known as greedy decoding. 

### Greedy decoding

This is known as greedy decoding. Greedy decoding's main upside is that it makes the LLM deterministic. If you feed your model the same prompt, it will always generate the same response. The primary downside of greedy decoding is that it can lead to text that is, well, predictable. The pros can end up feeling generic or even stilted. Another issue with greedy decoding is that the LLM will sometimes get stuck producing the same sequence of words over and over again. The LLM doesn't actually care if the overall completion makes sense.   
The LLM just keeps choosing the highest likelihood next token, and once the model falls into a repetitive loop, there's no mechanism to break out of it. Despite these potential shortcomings, greedy decoding can make sense in instances where highly predictable and deterministic output is desirable, like code completion or even as a temporary setting to debug your system. In most instances, you don't want to entirely eliminate randomness. You just want to control it. The most widely used parameter to control an LLM's randomness is called temperature.

### Temperature

You can think of temperature like a dial that changes the shape of the probability distribution generated by your LLM. A default temperature of 1 just gives you the original distribution.   
A lower temperature leads to a more spiky distribution, with only the most likely tokens having any chance of being generated. The ordering of the tokens doesn't change, but their probabilities of being chosen do. Setting temperature all the way down to 0 sets the model to perform greedy decoding, with only the single most probable token having 100% probability. Turning the temperature up a bit, say in the range of 1.1 to 1.3, will flatten out the probability distribution, giving unlikely tokens a bit more chance of being chosen. This leads to more variety and sometimes more interesting or even creative sounding text. Setting the temperature too high will result in a very flat probability distribution. All tokens will have about an equal chance of being chosen, even if they don't make that much sense. 

### Advanced sampling technique 

Whatever temperature you set your LLM to, that distribution curve will still have a long tail running out to the right. Full of nonsense tokens, your LLM has a small likelihood of choosing. To help control this, a few additional sampling techniques are used. Top k sampling is the most simple, and limits the LLM to choosing from the top k most likely tokens. For example, you might both set a temperature of 1.1, but also limit the LLM to choosing from the top 5 most likely next tokens. 

A similar approach is called top p sampling, which limits the LLM to choosing tokens with cumulative probability falling below some threshold. For example, you might set a top p of 85%.   
You would start from the left side of this distribution, and keep adding the probabilities of each token until the total is greater than 85%. 

- Top p tends to be the more responsive or dynamic of the two approaches.   
- In top k, the LLM always picks from the same pool of tokens, regardless of the shape of the distribution. 

With top p, if the LLM is fairly certain, meaning a few tokens have a very high probability, the LLM will limit its choices to the few most likely tokens. If instead, the LLM is more uncertain, meaning the distribution is flat, with no clear best choice, the LLM is allowed to choose from a much larger pool of potential tokens.

### Token specific strategy

Some techniques also target the probabilities of individual words, rather than the overall shape of the distribution. For example, large language models can have a tendency to repeatedly use the same word or phrase, which can sound unnatural. 

Many LLMs allow you to apply a repetition penalty, which decreases the probabilities of words that have already appeared in the completion. This can make the resulting text sound more natural and varied. 

Most LLMs also allow you to increase or decrease the probability of specific tokens, usually called logit biasing. This bias will permanently adjust those tokens' probability of being chosen up or down. 

If you know you don't want your RAG system to generate profanity, you could bias certain words down. On the other hand, if your RAG system is a classifier designed to output one of a few categories, you could boost the probabilities of those categories to ensure the LLM always chooses from between them.

Here's an API call combining many of the techniques you've seen in this video.   
This is a fairly sensible, general-purpose combination of parameters, a temperature of 0.8, a top p of 0.9, and a repetition penalty of 1.2. This LLM will be a little more conservative in its token choice, avoids choosing from the far tail of the distribution, and lightly penalizes repeated tokens. By experimenting with each parameter, you could dial in the LLM's behavior for the context of your application.

If you're generating code or answering factual questions, a lower temperature and a lower top p make sense. If you're operating in a more creative domain, a higher temperature and top p could give your LLM a more interesting and exploratory tone.

## Choosing your LLM

### Important LLM model Characteristics

A major decision when building a RAG application is which LLM you'll use. There's a huge variety of LLMs available with different levels of performance, unique capabilities, and different cost profiles. Choosing the right one can have a big impact on your application's speed, quality, and budget. So let's have a look at how you can make the choice that best fits your project. Let's start with some easily quantifiable differences between LLMs. Model size is a frequently quoted metric, usually measured by how many billions of parameters the model has. Small models may have between 1 and 10 billion parameters, while larger models have 100 to 500 billion, and possibly more.   
Larger models are typically, but not always, more capable than their smaller counterparts, but they're always more expensive to run. Cost is of course an important factor. LLM providers typically charge you for a fixed price per million tokens, sometimes with different prices for input and output tokens. You can generally expect newer, larger, and more capable models to cost more. The context window of a model tells you the maximum number of tokens an LLM can process, split between both the prompt and the completion. While large limits offer more flexibility to have long prompts and completions, you still pay per token. The time to first token, and speed, as expressed in tokens per second, is another important factor.   
If your RAG system depends on real-time interactions, you might be willing to tolerate worse performance in other areas for a fast and low-latency model. The training cutoff date, or knowledge cutoff date of a model, tells you the last point in time represented in a model's training data. Even in a RAG system, a later cutoff is typically considered preferable, especially in contexts where a model will need to respond to questions on recent events.

### Quality metrics

While easily quantifiable metrics might help narrow down which models you consider, usually you care most about the quality of a model, which can be a lot harder to quantify. Quality here means everything from an LLM's ability to reason through complex math problems, to simply producing text that's pleasant to read. To help compare models across all these different dimensions of quality, there is a dizzying array of LLM benchmarks available that try to score and compare LLMs. There's no single authoritative list of benchmarks that you can turn to, but understanding the variety of options available can help you choose the benchmark that makes the most sense for your project. 

Benchmarks come in three high-level varieties,   
automated benchmarks,   
human scoring,   
and LLM as a judge.

#### Automated benchmarks

Automated benchmarks score LLMs on tasks that can be assessed with code. A classic format for this kind of benchmark might be a multiple choice test on a particular field of interest, or a series of mathematical or coding challenges where the LLM's responses can be easily validated by a computer. A good example benchmark here is **MMLU**, or Massive Multitask Language Understanding, which covers 57 subjects ranging from STEM to humanities to law using multiple choice tests. Computer benchmarks test LLMs on everything from math problems to common sense reasoning questions. You'll frequently see LLM providers market their model's performance on these benchmarks and can likely find the one that is relevant to your project. 

#### Human-evaluated benchmarks

Human-evaluated benchmarks typically work by having two anonymous LLMs respond to the same prompt and asking human evaluators to choose which response they prefer.   
These results are fed to the same Elo algorithm used to rank chess players, resulting in a comparative leaderboard of LLMs. A popular host of this type of rating system is called **LLM Arena**, whose rankings are one of the most widely cited LLM benchmarks. These human-graded rankings capture nuanced quality factors that automated benchmarks can't easily measure. While automated and human-graded metrics will often agree, when their scores diverge, it can highlight important nuances in model performance.

#### LLM-as-a-judge

LM-as-a-judge benchmarks use one LLM to rate another LLM's responses to a collection of test questions. The judge LLM has access to a set of reference answers and essentially just determines how often the LLM being evaluated provides an answer that is close to the correct one. This gives you a win rate that can be used to compare one LLM versus another.   
LLM-as-a-judge's primary upside is that it's a relatively cheap and flexible way to evaluate LLMs. One downside of this approach is that the judge needs to be carefully calibrated because they have a tendency to prefer answers from their own family of language models. For example, GPT models from OpenAI will prefer other GPT models. Gemini models from Google will prefer other Gemini models. By recalibrating these off-the-shelf models, it's possible to diminish this bias.


### What is a good Benchmark?

Good benchmarks have a few qualities. First, they're relevant to your project.   
If your application won't ever generate code, comparing LLMs on a code generation benchmark isn't much help. Next, benchmarks need to be difficult to do a good job differentiating between high and low-performing models. If every model scores well on a benchmark, it's just not that useful. Benchmarks should be reproducible, meaning the scores themselves don't change drastically between testing runs, and the outcomes quoted by the model providers should be verifiable. Benchmarks should also align with real-world performance. An LLM that does well on a programming benchmark should actually write good code in practice. Here, you may need to do some reading on developer forums to ensure benchmark scores are a good indication of actual performance.   
A reason this problem can arise is data contamination. Large language models are trained on billions, if not trillions of tokens scraped from the internet. It's possible that the dataset used by the benchmark are included in that training data. In this case, the language model might overperform on that benchmark because it's already seen the exact questions and answers during its training.

### Benchmarks over time

While benchmarks can help you differentiate between models, they also just highlight how rapidly the field as a whole is evolving. Here is the general pattern you'll see repeated for most LLM evals. At first, the average score for each is quite low.   
Then, over only a few years, it becomes commonplace for models to perform on par with human experts. These benchmarks are called saturated, meaning they no longer help differentiate between models, as almost all advanced models score near the maximum. At that point, new and more challenging benchmarks need to be introduced to meaningfully measure improvement in performance. Those new evals will quickly become saturated themselves, however, and even newer ones will need to be introduced. 

The main takeaway here is that models released today are usually significantly better than models from even a couple of years ago, and that any model you choose today likely will need to be replaced as more capable models are rapidly introduced. 

Choosing the right LLM is an important but temporary decision for how you design your RAG system. Easily quantifiable factors like cost or latency can help narrow down your choice, and a wide variety of quality metrics can point you towards the best models to align with your use case. 

Because of the speed at which models are improving, you should plan on eventually swapping in newly released models that suit your RAG system.
## Prompt engineering: building your augmented prompt

In order to get the most out of your large language model, you'll need to write a high-quality prompt. Prompt engineering is an umbrella term for a variety of prompting techniques that tend to lead to higher quality results. Let's explore a few prompt engineering techniques and talk about how they can be used to improve the overall performance of your RAG system.

To start, it's helpful to understand how you'll actually build out prompts in code. The most common format is OpenAI's messages format, which structures prompts as a series of messages using a simple JSON structure. A single message will have content, which is just the text of the message, as well as a role, which will either be system, user, or assistant. System messages are provided to the LLM to influence its overall behavior and usually include high-level instructions.   
User messages record prompts that a user of the system has already sent. Assistant messages record responses previously generated by the LLM.

When you have an extended back-and-forth conversation with an LLM, also called a multi-turn conversation, it's not actually remembering what you said earlier. Instead, behind the scenes, the entire conversation is converted into this messages format, with your new user message appearing at the end. And then, the entire conversation is submitted to the LLM with every new user prompt. The JSON messages object is then turned into a single text string that can be processed by the LLM. This chat template string uses special text tags, like arrows or vertical bars, to indicate the start and end of each message.   
LLMs are trained to recognize these tags and understand the difference between system, user, and assistant messages. This format is very flexible and allows you to add a wide variety of context to your prompts to help control how your LLM responds.

### System prompt

Let's look at a few ways you can use it. The first thing you'll want to do when constructing a prompt for your RAG system is write your system prompt. This provides your LLM high-level instructions on how it should behave. If you always want your LLM to speak in a particular tone or follow certain procedures, a system prompt is **where that information should go**. To get some ideas of what can go into a system prompt, have a look at this system prompt from a popular LLM chatbot. 

The first thing that jumps out at you is the length. It's huge. You might not always need to write multiple-page system prompts, but knowing you have the flexibility to do so is a good reminder. Early in the prompt, there's information on the knowledge cutoff of the model's training data, as well as the current date. Information like this helps the LLM determine how out-of-date its information is and whether it's in a good position to answer certain questions. Later sections direct the LLM on the process and tone it should use to respond to the prompt. For example, it asks the model to reason through answers step-by-step, not help with potentially harmful requests, and respond in markdown.   
The LLM is also told that it is intellectually curious and enjoys hearing what humans think on an issue and engaging in discussion on a wide variety of topics, which gives the LLM a particular personality, so to speak.

You could use these same principles to construct your own system prompt. For example, you could instruct your LLM to respond in great detail or answer questions succinctly. Given you're constructing a system prompt for a RAG application, you could tell the language model to use only the retrieved documents to answer prompts, or judge whether a document is relevant, or cite sources in its response. System prompts are usually added to every prompt your LLM will process, so spending time refining them is a great way to improve the style and quality of the results your RAG system ultimately generates.

### Prompt template

At this point, you're ready to build your augmented prompt. This prompt potentially includes many pieces of information, so it's helpful to build a well-considered prompt template.   
A template sets out the high-level structure of your prompt and helps decide where certain pieces of content will be injected. For example, you might always start with a high-level system prompt that provides high-level guidance to the system about how it should behave. If your system supports multi-turn conversations, you can include previous messages sent between the user and the LLM. Next, you might add the top 5 or top 10 chunks retrieved by your retriever, as well as any information about how to process them. Finally, you can include the most recent user prompt the LLM should respond to. 

Here's what a prompt constructed from this template could look like. The nice thing about using a template like this is that it makes it easy to experiment with different prompt structures.   
You can modify individual components of the overall prompt and see how that impacts the final generated response.

### Example: messages-based augmented prompt (rag-4)

```python
messages = [
	{"role": "system", "content": system_prompt},
	*chat_history,
	{
		"role": "user",
		"content": f"Question: {query}\n\nRetrieved context:\n{retrieved_context}",
	},
]
```

### Closure

This is what it looks like to construct a typical prompt in a RAG system, combining a well-written system prompt, retrieved context, previous conversation details, and of course, the most recent user prompt. Join me in the next video and let's look at some advanced techniques to further improve how the LLM performs.

## Prompt engineering: advanced techniques

### Context Learning

Once you have a basic prompt template set up for your RAG system, you can start trying more advanced prompt engineering techniques. Let's have a look at a few of those and when you'd want to use them. In-context learning is a technique which allows you to help the LLM learn what kind of output you wanted to generate by adding examples of them to the prompt. For example, if you're building a customer service chatbot, your prompt can include examples of previous customer requests, as well as high-quality responses to those requests. These examples help the LLM learn the structure and tone it should use when it generates new responses. Just like in RAG, you're adding additional information to the prompt to ground the way the LLM responds. If you include many examples, this approach is called few-shot learning.   
If you include just one example, it's called one-shot learning. There's a few ways to implement in-context learning. You can just hard-code one or more example questions and responses into your prompt. In situations where you want a stable set of LLM behaviors, this alone could help improve response quality. If you want to change up the examples each time, however, you can use RAG to retrieve example questions and responses from your knowledge base.

For example, if you're working on that same customer service chatbot, you could index successful customer chats into your vector database. When a new customer writes in about a particular topic, you can retrieve the text of previous conversations about that topic and inject that text into your prompt.   
In many ways, this is just normal RAG. But the fact that you're specifically retrieving example responses can help further improve the quality of the LLM's response.

### Example: sampling controls for response style (rag-4)

```python
kwargs = generate_params_dict(
	query,
	temperature=0.5,
	top_p=0.5,
)

response = llm.generate(**kwargs)
```

### Encouraging reasoning

Another powerful collection of prompt engineering techniques, essentially encourages the LLM to reason through prompts in a step-by-step manner. For example, you can tell the LLM to first think aloud or think step-by-step, about the best way to approach the problem before actually providing a final answer. The idea is you're essentially giving the language model a scratchpad to organize its thoughts before answering. A common way to do this is to tell the LLM that tokens between scratchpad tags are considered a space for thinking and brainstorming and not part of its final answer.
### Chain of thoughts

A similar approach is called chain of thought prompting.   
In this approach, the LLM is instructed to tackle questions in a step-by-step manner, rather than immediately answering them. The LLM might be instructed to first generate the steps needed to answer a question and then follow those steps. Encouraging the LLM to plan and take this incremental approach can increase the likelihood that the final responses are more accurate. Since the LLM will show its work, so to speak, it's also easier to trace down issues when the LLM's reasoning falls apart. 

### Example: explicit reasoning instruction in prompt (rag-4)

```python
reasoning_prompt = """
Answer using only retrieved context.
First, reason step by step in short bullets.
Then provide a concise final answer.
"""

messages = [
	{"role": "system", "content": reasoning_prompt},
	{"role": "user", "content": query_with_context},
]
```

Reasoning-oriented strategies like these have been so successful that many LLMs are now designed to be reasoning models right out of the box. Reasoning models excel at complex reasoning tasks, such as coding, mathematics, planning, puzzles, and complex workflows that require multiple steps. 

Under the hood, these reasoning models first generate reasoning tokens where they might plan ahead and consider options, much like the scratchpad you saw before.   
Then they output response tokens with the intended final response to the user. Some providers of reasoning models will only provide access to those final response tokens. Others allow you to access the reasoning tokens as well. These reasoning tokens are part of what makes these models more accurate than their non-reasoning counterparts. But they're still just regular tokens with all the associated costs of generating them. As a result, reasoning models are typically slower and more expensive to run. Depending on your context, building a RAG system around a reasoning model may be well worth the higher costs of each LLM call.   
For example, reasoning models can be particularly good at assessing the relevance of the retrieved document and can be more skilled at deciding how best to incorporate that information into a response, especially one that requires more complex reasoning steps.

### Reasoning model guidance

Interestingly, many prompt engineering techniques don't work as well with reasoning models. For example, you don't need to ask them to think step by step, as this is something they've already been trained to do. They also may not do well with in-context learning, as they try to incorporate the provided example responses into the current question being answered. They tend to perform better with specific goals that you want them to work towards and very specific information about the format that you want them to answer in. You can still provide high-level guiding principles and explicitly state approaches you want the model to take or avoid. After that, however, you can just give them the entire context dump of documents retrieved from your RAG system.   
New models, including reasoning models, are constantly being released, however, and most LLM providers will include information about how best to prompt them.

### Context management
As you start employing more prompt engineering techniques, context window management will become important. Remember, the initial prompt and whatever tokens an LLM generates for the completion both use up portions of its context window. Whether you're injecting documents from your retriever, adding in-context learning examples to every prompt, or having a reasoning model plan its responses before answering a question, all of these advanced techniques increase the length of your prompt, the generated response, or both. It's easy to rapidly fill up your context window if you're not paying attention.

#### Single-turn

With single-turn conversations, the best fix is to just validate you're getting value from your prompt engineering technique. If chain-of-thought prompting or in-context learning isn't giving you better performance, it's better to just remove those components from your system.

#### Multi-turn

In multi-turn conversations, keep only the history that is still relevant to the current question, and avoid carrying stale retrieved chunks from earlier turns.

If you're using a reasoning model in a multi-turn conversation, you'll almost certainly want to drop reasoning tokens from the chat history and just keep the response tokens. Likewise, in a RAG system, you usually only want to include the chunks retrieved to support the response to the most recent question, not every question that came before it.   
Of course, if your application needs multi-turn conversations with deep and rich context, you can always switch to using a model with a longer context window. That said, you'll still want to be thoughtful about how you design prompts as even on models with longer context windows, long prompts are slow and expensive to run.

#### Closure

Prompt engineering techniques can improve the performance of your LLM, but your RAG system doesn't necessarily need to employ them. A simple prompt template and a well-written system prompt might be all you need for your project. When it comes to more advanced techniques, I advise you add them to your project only after it's clear you need them. Prompting in general can be more of an art than a science. So whatever strategies you use, experiment with different prompts and find the ones that work best for your system.
## Handling Hallucinations

Hallucinations are a constant concern when working with LLMs, and even a well-designed RAG system can still hallucinate. Detecting hallucinations, reducing them, and ensuring the LLM accurately cites sources are therefore central tasks in a production-ready RAG pipeline. Let's look at practical ways to handle this.

### Example

Imagine you get your first RAG system up and running, a customer service chatbot for an online store. A user writes in and asks if the company offers student discounts. The retriever finds information about discounts for both seniors and new customers, both of whom would receive 10 percent off. Meanwhile, the LLM system prompt encourages it to be helpful with customers.   
All of these factors influence the LLM which responds, absolutely, you can get 10 percent off with a valid student ID, the same great discount we offer our seniors and new customers. The user is delighted and continue shopping on your site, eager to claim their discount at checkout. The only problem, that student discount doesn't actually exist. The LLM just made it up.

The LLM just made it up. It's important to remember why LLMs hallucinate in the first place. A language model is designed to produce probable text sequences, with a bit of randomization thrown in for variety. Probable text sequences are often factually accurate, but not always.   
Language models aren't designed to differentiate between true and false, just probable and improbable. Hallucinations are problematic for a few reasons.

**It's important to remember why LLMs hallucinate in the first place.** 

- A language model is designed to produce probable text sequences, with a bit of randomization thrown in for variety. Probable text sequences are often factually accurate, but not always.   
- Language models aren't designed to differentiate between true and false, just probable and improbable.

Hallucinations are problematic for a few reasons. The first is obvious enough. You just don't want your language model to provide inaccurate information to your user. The second is that almost by definition, hallucinations sound plausible, and so can be more difficult to detect than total nonsense. Finally, over time, occasional hallucinations can cause your users to lose trust in your RAG system, even if the majority of generated content is accurate. Of course, a big reason you'd build a RAG pipeline is to reduce hallucinations.   
The information you retrieve from your knowledge base can help ground an LLM's responses, and possibly provides information missing in the model's training data. Even so, RAG systems are still prone to hallucination, so additional steps to prevent them are necessary.

### Hallucination types

Hallucinations can come in many types and sizes. Going back to that discount, an LLM might accurately describe the very real senior discount and how to claim it, but misstate the discount as 5% instead of 10%. In more extreme cases, the LLM might inaccurately state there isn't a senior discount when actually one exists. Or, as you saw earlier, invent entirely new discounts your company doesn't offer. This means you'll need to evaluate the text your LLM generates on many levels if you want to feel confident in its accuracy. 

#### Very important 

Now here comes the cold, hard truth. There's no perfect solution for hallucinations, or at least not currently. Luckily, however, RAG is one of the best approaches currently available, and there's ways you can refine RAG systems to further decrease the frequency of hallucinations.

#### Solution - Self-consistency method

One approach, however, is self-consistency checking, where you have the model repeatedly generate completions for the same prompt and check if the factual information contained within them is consistent. The underlying idea is that if the language model is hallucinating information, it'll do so inconsistently, and factual differences across completions will be detectable.   
In practice, however, this method can be costly and unreliable.

#### Solution \- refine prompt and citation

Since inside a RAG system, you do have access to a knowledge base, the best approach to decrease hallucinations is to ensure responses are grounded in retrieved information. For example, you could modify your system prompt to say that the LLM can only make factual claims based on retrieved information.

If you want further confidence that the LLM is basing its responses on retrieved documents, you can further require the LLM to cite its sources. Sometimes, this just means prompting the model to cite sources at the end of each sentence or paragraph. This can further increase the likelihood that the LLM grounds its responses in the retrieved sources.   
And citations also make it easier for a human reader to verify claims in the response. A risk with this approach, however, is that the LLM will just hallucinate the citations. Some models fine-tuned to cite sources will generate valid citations more reliably, but if you want more confidence in your citations, you'll need to use an external system.

ContextCite 

For example, ContextCite is a system that scores how well a response is grounded in a set of source materials. The model processes the response sentence by sentence and it attributes each sentence to one of the context documents that were retrieved and provided to the LLM. ContextCite then generates tags for each sentence noting which document is the source of that sentence. In cases where the statement does not have supporting material, it's labeled no source.   
Some implementations may even provide a similarity score between the sentence and the identified source document. These tags can either be used to generate source citations in the final generated LLM output or as a part of evaluation of how frequently the LLM is grounding its responses in the documents retrieved by a RAG system.

#### Evaluating Citation Quality in LLMs

Recent efforts, such as the ALCE benchmark, aim to measure how well a system references and cites sources when generating responses. The system provides pre-assembled knowledge bases and sample questions. You would then use your RAG system on these prompts to ask the ALCE system to evaluate the generated response. Scores are generated for three key metrics, fluency, correctness, and citation quality. In other words, how clear is the final text?   
How factually accurate? And how well do the provided citations align with the correct sources to cite? These benchmarks don't control hallucinations in your production system, but they do give some sense of how well your system is avoiding hallucinations and citing sources.

#### Closure

Hallucination detection is a constant challenge in an LLM-based system. That said, by building a RAG system, you're already taking the single most effective step to minimize hallucinations. After that, focus your energy on ensuring the LLM grounds its answers and retrieved information by refining your system prompt. Finally, test your system using hallucination-focused benchmarks to ensure your system is providing grounded, well-cited responses.   
Together, these approaches can significantly reduce hallucinations and help you build a system that provides trustworthy responses.

## Evaluating your LLM’s performance

Whether you've just built your first proof-of-concept RAG system, or are iterating on a system already in production, you'll want to know how well your LLM is performing. Whether you're considering adjusting your model's temperature, updating your system prompt, or even swapping in an entirely new model. In order to make an informed decision, you'll need to have metrics on hand to measure each decision's impact. Let's look at some common methods for evaluating your LLM's performance. Since your LLM is operating inside of a complex system, to start, it's important to be clear on what specific tasks your LLM is responsible for. 

- Your retriever's job is to find the relevant information from the knowledge base.   
- Your LLM's job is to use that information to construct a high-quality response. 

This means that when considering adjustments to your LLM, or even replacing the underlying model entirely, you want to make sure the metrics you're using focus on the LLM's role in the broader RAG pipeline. If the problem **ultimately lies with your retriever,** you don't want to waste time rewriting your system prompt. 

If you assume your retriever is operating well, then it should find mostly relevant information, perhaps with a few irrelevant documents added. The job of your LLM, then, is to respond to the user prompt, incorporate the relevant information into its response, cite it appropriately, and resist getting distracted by any irrelevant information that was retrieved. 

Note, most of these LLM-specific behaviors are somewhat subjective. How can you say quantitatively that a response does a good job of answering a user's original question, or ignoring irrelevant information? As a result, most LLM-specific metrics rely on using other LLMs to assess the quality of a response.   
Incorporating LLMs into the evaluation process allows for some degree of flexibility or subjectivity in a scalable way. A good source of these RAG-specific metrics is the open-source **Ragas** library.

### Response Relevancy

Response relevancy measures whether a response is actually relevant to a user prompt. This metric checks whether the response was relevant to the original prompt, regardless of whether it's factually accurate. Here's how it works. First, the response generated by your RAG system is fed to a new LLM that generates several sample prompts it believes could have led to that response.   
Then, both the original user prompt and these sample prompts are embedded to a semantic vector. Next, the cosine similarity between the actual user prompt and each sample prompt is calculated. Finally, these similarity scores are averaged, giving the ultimate measure of response relevancy. Note, this metric doesn't necessarily ensure the response is providing factual information, but it does check whether you can reasonably work backwards from the response the LLM gave to the prompt it was originally given.

### Faithfulness

To measure whether the LLM is actually using retrieved information, you could use the faithfulness metric. This metric uses a language model to identify all the factual claims made within the response. It then uses more language model calls to determine how many of these claims are supported by one of the pieces of information retrieved from the knowledge base.   
The percentage of the claims that are supported is the faithfulness for that particular prompt, retrieval, and response.

### Other Metrics

Other metrics included in the RAGAS library take similar approaches to assess things like sensitivity to irrelevant information retrieved from the knowledge base or ability to accurately cite sources. 

A pattern across all these metrics, however, is the reliance on LLM calls at some point in the eval process and even possibly examples of ground truth correct answers. This speaks to the fact that the role of the LLM in a RAG system is complex and difficult to evaluate with more simplistic automated metrics.

In addition to these LLM specific evals, there are ways you can use metrics that run across your entire system to evaluate LLM performance. For example, if your users can mark responses from your RAG system with a thumbs up or thumbs down rating, you can then A-B test changes to your system prompt and see what impact the change has on overall user satisfaction. The idea here is that you measure system-wide performance but isolate changes to LLM settings, allowing you to attribute changes in overall performance to changes to your LLM. 

LLM performance metrics are useful tools for deciding to adjust your LLM settings or even switch to a new model. Since the quality of an LLM's responses are somewhat subjective, you should plan on using either LLM as a judge-based evals or human feedback to assess LLM quality. A combination of these techniques will allow you to confidently evaluate how well your LLM is operating.

## Agentic RAG

As your RAG system matures, a powerful way to improve its performance is to start introducing agentic workflows. An agentic workflow means using several LLMs throughout your RAG system, each one responsible for a single step in the overall process. You've already seen this idea with LLMs used to perform tasks like query expansion, prompt rewriting, or citation generation. There's a huge array of compound systems like this you could build. So let's look into how you can further improve the quality of your RAG system by building it in an agentic way. Typically, the way you use a language model is to feed it a prompt and it spits out a response. Simple.   
In an agentic system, there's two main changes to this model. First, tasks are now treated as a series of steps and decisions, each of which can be completed by a call to a different LLM. Second, LLMs are given access to a wider array of tools like a code interpreter, web browser, or in the case of RAG, a vector database of information to reference.

### Example

Here's one possible agentic workflow for a RAG system. A user submits a prompt to the system and it is first processed by a small router LLM. This LLM's job is to determine if the prompt actually requires a call to the vector database. It's been specially tuned for this task and will only output either yes, meaning the prompt does justify retrieval from the database, or no, meaning the prompt can be answered without retrieval.   
Based on the router LLM's decision, the prompt is either sent to the vector database for retrieval or skips that step. If no retrieval is completed, the prompt is sent directly to a separate LLM to generate a response. If a retrieval step was requested, a separate evaluator LLM is used to determine if the retrieved documents are sufficient to answer the question. Based on this evaluator LLM's decision, additional retrievals from the vector database may be requested. Once sufficient information has been retrieved, an augmented prompt is constructed and given to the LLM to generate a response. At this point, a final LLM goes through this response and add citations.

### Agentic system as flowcharts

This is just one possible agentic RAG system, but it highlights a few key points that are true for any agentic system.   
First, you can think of designing an agentic system essentially as drawing a flow chart. Each LLM in the diagram is still just taking text input and generating text output, but the system is set up so that each LLM is completing one task on the prompt's journey through the RAG system. Second, you don't need to use the same LLM for each step in the workflow. The router and evaluator LLM in this agentic system could be lightweight models that are fast and cheap to run since they have a single and relatively simple task. You could then use a larger model to generate the draft response and pick a model that specializes in citation generation for that step.

### Workflow

- As you think about adding agentic workflows to your RAG application, here's a few common patterns to consider. A sequential workflow just moves output in a linear fashion through a series of LLMs. 

This might mean that every prompt sent to your system moves through an LLM-based query parser, query rewriter, and citation generator as part of the generation process. Each LLM just focuses on one step of the overall process and can therefore specialize at that step

- A conditional workflow uses an LLM to decide which of many paths a prompt should follow. You just saw a router LLM implement this workflow to decide if a retrieval is necessary to respond to a prompt. You could also use a router to determine which of several LLMs with different strengths and specializations should be used to generate a response.   
- An iterative workflow works similarly to a conditional workflow, but it routes the prompt to an earlier point in the overall system, forming a loop. For example, if your RAG system is designed to generate code that integrates with an existing code base, it's possible the system would need multiple attempts to write working code. An evaluator LLM could be used to assess each draft, perhaps with the assistance of a code interpreter and provide feedback until it deems the solution suitable.  
- Finally, you can create parallel workflows in which an orchestrator language model breaks a prompt into multiple distinct tasks and assigns each task to separate LLMs. On the other end, a synthesizer language model recombines their work. If your application is say, comparing the key insights from two research papers, you might want two different LLMs to summarize and evaluate each one and then have the orchestrator combine their findings.

#### Closure

The creative possibilities when building agentic systems are truly endless.   
There's also an important mindset shift at play here. LLMs start to look a little less like standalone solutions and more like modular pieces that fit inside a larger workflow. Suddenly, you're more than happy to use smaller models or models that only excel at a few tasks because their capabilities are well aligned with the portions of the workflow they're responsible for. Adding agentic components can give you the flexibility to build even more capable RAG systems.

## RAG vs. Fine-Tuning

While RAG is a popular and powerful approach for improving the performance of an LLM, another technique called fine-tuning is also frequently used. Rather than just augmenting the prompt, fine-tuning retrains an off-the-shelf LLM to improve performance in a specific context. Let's look more closely at fine-tuning and what role it can play in your RAG system. The core idea of fine-tuning is to retrain a language model with your own data to update its internal parameters. Typically, this is done through supervised fine-tuning, or SFT. It's supervised because the model is retrained using a labeled dataset from the domain the model is being adapted to. Instruction fine-tuning, in particular, refers to an approach in which the dataset includes both a set of instructions to the language model, typically a prompt or a question, as well as an expected ground truth best answer.   
To fine-tune the model, you feed it the input instructions and see how close the output is to the correct answers from your dataset. You then use these results to adjust the model's internal parameters to better align with the correct answer. This process is very similar to the way language models are initially trained, but the dataset used is taken from a specific domain the model is being fine-tuned to specialize in.

### Example

Suppose you want to fine-tune a model to work in the healthcare domain. To start, you would choose a general-purpose language model. If you ask this model about a specific set of symptoms, say joint pain, skin rash, sun sensitivity, the language model might give you a generic answer in a generic tone. This is because the off-the-shelf model hasn't been specialized on medical data.   
If you use instruction tuning on that same model, training it on a lot of medical domain instructions and responses, the model essentially becomes much more of an expert at answering that kind of question. Now, if you gave it that same prompt, it'd be able to respond with more accuracy, detail, and in a style that's more appropriate for the medical domain.

### When fine-tuning works well

Fine-tuning can work well in instances like this one, where you want the model to specialize in a particular domain, like providing an initial medical diagnosis or summarizing legal briefs. While the model's performance will improve in that domain, fine-tuning can actually decrease performance in other domains. The fine-tuning process is only optimizing the model's performance in the target domain, which means that sometimes adjustments made to the model's internal parameters will lead to lower performance with other kinds of requests. So long as the model will only be used within the domain it's being specialized for, however, this trade-off is usually worth it. A particular place this is true is for small models used inside agentic systems.   
If you know ahead of time a model's only job will be to determine whether a prompt requires retrieval from a vector database, you're more than happy to use a small, lightweight model and heavily fine-tune that model to only perform well at that single task. It's worth noting, fine-tuning is usually not a great way to teach an LLM new information. The way a model is adapted by fine-tuning tends to have a greater impact on how the model responds to prompts, like the words it uses, style or structure, and less pronounced impact on what information the model knows.

### Side by side comparison

This last point hits at some of the pros and cons of RAG versus fine-tuning. So let's talk about when it makes sense to use each. In short, the current consensus is that RAG is best at **knowledge injection** and fine-tuning is best at **domain adaption**. If you need the LLM to have access to new information, retrieval augmented generation is the best solution. 

You can inject that information into the prompt and an off-the-shelf LLM will be able to incorporate that new information in its response. If, on the other hand, you want your LLM to specialize in a certain task or domain, fine-tuning is the way to go. Especially if your LLM will be handling one discrete task, like routing prompts in your RAG system, or responding to only a certain type of prompt, fine-tuning makes a lot more sense.

### When to use RAG, and when to combine both

Fine-tuning and RAG can also be used together. In particular, you might fine-tune a model specifically to incorporate retrieved information into its final responses. In other words, you're helping the model specialize in its role within the RAG system. When deciding whether to use fine-tuning or RAG, the best choice might be both.   
Each approach improves the model's performance in different ways, and there are benefits to using both of them together. If you want to incorporate fine-tuning into your own RAG system, I recommend you take a separate course on fine-tuning and explore how to fine-tune your own language model. Fine-tuning is a complex topic, and it'd be impossible to adequately cover it within this course. That said, often you can find models that have already been fine-tuned for you and adapted to a particular task or domain. If you think your system needs a fine-tuned model, many online repositories of previously fine-tuned models are available, and you might be able to use one of those without doing the fine-tuning yourself.

#### Closure

Fine-tuning and RAG are sometimes described as competing alternatives, but they're more accurately viewed as complementary tools. Adding fine-tuned models into your RAG pipeline, or even fine-tuning the core LLM that generates your final response, can help improve your system's performance.   
While you won't dive into fine-tuning techniques in this course, it's definitely worth exploring as you continue to build your generative AI skills and look for ways to optimize your RAG systems.

## Conclusion

Nice work completing this module. There were a lot of LLM topics covered here, so let's do a quick review of everything you saw. 

- At the beginning of this module, you went deep into the heart of a transformer, understanding how it processes text to develop a deep understanding of its meaning and generate relevant completions.   
- You then saw how various sampling strategies can be used to tune the randomness inherent in how a language model generates text to fit the needs of your application.   
- Next, you learned how to use benchmarks to choose your LLM, a wide variety of prompt engineering techniques and how to detect and prevent hallucinations.   
- Then you learned a wide variety of techniques used to evaluate LLM performance. And finally, you looked at how adding agentic components or fine tuning models can push the limits of what your RAG system is able to do. 

At this point, you have a strong foundation in LLM behavior, prompting strategy, and output evaluation. The next module focuses on production operations: observability, cost-latency-quality trade-offs, and security hardening.