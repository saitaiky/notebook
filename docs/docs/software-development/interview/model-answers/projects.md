---
title: Project Show case
---

Below is a concise, four-point story tailored to your project that emphasizes the challenge with early evaluation and the human-in-the-loop flow design:

---

**Project I’m Proud Of:**  
I led the development of an LLM-powered research assistant for an Indian university using LangGraph. The system integrated a human-in-the-loop flow to refine research queries and deliver precise insights.

**Approach:**  
We invested significant time designing an optimal LangGraph flow—creating robust subgraphs, an intent classifier, and a human-in-the-loop mechanism—to ensure seamless query processing. This focus meant that early agent evaluation was deferred.

**Impact:**  
The detailed flow design resulted in high-quality, reliable responses that greatly assisted students in their research. User feedback was positive, and the overall system usability improved markedly during live interactions.

**Reflection:**  
In hindsight, dedicating more time to early evaluation—using strategies like those in the LangGraph evaluation video (e.g., golden datasets and trajectory analysis)—would have quickly revealed inefficiencies in our agentic flow. Starting with a basic agent design and iteratively evaluating it would have allowed us to optimize the performance earlier, balancing design excellence with practical performance insights.


## Follow-up questions

Here are some potential follow-up questions you might face, along with brief notes on how to prepare for each:

- **Can you walk me through the LangGraph flow design you implemented?**  
  *Be ready to describe the overall architecture—how you set up subgraphs (e.g., for intent classification, query processing, and human-in-the-loop), what each component does, and why you designed it that way.*

- **How did you integrate the human-in-the-loop mechanism in your system?**  
  *Explain the role of human review in refining query responses, how it improved accuracy, and what challenges (like latency or complexity) you faced.*

- **What were the trade-offs you encountered by focusing so much on flow design versus early evaluation?**  
  *Discuss how deferring evaluation affected your ability to quickly catch inefficiencies, and what you would do differently (e.g., starting with a basic agentic flow and iterating with early feedback using golden datasets).*

- **Could you detail what early evaluation would have looked like?**  
  *Prepare to explain how you would set up a golden dataset and use tools (like LangGraph’s lsmith SDK) to assess both final output accuracy and the trajectory of agent decisions, as described in the evaluation video.*

- **How did you resolve issues when some node outputs were inconsistent?**  
  *Mention how you enforced data contracts using Pydantic and built a dedicated validation layer to reformat outputs, ensuring smooth downstream processing.*

- **Given our tech stack (Elixir/Phoenix for BE and Vue for FE), how do you see your experience with LangGraph and your approach applying to our environment?**  
  *Be ready to discuss how your architectural and iterative development skills are transferable, even if you have to learn new languages or frameworks.*

By preparing concise, structured answers to these questions, you'll demonstrate both your technical depth and your reflective approach to solving challenges.