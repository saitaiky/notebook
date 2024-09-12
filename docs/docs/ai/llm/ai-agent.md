---
title: Architectures in AI Agents
draft: true
---

LangGraph offers powerful tools for building AI agents, but as agent architectures evolve, it’s essential to understand some of the advanced frameworks emerging in the field. These architectures enable more complex workflows, multi-agent interactions, and flow control. Here, we’ll explore a few key architectures, their characteristics, and their potential use cases.

### Multi-Agent Architecture

![simple_multi_agent_diagram](/img/ai/llm/simple_multi_agent_diagram.png)

Source: [Github: LangGrapgh](https://github.com/langchain-ai/langgraph/blob/main/examples/multi_agent/img/simple_multi_agent_diagram.png)

A **multi-agent architecture** involves several agents working collaboratively on a shared state. Each agent can have distinct roles and tools at its disposal, but they all operate on the same underlying information. This creates a highly coordinated system where:
- **Shared State**: The agents continuously pass information between each other as they work, ensuring all agents are aligned.
- **Complex Tasks**: This setup is ideal for tasks requiring multiple phases, such as research, content creation, or technical analysis.
- **Parallel Processing**: Multiple agents can run in parallel, each contributing to a different part of the overall task.

### Supervisor-Agent Architecture

![supervisor-diagram](/img/ai/llm/supervisor-diagram.png)

Source: [Github: LangGrapgh](https://github.com/langchain-ai/langgraph/blob/main/examples/multi_agent/img/simple_multi_agent_diagram.png)

In contrast to the multi-agent framework, a **supervisor-agent architecture** involves a **central supervisor** controlling sub-agents. Key characteristics include:
- **Supervisor Control**: The supervisor decides which tasks to delegate to sub-agents and passes specific inputs to each. This allows for more granular control over task execution.
- **Independent Sub-Agents**: Each sub-agent can maintain its own state, meaning it can operate independently of other agents.
- **Powerful Supervision**: Using a sophisticated LLM as the supervisor can enable intelligent decision-making and planning. This is particularly useful for tasks requiring adaptive strategies, such as project management or complex reasoning.

### Flow Engineering

![flow-engineering](/img/ai/llm/flow-engineering.webp)

Source: [Arxiv: Code Generation with AlphaCodium: From Prompt Engineering to Flow Engineering](https://arxiv.org/pdf/2401.08500)

Flow engineering originates from advanced research in agent architecture, particularly inspired by state-of-the-art solutions like **AlphaCodium**. The key idea is designing an information flow that optimizes how agents take action and make decisions. Characteristics of flow engineering include:
- **Directed Flow with Loops**: Tasks often follow a clear flow of steps, but certain parts of the process may involve loops where the agent iterates on a solution or revisits previous steps (e.g., refining code or re-running tests).
- **Graphical Representation**: Flow engineering is often visualized as a pipeline where agents or processes are represented as nodes in a graph, with certain nodes allowing for iterative refinement.
- **Dynamic Adjustments**: As the agent works through its tasks, it can adjust its flow based on real-time feedback or reflection on past actions.

### Plan and Execute Paradigm

![plan-execute](/img/ai/llm/plan-execute.png)

Source: [Github: LangGrapgh](https://github.com/langchain-ai/langgraph/blob/main/examples/plan-and-execute/plan-and-execute.ipynb?ref=blog.langchain.dev)

In a **plan and execute** style architecture, the agent explicitly creates a plan upfront and then executes it step-by-step. Key aspects of this architecture include:
- **Clear Planning**: The agent begins by developing a clear plan, outlining the actions it will take. This ensures a structured approach to problem-solving.
- **Iterative Execution**: The agent executes the plan step-by-step, possibly adjusting the plan as needed. This iterative execution ensures the agent can adapt to new information or results as it progresses.
- **Task Flexibility**: After each step, the agent may return to update its plan or continue executing based on feedback from the environment or task completion.

### Language Agent Tree Search

![language-agent-tree-search](/img/ai/llm/language-agent-tree-search.png)

Source: [Arxiv: Code Generation with AlphaCodium: From Prompt Engineering to Flow Engineering](https://arxiv.org/abs/2310.04406)

![language-agent-tree-search-2](/img/ai/llm/language-agent-tree-search-2.png)

Source: [Github: LangGrapgh](https://github.com/langchain-ai/langgraph/blob/main/examples/lats/lats.ipynb)

A more experimental approach, **Language Agent Tree Search**, involves an agent exploring a tree of possible actions, reflecting at each step. Characteristics include:
- **Tree-Based Search**: The agent starts by generating an action, reflects on it, and then explores sub-actions based on its reflection.
- **Backpropagation**: The agent can revisit previous nodes in the tree to update its understanding of earlier actions based on new information.
- **Persistence and Reflection**: This method relies heavily on persistence, as the agent needs to track its previous states and actions, revisiting them to make informed decisions about future steps.

### The Importance of **Persistence** and **Flow Control**:
Across all of these architectures, two concepts stand out as critical: **persistence** and **flow control**. 
- **Persistence** allows the agent to store and recall states, enabling it to revisit previous decisions or steps. This is essential for long-running tasks, iterative refinement, and complex problem-solving.
- **Flow Control** enables precise management of the information and action sequence. Whether the flow involves loops, iterations, or a linear progression, controlling how the agent processes tasks is key to building robust, intelligent agents.

### Final Thoughts:
LangGraph’s flexible architecture allows for the creation of sophisticated agents that can handle complex workflows, iterate over tasks, and manage dynamic information. With the ability to build multi-agent systems, supervisor-controlled agents, and implement advanced flow engineering, LangGraph stands out as a powerful tool for AI development. As we look ahead, understanding these emerging paradigms is crucial for creating agents that are both intelligent and reliable in real-world applications.

----


## Expanding LLM Capabilities Beyond Text Generation

As LLMs continue to evolve, their ability to integrate with existing software infrastructure becomes increasingly important. Initially designed for natural language interaction, LLMs are now showing potential beyond simple text generation.

- **LLMs in Software Integration**: LLMs, once limited to human interaction, are now capable of integrating with existing software systems. This advancement opens up new possibilities for automated decision-making and process optimization.
    - **Automation and Function Calls**: These models can now decide when to call specific functions from external programs, enabling them to fetch information or trigger actions autonomously.
    - **Bridging the Gap**: By stepping beyond natural language generation, LLMs now actively participate in workflows, becoming tools for both communication and action.

### Enhancing LLM Outputs with Structured Data

As LLMs integrate deeper into software systems, their ability to handle structured data becomes crucial. This capability allows them to work with various data formats and engage with more complex tasks, directly related to the automation goals mentioned earlier.

- **Structured Data and JSON Integration**: A major improvement in LLM functionality is the ability to output structured data like JSON, simplifying interactions with software systems that require formatted outputs.
    - **Overcoming Traditional Limitations**: Historically, LLMs struggled with structured data like tables. Now, they can produce well-structured outputs, making them more effective in data-intensive workflows.
    - **Improved Data Interaction**: By integrating structured data capabilities, LLMs become even more versatile, able to work in environments where accuracy and data formatting are critical, reinforcing their role in both communication and action.

### The Power of Function Calling in LLMs

Building on LangChain’s integrations, a critical feature that boosts LLMs’ utility is the new function-calling capability. This ties back to earlier discussions on automation and structured data, showing how LLMs can now perform even more precise actions.

- **Introducing Function Calling**: Function calling allows LLMs to trigger specific programmatic actions within software systems, simplifying the development of reliable, action-oriented tools.
    - **Simplifying Tool Building**: By allowing developers to build tools that rely on LLM decisions, function calling provides a cleaner, more efficient way to incorporate AI into applications.
    - **Use Cases in the Course**: This capability will be demonstrated in tasks like tagging and data extraction, further emphasizing its relevance in building conversational agents and systems that rely on structured information.
