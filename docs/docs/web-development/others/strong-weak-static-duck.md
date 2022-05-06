---
title: "Strongly or Weakly AND Static or Duck typing"
metaTitle: "General programming concept will be recorded in this page "
metaDescription: "This is the meta description for this page"
---

## Functional Programming features from Haskell

Functional languages are declarative languages, they tell the computer what result they want. This is usually contrasted with *imperative* languages that tell the computer what steps to take to solve a problem. Python is usually coded in an *imperative* way but can use the declarative style if necessary.

Some of Python's features were influenced by Haskell, a purely functional programming language. To get a better appreciation of what a functional language is, let's look at features in Haskell that can be seen as desirable, functional traits:

- **Pure Functions** - do not have side effects, that is, they do not change the state of the program. Given the same input, a pure function will always produce the same output.
> In computer science, an operation, function or expression is said to have a **side effect** if it modifies some state variable value(s) outside its local environment, that is to say has an observable effect besides returning a value (the main effect) to the invoker of the operation. State data updated "outside" of the operation may be maintained "inside" a stateful object or a wider stateful system within which the operation is performed [wiki](https://en.wikipedia.org/wiki/Side_effect_(computer_science))

- **Immutability** - data cannot be changed after it is created. Take for example creating a `List` with 3 items and storing it in a variable `my_list`. If `my_list` is immutable, you wouldn't be able to change the individual items. You would have to set `my_list` to a `new List` if you'd like to use different values.
- **Higher Order Functions** - functions can accept other functions as parameters and functions can return new functions as output. This allows us to abstract over actions, giving us flexibility in our code's behavior.
> - *First class functions* are functions that are treated like an object (or are assignable to a variable).
> - *Higher order functions* are functions that take at least one first class function as a parameter.


## Strongly or Weakly AND Static or Duck typing
![strongweakstaticdynamic_type](/img/web-development/others/strongweakstaticdynamic_type.png)


### Strongly typed languages vs Weakly typed languages
A strongly-typed language is one in which variables are bound to specific data types, and will result in type errors if types do not match up as expected in the expression — regardless of when type checking occurs. Python is strong-typed, and so is Java.
```python
temp = "Hello World!"
temp = temp + 10; # program terminates with below stated error
```

A weakly-typed language on the other hand is a language in which variables are not bound to a specific data type; they still have a type, but type safety constraints are lower compared to strongly-typed languages. PHP is weakly-typed, and so is C.
```php
temp = "Hello World!";
$temp = $temp + 10; // no error caused
echo $temp;
```

### Static typed languages vs Dynamically typed languages 
A language is statically-typed if the type of a variable is known at compile-time instead of at run-time. Common examples of statically-typed languages include Java, C, C++, FORTRAN, Pascal and Scala.

In Statically typed languages, once a variable has been declared with a type, it cannot ever be assigned to some other variable of different type and doing so will raise a type error at compile-time(some IDE’s generally shows a Red Cross mark denoting the error).

```java
int data;
data = 50;
data = "Hello World!"; // causes an compilation error
```

A language is dynamically-typed if the type of a variable is checked during run-time. Common examples of dynamically-typed languages includes JavaScript, Objective-C, PHP, Python, Ruby, Lisp, and Tcl.

In Dynamically typed languages, variables are bound to objects at run-time by means of assignment statements, and it is possible to bind the same variables to objects of different types during the execution of the program.
```python
data = 10;
data = "Hello World!"; // no error caused
```

### Python is strongly, dynamically typed.

Strong typing means that the type of a value doesn't change in unexpected ways. A string containing only digits doesn't magically become a number, as may happen in Perl. Every change of type requires an explicit conversion.
Dynamic typing means that runtime objects (values) have a type, as opposed to static typing where variables have a type.

## Duck typing (Dynamic typing)
https://devopedia.org/duck-typing

Duck Typing is a way of programming in which an object passed into a function or method supports all method signatures and attributes expected of that object at run time. The object's type itself is not important. Rather, the object should support all methods/attributes called on it. For this reason, duck typing is sometimes seen as "a way of thinking rather than a type system".

In duck typing, we don't declare the argument types in function prototypes or methods. This implies that compilers can't do type checking. What really matters is if the object has the particular methods/attributes at run time. Duck typing is therefore often supported by dynamic languages. However, some static languages are beginning to "mimic" it via structural typing.


### What's the origin of the phrase "duck typing"?
> If it walks like a duck, swims like a duck, and quacks like a duck, then it probably is a duck.

Even a non-duck entity that behaves like a duck can be considered a duck because emphasis is on behaviour. By analogy, for computing languages, the type of an object is not important so long as it behaves as expected. This behaviour is defined by the object's methods/properties/attributes while expectations are set by those who invoke the methods/properties/attributes.

For example, a `Book` class is expected to have an attribute `numPages` and a method `getPage(number)`, where number is an integer. Let's say a function `searchPhrase(book, phrase)` is meant to search for a given phrase in a book. This function calls `book.getPage()` for all book.`numPages` of the book. A Newspaper is obviously not a book but with duck typing this doesn't matter. If Newspaper has implemented `numPages` and `getPage(number)`, it can be passed into `searchPhrase(book, phrase)` as if it's a book. Though it's not a book, it's sufficient that it behaves like one within the context of `searchPhrase`.

### What languages support duck typing?
Python and Ruby support duck typing, both of which are dynamic typed languages. In general, dynamic typed languages such as JavaScript and TypeScript support duck typing. While C# doesn't, some parts of .NET use duck typing.

### What's the advantage of having duck typing?
![convenience-safety](/img/web-development/others/convenience-safety.png)


## References 
[Functional Programming in Python](https://stackabuse.com/functional-programming-in-python/)