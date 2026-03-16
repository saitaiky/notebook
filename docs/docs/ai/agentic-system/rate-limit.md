---
title: Rate limit
description: 'When working with large language models (LLMs), especially from cloud-based providers like OpenAI or Anthropic, you''ll inevitably face rate limits — hard constrai.'
sidebar_position: 5
keywords:
  - ai
  - agentic system
  - rate limit
  - rate
  - limit
  - when
  - working
  - large
---

When working with large language models (LLMs), especially from cloud-based providers like OpenAI or Anthropic, you'll inevitably face **rate limits** — hard constraints on how frequently or quickly your application can interact with the provider's API. These limits are imposed to ensure fair resource distribution and infrastructure stability.

This blog post walks you through best practices for managing rate limits using [LangChain’s chat model utilities](https://python.langchain.com/docs/how_to/chat_model_rate_limiting/). We’ll explain the types of rate limits that exist, introduce the two primary rate limiting utilities LangChain provides, compare them side by side, and show you practical, real-world examples of how to apply each approach effectively in your applications.

Whether you're building a simple chatbot or a complex pipeline composed of multiple LLM-enabled tools, mastering rate limiting will help you avoid errors, improve responsiveness, and reduce the likelihood of provider throttling.

## What Are Rate Limits?

Rate limits are restrictions placed on how many requests or tokens your application can send to a large language model API in a given time window. These limits are enforced by providers like OpenAI and vary based on model, tier, and usage patterns.

According to OpenAI, the following five rate limit metrics are currently tracked and enforced:

| Metric                        | Description                                                                 |
| ----------------------------- | --------------------------------------------------------------------------- |
| **Requests per minute (RPM)** | Number of API calls allowed per minute                                      |
| **Tokens per minute (TPM)**   | Total tokens sent and received across all calls per minute                  |
| **Requests per day (RPD)**    | Daily limit on the number of API requests (especially for free/early plans) |
| **Tokens per day (TPD)**      | Total tokens allowed per day across requests                                |
| **Images per minute (IPM)**   | Number of image generation requests allowed per minute (e.g. DALL·E)        |

These limits ensure quality of service across the platform. In practice, exceeding them will trigger errors (like HTTP 429) or timeouts. They are typically enforced at the organization level and may also be quantized over short periods (e.g. per second) to avoid traffic bursts.

## Two Ways to Handle Rate Limits in LangChain

LangChain offers two built-in rate limiter classes, each tailored to different usage patterns and architectures:

- `RateLimiter` (Utility-Based)
    - Found in: `langchain.utils.rate_limit`
    - Designed for simple integration with a model
    - Great for direct API calls and standalone use cases
    - For more information, check LangSmith [Chat models](https://python.langchain.com/docs/concepts/chat_models/#standard-parameters)
- `InMemoryRateLimiter` (Runnable-Based) 
    - Found in: `langchain_core.rate_limiters`
    - Built for `Runnable` pipelines
    - Perfect for workflows involving prompts, retrievers, evaluators, or other steps
    - For more information, check LangSmith [How to handle model rate limits](https://docs.smith.langchain.com/evaluation/how_to_guides/rate_limiting)


Choosing the right limiter depends on whether your app uses basic model calls or LangChain's composable pipeline system. Below is the side-by-side comparison highlights where each option shines.


| Feature                        | `RateLimiter`                | `InMemoryRateLimiter`                                        |
| ------------------------------ | ---------------------------- | ------------------------------------------------------------ |
| **Module**                     | `langchain.utils.rate_limit` | `langchain_core.rate_limiters`                               |
| **Design**                     | Utility-based                | `Runnable`-based (fits in pipelines)                         |
| **Integration with LangChain** | Moderate — wraps model calls | High — integrates with chains, retrievers, tools             |
| **Thread Safety**              | Yes                          | Yes                                                          |
| **Process Safety**             | No (local memory only)       | No (local memory only)                                       |
| **Burst Control**              | Yes (via `max_bucket_size`)  | Yes (via `max_bucket_size`)                                  |
| **Ideal Use Case**             | Direct model interaction     | Composing multi-step workflows or chaining custom components |

## Code Demo

### Using `RateLimiter` with a Chat Model

This is the simplest and quickest way to add rate limiting to your application. It wraps around the model object and regulates how often the model is called.

```python
from langchain.chat_models import ChatOpenAI
from langchain.utils.rate_limit import RateLimiter

rate_limiter = RateLimiter(max_calls=5, period=1)  # 5 requests per second
chat = ChatOpenAI(rate_limiter=rate_limiter)

response = chat.invoke("Tell me a joke")
```

This approach is ideal for scripting, fast experimentation, or building lightweight apps where only the LLM call needs regulation.

###  Using `InMemoryRateLimiter` with Runnable Chains

In more complex LangChain apps, you often build pipelines using `Runnable` components. These might include prompt templates, tool wrappers, or retrieval chains. `InMemoryRateLimiter` fits naturally into this setup.

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.rate_limiters import InMemoryRateLimiter

prompt = ChatPromptTemplate.from_template("Tell me a joke about {topic}")
model = ChatOpenAI()
rate_limiter = InMemoryRateLimiter(requests_per_second=2)

# Compose chain with rate limiter applied
chain = prompt | rate_limiter | model

response = chain.invoke({"topic": "cats"})
print(response)
```

By placing the rate limiter between components, it controls request pacing across the entire chain — not just at the LLM call. This is essential when multiple components might trigger requests.

### Retry with Backoff Using `max_retries`

Even with throttling, you may encounter rate limit errors during high traffic. Many LangChain models expose a `max_retries` parameter for automatic retrying:

```python
from langchain.chat_models import ChatOpenAI

chat = ChatOpenAI(max_retries=3)  # Retries up to 3 times with backoff
```

:::info Using `tenacity`, if you're not using `langchain`
If you're not using `langchain` you can use other libraries like `tenacity` (Python) or `backoff` (Python) to implement retries with exponential backoff, or you can implement it from scratch. See some examples of how to do this in the [OpenAI docs](https://platform.openai.com/docs/guides/rate-limits#retrying-with-exponential-backoff).
```python
from tenacity import (
    retry,
    stop_after_attempt,
    wait_random_exponential,
)  # for exponential backoff

@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(6))
def completion_with_backoff(**kwargs):
    return client.chat.completions.create(**kwargs)


completion_with_backoff(model="gpt-4o-mini", messages=[{"role": "user", "content": "Once upon a time,"}])
```
```python
ChatCompletion(id='chatcmpl-8PAu6anX2JxQdYmJRzps38R8u0ZBC', choices=[Choice(finish_reason='stop', index=0, message=ChatCompletionMessage(content='in a small village nestled among green fields and rolling hills, there lived a kind-hearted and curious young girl named Lily. Lily was known for her bright smile and infectious laughter, bringing joy to everyone around her.\n\nOne sunny morning, as Lily played in the meadows, she stumbled upon a mysterious book tucked away beneath a tall oak tree. Intrigued, she picked it up and dusted off its weathered cover to reveal intricate golden patterns. Without hesitation, she opened it, discovering that its pages were filled with magical tales and enchanting adventures.\n\nAmong the stories she found, one particularly caught her attention—a tale of a long-lost treasure hidden deep within a mysterious forest. Legend had it that whoever found this hidden treasure would be granted one wish, no matter how big or small. Excited by the prospect of finding such treasure and fulfilling her wildest dreams, Lily decided to embark on a thrilling journey to the forest.\n\nGathering her courage, Lily told her parents about the magical book and her quest to find the hidden treasure. Though concerned for their daughter\'s safety, they couldn\'t help but admire her spirit and determination. They hugged her tightly and blessed her with love and luck, promising to await her return.\n\nEquipped with a map she found within the book, Lily ventured into the depths of the thick forest. The trees whispered tales of forgotten secrets, and the enchanted creatures hidden within watched her every step. But Lily remained undeterred, driven by her desire to discover what lay ahead.\n\nDays turned into weeks as Lily traversed through dense foliage, crossed swift rivers, and climbed treacherous mountains. She encountered mystical beings who offered guidance and protection along her perilous journey. With their help, she overcame countless obstacles and grew braver with each passing day.\n\nFinally, after what felt like an eternity, Lily reached the heart of the forest. There, beneath a jeweled waterfall, she found the long-lost treasure—a magnificent chest adorned with sparkling gemstones. Overwhelmed with excitement, she gently opened the chest to reveal a brilliant light that illuminated the forest.\n\nWithin the glow, a wise voice echoed, "You have proven your courage and pure heart, young Lily. Make your wish, and it shall be granted."\n\nLily thought deeply about her wish, realizing that her true treasure was the love and happiness she felt in her heart. Instead of making a wish for herself, she asked for the wellbeing and prosperity of her village, spreading joy and harmony to everyone living there.\n\nAs the light faded, Lily knew her quest was complete. She retraced her steps through the forest, returning home to find her village flourishing. Fields bloomed with vibrant flowers, and laughter filled the air.\n\nThe villagers greeted Lily with open arms, recognizing her selflessness and the magic she had brought into their lives. From that day forward, they told the tale of Lily\'s journey, celebrating her as a heroine who embodied the power of love, kindness, and the belief that true treasure lies within oneself.\n\nAnd so, the story of Lily became an everlasting legend, inspiring generations to follow their dreams, be selfless, and find the true treasures that lie within their hearts.', role='assistant', function_call=None, tool_calls=None))], created=1701010806, model='gpt-3.5-turbo-0613', object='chat.completion', system_fingerprint=None, usage=CompletionUsage(completion_tokens=641, prompt_tokens=12, total_tokens=653))
```
:::


## Fallback to a Backup Model

Another powerful technique is switching to a secondary model if your primary provider is throttled or down:

```python
from langchain.chat_models import ChatOpenAI, ChatAnthropic

try:
    response = ChatOpenAI().invoke("What's the weather in London?")
except Exception as e:
    print("Fallback triggered due to:", e)
    response = ChatAnthropic().invoke("What's the weather in London?")
```

This ensures uptime and responsiveness, especially in production applications.

## Additional Tips

Here are a few extra strategies to maximise performance and resilience:

- **Batching**: Consolidate multiple inputs into fewer API calls using `map_reduce` or similar techniques.
- **Streaming**: For long responses, streaming tokens reduces overall token usage and improves perceived latency.
- **Parallelisation**: Use with caution — multiple concurrent keys may violate terms of service.
- **Monitoring**: Track error types, retry rates, and cache effectiveness to guide optimisations.

## Final Thoughts

Rate limiting is not just a technical constraint — it's a design consideration. Choosing the right strategy for your LangChain app can make the difference between smooth, resilient performance and frustrating bottlenecks.

If you’re calling LLMs frequently or chaining components together, make rate control a first-class concern. Combine strategies like caching, exponential backoff, fallback models, and thoughtful batching to ensure your app remains stable and cost-efficient.

For even more robustness, pair these approaches with monitoring tools like LangSmith, and run load tests before scaling up.

With the right rate limiting setup in place, your LLM-powered applications will be well-prepared for production traffic and evolving usage patterns.

