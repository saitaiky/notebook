---
title: Design Pattern
---

> Reference: [Sourcemakring - Design Patterns](https://sourcemaking.com/design_patterns)
> Reference: [Do you need Design Patterns in Functional Programming?](https://dev.to/patferraggi/do-you-need-design-patterns-in-functional-programming-370c)

## What is design Pattern

In software engineering, a **design pattern** is a general repeatable solution to a commonly occurring problem in software design. A design pattern isn't a finished design that can be transformed directly into code. It is a description or template for how to solve a problem that can be used in many different situations.


### Uses of Design Patterns

Design patterns can speed up the development process by providing tested, proven development paradigms. Effective software design requires considering issues that may not become visible until later in the implementation. Reusing design patterns helps to prevent subtle issues that can cause major problems and improves code readability for coders and architects familiar with the patterns.

Often, people only understand how to apply certain software design techniques to certain problems. These techniques are difficult to apply to a broader range of problems. Design patterns provide general solutions, documented in a format that doesn't require specifics tied to a particular problem.

In addition, patterns allow developers to communicate using well-known, well understood names for software interactions. Common design patterns can be improved over time, making them more robust than ad-hoc designs.


### What is SOLID?

> SOLID is a mnemonic acronym for five design principles intended to make software designs more understandable, flexible and maintainable

They were first introduced by Robert C. Martin in the early 2000s in his paper [Design Principles and\
Design Patterns](https://fi.ort.edu.uy/innovaportal/file/2032/1/design_principles.pdf) and they are the following:

- **Single-Responsibility Principle** - An object should only have a single responsibility, that is, only changes to one part of the software's specification should be able to affect the specification of the object.
- **Open-Closed Principle** - Software entities ... should be open for extension, but closed for modification.
- **Liskov Substitution Principle** - Objects in a program should be replaceable with instances of their subtypes without altering the correctness of that program.
- **Interface Segregation Principle** - Many client-specific interfaces are better than one general-purpose interface.
- **Dependency Inversion Principle** - One should depend upon abstractions, [not] concretions.


### SOLID in FP

> Reference: [Do the SOLID principles apply to Functional Programming?](https://dev.to/patferraggi/do-the-solid-principles-apply-to-functional-programming-56lm)

- **Single-Responsibility Principle** (Your responsibility)
    
    Although functional programming languages don't have classes, the same principle holds true. Functions should be small reusable pieces of code that you can compose freely to create complex behavior.

    This can be extracted to almost anything, once your functions are small, the modules where they are located they should also form a cohesive closure that does only one thing and does it well.

    As long as your function or class or module has only one reason to change then you are applying this principle.

- **Open-Closed Principle** (FP supports by default)

    Instead of using inheritance, Functional Programming achieves this by using two tools. Composition to create new behaviors from previously defined functions and higher-order functions to change functionality at runtime

- **Liskov Substitution Principle** (FP with polymorphic function or data type supports by default)

    when people generally think about this principle the first idea that comes to their head is that if the parent class has some behavior, their children should not break that behavior, but this is not the only applicable case, LSP also applies in case we use generic or parametric programming where we create functions that work on a variety of types, they all hold a common truth that makes them interchangeable.

    This pattern is **super common in functional programming**, where you create functions that embrace polymorphic types (aka generics) to ensure that one set of inputs can seamlessly be substituted for another without any changes to the underlying code.
    

- **Interface Segregation Principle**   (Your responsibility)

    Every interaction between components is done by an interface (not the OOP interface). When you use functions from a module, you are using the disposed interface of that module, even if we are in a dynamically typed language, that interface still exists. The point of this is that the way you create modules(or classes or interfaces or API's or whatever) needs to be cohesive, you should provide one clear way of doing things instead of many, and you should expose only what is necessary for the users to perform the specific task.

- **Dependency Inversion Principle** (FP supports by default)

    In languages like C#, this is achieved by using two tools. One is to create interfaces to define contracts of a predefined functionality. The other is to use dependency injection so that users of that functionality don't manually instantiate the concrete class, instead, they receive an instance of the interface through their constructor and they just call the appropriate methods on the instance.

    In functional programming, **abstractions are the default way of handling code, functions are abstractions too**, especially in functional programming where we care more about the "shape" of the data instead of to which specific type they are attached to. This creates the possibility to freely change the implementation at runtime by passing functions as parameters to other functions or even returning functions as results from the computation.


### Apply OO design pattern to other areas?

> Further reading: [Do you need Design Patterns in Functional Programming?](https://dev.to/patferraggi/do-you-need-design-patterns-in-functional-programming-370c)

There's no simple mapping from OO design to functional design. They're very different ways of looking at the problem.

Functional programming (like all styles of programming) has design patterns. Relational databases have design patterns, OO has design patterns, and procedural programming has design patterns. Everything has design patterns, even the architecture of buildings.

Design patterns -- as a concept -- are a timeless way of building, irrespective of technology or problem domain. However, specific design patterns apply to specific problem domains and technologies.

Everyone who thinks about what they're doing will uncover design patterns.

:::infoIs there any truth to the claim that functional programming eliminates the need for OOP design patterns?
Yes, When you work in a FP language, you no longer need the OOP-specific design patterns. But you still need some **general design patterns**, like **MVC** or other **non-OOP specific** stuff, and you need **a couple of new FP-specific "design patterns" instead**. All languages have their shortcomings, and design patterns are usually how we work around them.

From [jalf](https://stackoverflow.com/questions/327955/does-functional-programming-replace-gof-design-patterns)
:::

:::infoA typical OOP design pattern and its functional equivalent?
The above shouldn't exist. That's like asking for a piece of procedural code rewritten as OO code. If I translate the original Fortran (or C) into Java, I haven't done anything more than translate it. If I totally rewrite it into an OO paradigm, it will no longer look anything like the original Fortran or C -- it will be unrecognizable.

From [S.Lott](https://stackoverflow.com/questions/327955/does-functional-programming-replace-gof-design-patterns)
:::

