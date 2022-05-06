---
title: "Programming paradigm"
metaTitle: "General programming concept will be recorded in this page "
metaDescription: "This is the meta description for this page"
---


There are two main approaches to programming
![types-of-paradigms](/img/web-development/others/types-of-paradigms.png)
Describes the different styles of programming (Source: geeksforgeeks.org)

- Imperative programming – focuses on how to execute, defines control flow as statements that change a program state. *It explicitly tells the computer "how" to accomplish it.* eg: 
- Declarative programming – focuses on what to execute, defines program logic, but not detailed control flow. *It describes "what" a program should accomplish.* 
> It’s important to realize that many declarative approaches have some sort of imperative abstraction layer. 

So the main differences are that *imperative* tells you **how** to do something and *declarative* tells you **what** to do. 

- Imperative: C, C++, Java
- Declarative: SQL, HTML
- (Can Be) Mix: JavaScript, C#, Python

### Analogy 
I’m going to ask you a question. I want you to think of both an imperative response and a declarative response.

“I’m right next to Wal-Mart. How do I get to your house from here?”

**Imperative response**: Go out of the north exit of the parking lot and take a left. Get on I-15 North until you get to the 12th street exit. Take a right off the exit like you’re going to Ikea. Go straight and take a right at the first light. Continue through the next light then take your next left. My house is #298.

**A declarative response:** My address is 298 West Immutable Alley, Eden, Utah 84310


### Comparsion
![imperative-functional-comparsion](/img/web-development/others/imperative-functional-comparsion.png)

***

### Imperative programming (HOW)
```C
// average of five number in C 
  
int marks[5] = { 12, 32, 45, 13, 19 } int sum = 0; 
float average = 0.0; 
for (int i = 0; i < 5; i++) { 
    sum = sum + marks[i]; 
} 
average = sum / 5; 
```

### Declarative programming (WHAT)
```sql
SELECT * FROM Users WHERE Country=’Mexico’;
```

```html
<article>
  <header>
    <h1>Declarative Programming</h1>
    <p>Sprinkle Declarative in your verbiage to sound smart</p>
  </header>
</article>
```
By glancing at both examples, you have a clear understanding of what is going on. They’re both declarative. They’re concerned with **WHAT** you want to be done, rather than **HOW** you want it done.

You’re describing what you’re trying to achieve, without instructing how to do it. The implementation of selecting all of the users who live in Mexico has been abstracted from you. You’re not concerned with how the web browser is parsing your article and displaying it to the screen. Your **WHAT** is Mexican users or a new header and paragraph on your website.

```js
function double (arr) {
  return arr.map((item) => item * 2)
}
```
We’re leveraging JavaScript’s built-in map and reduce methods. This goes back to  the point we've mentioned previously, **the most declarative solutions are an abstraction over some imperative implementation**.

### Sub-set
The following are widely considered the main programming paradigms, as seen when measuring programming language popularity:
- **Procedural programming**, structured programming – specifies the steps a program must take to reach a desired state.
- **Functional programming (Declarative)** – treats programs as evaluating mathematical functions and avoids state and mutable data.
- **Object-oriented programming (OOP)** – organizes programs as objects: data structures consisting of datafields and methods together with their interactions.

![java-oops](/img/web-development/others/java-oops.png)
Describes the key concepts of object-oriented programming (Source: javatpoint.com)


## References 
- [Imperative vs Declarative Programming](https://tylermcginnis.com/imperative-vs-declarative-programming/)
- [Introduction of Programming Paradigms](https://www.geeksforgeeks.org/introduction-of-programming-paradigms/)
- [What exactly is a programming paradigm?](https://www.freecodecamp.org/news/what-exactly-is-a-programming-paradigm/)