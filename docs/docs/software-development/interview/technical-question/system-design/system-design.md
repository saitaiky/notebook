---
title: System Design Interview
sidebar_position: 2
unlisted: true
---

System design interviews may seem strictly focused on assessing your technical abilities, but that’s not quite the case.

## System Design vs. Coding Interviews

The system design interview is categorized as a technical interview, much like a coding interview, but it differs significantly. Here are some key differences:

- **Most prompts are intentionally vague**: Coding challenges are clear; system design prompts are not. The system design interview mimics real-world conditions, so the interviewer doesn’t give you clear requests with features neatly outlined. You must tease out specifics yourself, which is why asking clarifying questions and following a [framework](/software-development/interview/technical-question/system-design/the-framework/) are so important.
- **There is no "right" answer**: It's true that there are good designs and bad designs, but as long as your choices are justifiable and you articulate tradeoffs, you should let your creativity shine.
- **You're engaged in a two-way dialogue**: This is critical. In a real-world scenario, you wouldn't go off on your own with only a vague idea of what to build. Work with your interviewer every step of the way. Clarify requirements in the beginning, check in throughout, and evaluate your choices at the end.

Even the most brilliant engineer can tank the system design interview if they forget that communication skills are being assessed too. The best engineers ask a lot of questions, think through tradeoffs, and justify their choices to build a working system.

## What to Expect

Typically, the system design interview lasts 45 minutes to an hour, including time for introductions and Q&As from the interviewer. However, companies such as Amazon could mix a system design question with behavioral questions, or even conduct 20-minute system design interviews.

You'll be asked to use a whiteboard (if you're in person) or an online tool such as Google Drawings, Whimsical, or Miro to outline your design.

> **Tip**: Ask your recruiter how you'll present your solution, and practice with that tool. If you're told you can choose, pick one tool and practice consistently to alleviate anxiety on the big day.

A system design question is broad enough so that there isn’t only one “correct” answer, but includes sufficient context so that you can give a more focused solution. The question is presented in a broad form initially, and it’s up to you to narrow the problem scope.

## What Interviewers Are Looking For

Interviewers don’t expect you to create a 100% perfect solution. Instead, they assess how well you:

- Clarify ambiguity around system and/or product requirements.
- Navigate a complex problem by considering constraints, bottlenecks, and tradeoffs.
- Discuss and evaluate multiple solutions, weighing the pros and cons of each to reach a workable solution.
- Identify scaling opportunities, potential risks, and/or points of failure.

For an in-depth look into how interviewers assess candidates, review our [Rubric for System Design Interviews](/software-development/interview/technical-question/system-design/rubric/).

> **Note**: Senior candidates should also prepare to demonstrate their [leadership behaviors and skills](https://www.tryexponent.com/blog/system-design-interview-guide#:~:text=the). In addition to assessing technical skills for designing at scale, interviewers also try to answer, "What is it like to work with you, and would they want you on their team?"

You can demonstrate leadership skills in an interview to receiving a positive evaluation by:

- Asking powerful open-ended questions at the outset, such as "What are the goals of this system?" and "What does success look like?"
- Actively listening (sometimes referred to as [level 5 listening](https://fellow.app/blog/leadership/the-levels-of-listening-as-a-leadership-tool/)).
- Collaborating with the interviewer rather than treating them as a stenographer. This is particularly important for more senior roles, where you will be expected to use leadership behaviors and skills heavily.

## How to Prepare

You can best prepare for the interview by ensuring you have a solid grasp on:

1. An [interview framework](/software-development/interview/technical-question/system-design/the-framework/) to organize your solution and communicate it effectively with the interviewer.
2. [System design principles](/software-development/system-design/models-patterns-strategy/system-design-principle/) to guide your decisions when weighing complex design tradeoffs.
3. Practicing with real-world system design questions, which helps you apply your knowledge to real-world interview questions.

## Additional Preparation Tips

- **Clarify Functional and Non-Functional Requirements**: Always begin by clarifying requirements. Define expectations, especially when the question is too open-ended.
    - Your answer depends on the position you're interviewing for, your seniority, and the interview stage.
    - Determine the level of depth expected and what's considered out of scope, such as focusing on a DB schema but not covering the payment processing for credit card details.
- **Consider User Volume and Growth Trajectory**:
    - What volume of users do we expect, and how does the growth trajectory look over time? For example, do we expect a huge initial spike and then steady growth?
    - Understand user regions and how these factors influence your design.
- **Align with Business Objectives**:
    - How does your solution fit in with greater business objectives?
    - Given these objectives, what success metrics should we track? This helps determine which system properties to prioritize, like high availability or reliability.
- **Assess Integration with Other Services**:
    - Will this product integrate with other services, internal or external? How will this change as we grow?
- **Address Technical Questions**:
    - Be prepared to answer fundamental technical questions like "What happens when you type a URL into a browser?"
    - These questions assess your technical knowledge, communication skills, and curiosity about technology. Understanding complementary technologies impacting your work at target companies will help you stand out.
- **Consider Cloud-Native Services**:
    - Understand the risks of vendor lock-in for clients and be prepared to discuss them.

For a detailed approach, refer to [The framework](/software-development/interview/technical-question/system-design/the-framework/).
