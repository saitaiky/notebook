---
title: Architectures in AI Agents
---

LangGraph offers powerful tools for building AI agents, but as agent architectures evolve, it’s essential to understand some of the advanced frameworks emerging in the field. These architectures enable more complex workflows, multi-agent interactions, and flow control. Here, we’ll explore a few key architectures, their characteristics, and their potential use cases.

## Agentic workflow

### Multi-Agent Architecture

![simple_multi_agent_diagram](/img/ai/agentic-system/simple_multi_agent_diagram.png)

Source: [Github: LangGrapgh](https://github.com/langchain-ai/langgraph/blob/main/examples/multi_agent/img/simple_multi_agent_diagram.png)

A **multi-agent architecture** involves several agents working collaboratively on a shared state. Each agent can have distinct roles and tools at its disposal, but they all operate on the same underlying information. This creates a highly coordinated system where:
- **Shared State**: The agents continuously pass information between each other as they work, ensuring all agents are aligned.
- **Complex Tasks**: This setup is ideal for tasks requiring multiple phases, such as research, content creation, or technical analysis.
- **Parallel Processing**: Multiple agents can run in parallel, each contributing to a different part of the overall task.

### Supervisor-Agent Architecture

![supervisor-diagram](/img/ai/agentic-system/supervisor-diagram.png)

Source: [Github: LangGrapgh](https://github.com/langchain-ai/langgraph/blob/main/examples/multi_agent/img/simple_multi_agent_diagram.png)

In contrast to the multi-agent framework, a **supervisor-agent architecture** involves a **central supervisor** controlling sub-agents. Key characteristics include:
- **Supervisor Control**: The supervisor decides which tasks to delegate to sub-agents and passes specific inputs to each. This allows for more granular control over task execution.
- **Independent Sub-Agents**: Each sub-agent can maintain its own state, meaning it can operate independently of other agents.
- **Powerful Supervision**: Using a sophisticated LLM as the supervisor can enable intelligent decision-making and planning. This is particularly useful for tasks requiring adaptive strategies, such as project management or complex reasoning.

### Flow Engineering

![flow-engineering](/img/ai/agentic-system/flow-engineering.webp)

Source: [Arxiv: Code Generation with AlphaCodium: From Prompt Engineering to Flow Engineering](https://arxiv.org/pdf/2401.08500)

Flow engineering originates from advanced research in agent architecture, particularly inspired by state-of-the-art solutions like **AlphaCodium**. The key idea is designing an information flow that optimizes how agents take action and make decisions. Characteristics of flow engineering include:
- **Directed Flow with Loops**: Tasks often follow a clear flow of steps, but certain parts of the process may involve loops where the agent iterates on a solution or revisits previous steps (e.g., refining code or re-running tests).
- **Graphical Representation**: Flow engineering is often visualized as a pipeline where agents or processes are represented as nodes in a graph, with certain nodes allowing for iterative refinement.
- **Dynamic Adjustments**: As the agent works through its tasks, it can adjust its flow based on real-time feedback or reflection on past actions.

### Plan and Execute Paradigm

![plan-execute](/img/ai/agentic-system/plan-execute.png)

Source: [Github: LangGrapgh](https://github.com/langchain-ai/langgraph/blob/main/examples/plan-and-execute/plan-and-execute.ipynb?ref=blog.langchain.dev)

In a **plan and execute** style architecture, the agent explicitly creates a plan upfront and then executes it step-by-step. Key aspects of this architecture include:
- **Clear Planning**: The agent begins by developing a clear plan, outlining the actions it will take. This ensures a structured approach to problem-solving.
- **Iterative Execution**: The agent executes the plan step-by-step, possibly adjusting the plan as needed. This iterative execution ensures the agent can adapt to new information or results as it progresses.
- **Task Flexibility**: After each step, the agent may return to update its plan or continue executing based on feedback from the environment or task completion.

### Language Agent Tree Search

![language-agent-tree-search](/img/ai/agentic-system/language-agent-tree-search.png)

Source: [Arxiv: Language Agent Tree Search Unifies Reasoning Acting and Planning in Language Models](https://arxiv.org/abs/2310.04406)

![language-agent-tree-search-2](/img/ai/agentic-system/language-agent-tree-search-2.png)

Source: [Github: LangGrapgh](https://github.com/langchain-ai/langgraph/blob/main/examples/lats/lats.ipynb)

A more experimental approach, **Language Agent Tree Search**, involves an agent exploring a tree of possible actions, reflecting at each step. Characteristics include:
- **Tree-Based Search**: The agent starts by generating an action, reflects on it, and then explores sub-actions based on its reflection.
- **Backpropagation**: The agent can revisit previous nodes in the tree to update its understanding of earlier actions based on new information.
- **Persistence and Reflection**: This method relies heavily on persistence, as the agent needs to track its previous states and actions, revisiting them to make informed decisions about future steps.

## The Importance of **Persistence** and **Flow Control**:
Across all of these architectures, two concepts stand out as critical: **persistence** and **flow control**. 
- **Persistence** allows the agent to store and recall states, enabling it to revisit previous decisions or steps. This is essential for long-running tasks, iterative refinement, and complex problem-solving.
- **Flow Control** enables precise management of the information and action sequence. Whether the flow involves loops, iterations, or a linear progression, controlling how the agent processes tasks is key to building robust, intelligent agents.
