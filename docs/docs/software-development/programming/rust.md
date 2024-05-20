---
title: Rust
sidebar_position: 3
---


## Commands to make it get started

Organized version of the explanation on how to use a couple of `cargo` commands in Rust programming:

- Create a project
    -  `cargo new my_project` - Creates a new directory with the specified name and initializes a project inside it.
    - `cargo init`- Initializes a project inside the current directory.
    - `--bin` and `--lib` flags
        - Both `cargo new` and `cargo init` can take either `--bin` or `--lib` flags.
        - If no flag is passed, it defaults to `--bin`.
        - `--bin` creates a binary project with a `main.rs` file that can be built into an executable.
        - `--lib` creates a library project with a `lib.rs` file.
- `cargo build`
    - Compiles a project.
    - By default, it builds in `--debug` mode with extra debug information and runtime checks.
    - The `--release` flag sets it to "release" mode, which is smaller and faster.
- `cargo run`
    - Builds and runs the program in debug mode.
    - Can be passed the `--release` flag to build and run the release mode binary.
- `cargo check`
    - Checks if the program compiles without actually compiling it.

:::infoPersonal preference:
- Many developers stick to just `cargo init` to avoid confusion.
- During development, `cargo run` is commonly used.
- `cargo check` is handy for quickly verifying if the program compiles.
- `cargo doc` is used to generate documentation for a Rust project based on the code's documentation comments.
:::

## Variable assignment

- Immutable
   - In Rust, variables are **immutable by default**, meaning once a value is assigned to a variable, it cannot be changed.
   - You can declare a variable as mutable using the `mut` keyword if you need to change its value.
- Strongly Typed
   - Rust is a strongly typed language, which means that every variable and expression has a specific type known at compile time.
   - Types are enforced strictly by the compiler, helping to prevent runtime errors and promote code safety.
- `;` Symbol Represents Return Statement
   - In Rust, the semicolon (`;`) is used to terminate statements, including return statements.
   - However, the last expression in a function without a semicolon is implicitly returned as the function's value.

:::infoIf statement can be used for assignment.
The if statement can be used for assignment, here's an example:
```rust
let result = if num % 2 == 0 {
    "even"
} else {
    "odd"
};
```
:::

:::infoShadowing
Shadowing refers to the act of re-declaring a variable within the same scope, effectively hiding the previous variable with a new one of the same name. This allows for changing the type or value of a variable without having to create a new variable name. 

```rust
fn main() {
    let x = 5; // Original variable
    println!("Value of x: {}", x); // Prints: Value of x: 5
    
    let x = "hello"; // Shadowing the variable x with a new value
    println!("Value of x: {}", x); // Prints: Value of x: hello
}
```
In this example, the variable `x` is first declared with a value of `5`, then shadowed with a new value of `"hello"`. The second `println!` statement prints the value of the shadowed variable, `"hello"`.
:::


## Loop and Control Flow

### Loop

In Rust, there are several loop constructs available. Here are examples of each type:

1. `loop`:

```rust
fn main() {
    let mut count = 0;
    loop {
        println!("Count: {}", count);
        count += 1;
        if count == 5 {
            break;
        }
    }
}
```

2. `while`:

```rust
use std:: io;

// This example is a useful application of 'while' because it allows to continue
// asking for user input until the user types a specific word (in this case,
// "stop").
fn main(){
    let mut input = String:: new();
    while input.trim() != "stop" {
        input.clear();
        println! ("Please enter a word (type 'stop' to exit):"); 
        io:: stdin(). read_line(&mut input).expect("Failed to read input"); 
        printin! ("You entered: {}", input);
    }
    println! ("Goodbye!");
}
```

3. `for` (iterating over a range):

```rust
fn main() {
    for count in (0..=5).rev() {
        println!("Count: {}", count);
    }
}
// It will print 5,4,3,2,1,0
```

4. `for_each` (iterating over elements of a collection):

> In Rust, a macro is a way to generate code at compile time, enabling code reuse and abstraction by allowing the definition of custom syntax and code transformations.

```rust
fn main() {
    //vec![] is a marco that generates vector which is like array or list in other languages.
    let numbers = vec![1, 2, 3, 4, 5]; 
    numbers.iter().for_each(|&num| {
        println!("Number: {}", num);
    });
}
```

These are examples of the main loop constructs available in Rust, including `loop`, `while`, `for`, and `for_each`. Each serves a different purpose and can be used depending on the specific requirements of your code.

### match (case)

```rust
fn main{
    let name = "Hello";
    // use of match expression to pattern match against varible "name"
    match name.trim(){
        "Good Bye" => printin! ("Sorry to see you go."),
        "Hello" => println! ("Hi, nice to meet you!"), 
        _ => println!("I can't find a greeting, good bye."),
    }
}
```

## Function

Rust is a functional programming language where functions play a crucial role in development. We will cover how to create and use functions, handle return values, and explored concepts like borrowing. Understanding borrowing is fundamental in Rust, as it ensures efficiency and prevents errors related to ownership transfer. Feeling comfortable with functions, control flow, and borrowing sets a solid foundation for tackling more advanced Rust concepts effectively.

### Argument and types

In Rust, function arguments are the parameters that are passed to a function when it is called. Each argument has a type, which specifies the kind of data that the function expects to receive. Here's an example demonstrating function arguments and types:

```rust
// Define a function named `add` that takes two arguments of type `i32` and returns their sum.
fn add(x: i32, y: i32) -> i32 {
    x + y // Returns the sum of `x` and `y`
}

fn main() {
    let result = add(3, 5); // Call the `add` function with arguments `3` and `5`
    println!("The sum is: {}", result); // Output: The sum is: 8
}
```

In this example:
- The `add` function takes two arguments `x` and `y`, both of type `i32` (a 32-bit signed integer).
- Inside the function, the values of `x` and `y` are added together using the `+` operator.
- The function returns the sum, which is also of type `i32`.
- When calling the `add` function in the `main` function, we provide two integer values `3` and `5` as arguments.
- The result of calling `add(3, 5)` is `8`, which is printed to the console.

:::infoWhat is the type of the main()?
The () type has exactly one value (), and is used when there is no other meaningful value that could be returned. () is most commonly seen implicitly: functions without a -> ... implicitly have return type (), that is, these are equivalent (Ref:[Primitive Type](https://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/std/primitive.unit.html#:~:text=The%20()%20type%2C%20sometimes%20called,without%20a%20%2D%3E%20...)):
```rust
fn long() -> () {}

fn short() {}
```
:::

### Borrowing and ownership

In Rust, ownership and borrowing are key concepts that ensure memory safety and prevent data races. Ownership refers to the ability of a variable to manage the memory it points to, while borrowing allows variables to temporarily borrow references to data without taking ownership.

Key aspects of ownership in Rust include:

- Each value has a single owner: A variable can own a value at any given time.
- Ownership is transferred: When a value is assigned to another variable or passed to a function, ownership is transferred to the new owner.
- Borrowing: Instead of transferring ownership, references (borrowed pointers) can be created to allow temporary access to a value without taking ownership. Below are 2 points to remember:
    - You can't borrow a immutable variable as a mutable.
    - You can't borrow the same variable as mutable more than once.
- Lifetimes: Rust's borrow checker enforces rules to ensure that references do not outlive the values they reference, preventing dangling pointers and memory safety issues.


Let's illustrate these concepts using vectors and strings:

```rust
fn main() {
    // Example of ownership with a vector
    let vec1 = vec![1, 2, 3]; // vec1 owns the vector [1, 2, 3]
    let vec2 = vec1; // Ownership of the vector is transferred to vec2
    // println!("{:?}", vec1); // Error: vec1 no longer owns the vector, so this line will cause a compile error
    println!("{:?}", vec2); // Output: [1, 2, 3]

    // Example of borrowing with a string
    let s1 = String::from("hello"); // s1 owns the string "hello"
    let len = calculate_length(&s1); // Borrow s1's reference to the calculate_length function
    println!("The length of '{}' is {}.", s1, len); // Output: The length of 'hello' is 5
}

// Function that borrows a reference to a string
/*
usize: It is a primitive type of rust based on a pointer like C programming language. 
If we have a type that does not have a definite size, we call those primitive types ‘usize’ in rust or dynamically sized types in rust. 
It is represented as the pointer sized unsigned type in rust. 
The number of bytes required to represent any one of the memory locations can be used to determine the size of this type. 
This cannot be predicted at the compile time; it can only be done at the runtime 
because it does not know how many bite or bytes it will take because it is also termed a dynamic size integer. 
*/
fn calculate_length(s: &String) -> usize {
    s.len() // Returns the length of the string referenced by s
}
```

In the first example, ownership of the vector `vec1` is transferred to `vec2` when `vec1` is assigned to `vec2`. This means that `vec2` becomes the owner of the data, and attempting to use `vec1` afterward will result in a compile-time error.

In the second example, the `calculate_length` function borrows a reference to the string `s1` using the `&` operator. This allows `calculate_length` to access the string's data without taking ownership of it. As a result, `s1` remains valid and usable after the function call.

#### Usage of & symbol 

In Rust, the `&` symbol is used to create references or borrow values. References are a way to allow multiple parts of a program to access the same value without transferring ownership. There are two primary uses of the `&` symbol:

1. **Creating references**: When used before a variable name, `&` creates a reference to the value stored in that variable. For example:
   ```rust
   let x = 5;
   let reference_to_x = &x;
   ```

2. **Borrowing**: When used in function arguments or method parameters, `&` indicates that the function or method is borrowing a reference to the value rather than taking ownership of it. This allows the function or method to access the value without transferring ownership. For example:
   ```rust
   fn print_value(value: &i32) {
       println!("Value: {}", value);
   }
   ```

In both cases, the `&` symbol is used to create references, either directly or when specifying function parameters.

#### Copy and reference

Here's a table summarizing how different types behave when passed to a function:

| Type       | Behavior                                      |
|------------|-----------------------------------------------|
| Scalar types (e.g., integers, floats, booleans)  | Data is copied when passed to a function        |
| Copy types (e.g., integers, booleans, char)     | Data is copied when passed to a function        |
| Compound types (e.g., arrays, tuples)           | Data is copied when passed to a function        |
| String      | Reference is borrowed when passed to a function | 
| Vector      | Reference is borrowed when passed to a function | 

Scalar types, such as integers and booleans, are always copied when passed to a function because they have a fixed size and are stored on the stack. Copy types behave similarly to scalar types and are also copied when passed to a function. Compound types, such as arrays and tuples, are copied entirely when passed to a function.

On the other hand, string and vector types are dynamically sized and stored on the heap, so passing them to a function would require transferring ownership or borrowing a reference to the data to avoid moving the data out of scope. Therefore, strings and vectors are borrowed when passed to a function to avoid transferring ownership and maintain memory safety.

:::infoWhy copying only for some types only?
Rust is going to copy the value because that's very cheap to do, so you don't have to worry about it. But the same thing with booleans, but with strings, not so much because the size of the string is not known at the compilation time. Rust can be confident of just copying that value.
:::

### Raise and error

In Rust, the `panic!` macro is typically used to indicate unrecoverable errors or exceptional situations that should cause the program to terminate immediately. Here's an example scenario where using `panic!` to raise an error would be appropriate:

```rust
fn divide(a: i32, b: i32) -> i32 {
    if b == 0 {
        panic!("Attempted to divide by zero!"); // Raise an error if dividing by zero
    }
    a / b // Return the result of the division
}

fn main() {
    let dividend = 10;
    let divisor = 0;

    let result = divide(dividend, divisor); // Call the divide function
    println!("Result of division: {}", result);
}
```

In this example, the `divide` function attempts to perform integer division between two numbers `a` and `b`. However, if `b` is zero, it would result in a division by zero error, which is undefined behavior in Rust. Therefore, to handle this scenario, the function uses `panic!` to raise an error with a descriptive message indicating the attempted division by zero.

When running the program with `divisor` set to zero, it will panic and terminate immediately, displaying the error message `"Attempted to divide by zero!"`. This ensures that the program stops execution and reports the error, preventing further execution with invalid data.

In summary, `panic!` should be used in Rust to indicate severe errors or exceptional situations where continuing execution would lead to undefined behavior or data corruption.

### Error Handling with Rust's Match

Here's an example of using the `match` expression to handle an error in Rust:

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file_contents(filename: &str) -> Result<String, io::Error> {
    let mut file = File::open(filename)?; // Open the file and handle potential errors

    let mut contents = String::new();
    file.read_to_string(&mut contents)?; // Read file contents into a string and handle potential errors

    Ok(contents) // Return the contents if successful
}

fn main() {
    let filename = "nonexistent_file.txt";
    
    // Call the read_file_contents function and handle potential errors using match
    match read_file_contents(filename) {
        Ok(contents) => println!("File contents: {}", contents), // Print file contents if successful
        Err(error) => match error.kind() {
            io::ErrorKind::NotFound => {
                eprintln!("File not found: {}", filename); // Print error message if file not found
            }
            _ => {
                eprintln!("Error reading file: {}", error); // Print generic error message for other errors
            }
        },
    }
}
```

In this example:
- The `read_file_contents` function attempts to open a file, read its contents into a string, and return the string. It returns a `Result` type, where `Ok(contents)` contains the file contents if successful, and `Err(error)` contains an error if an error occurs during file operations.
- In the `main` function, we call `read_file_contents` with the filename `"nonexistent_file.txt"`.
- We use the `match` expression to handle the `Result` returned by `read_file_contents`. If the result is `Ok`, we print the file contents. If the result is `Err`, we use nested `match` expressions to handle different kinds of errors. In this example, we check if the error is due to the file not being found (`NotFound`) and print a specific error message for that case. For other errors, we print a generic error message.


## Structured data

In Rust, data can be organized into structures using the `struct` keyword. A struct is similar to organizing data in JavaScript objects or Python dictionaries. Structuring data using the `struct` type provides a robust framework for organizing and ordering data, a feature I particularly appreciate in the Rust programming language. 

Beyond simple mapping, similar to Python dictionaries or hash maps, Rust allows for extending and enhancing struct functionality. This unique capability enables the incorporation of additional helper functions and facilities, enhancing data transformation and making structs exceptionally powerful for various applications.

### Structs instance and Debug mode

Sure, here's an example demonstrating the use of `struct` and `derive(Debug)` in Rust:

```rust
// Define a struct named `Person` with two fields: `first_name` of type `String` and `age` of type `u32`
#[derive(Debug)] // Automatically implement the Debug trait for the Person struct
struct Person {
    first_name: String,
    last_name: String,
    age: Option<u32>,
}

fn main() {
    // Create an instance of the Person struct
    let person1 = Person {
        first_name: String::from("Sai"),
        last_name: String::from("Tai"),
        age: None,  // or you can use - age: Some(30),
    };

    // Print the person1 struct using the Debug format
    println!("{:?}", person1);
    println!("The person's name is {}", first_name);
    println!("The person's age is {:?}", age);
}
```

In this example:
- We define a `Person` struct with 3 fields: `first_name` and `last_name` of type `String` and `age` of type `u32`.
- We use `#[derive(Debug)]` attribute to automatically implement the `Debug` trait for the `Person` struct, which allows us to print the struct using the `{:?}` format specifier.
- We then print the `person1` struct using the `println!` macro with the `{:?}` format specifier, which invokes the `Debug` implementation to print the struct's contents in a debug format.


### Structs and Constructor

:::infoWhat is self?
In Rust, `Self` and `self` are not the same thing. `Self` refers to the implementing type in trait definitions, while `self` refers to the current instance of a struct or enum in method definitions. :

1. **Self**: `Self` (with a capital "S") is a special keyword used to refer to the type in which it is used. It is often used in trait definitions and implementations to denote the implementing type.

   ```rust
   trait Example {
       fn example_method() -> Self; // Self refers to the implementing type
   }
   ```

2. **self**: `self` (with a lowercase "s") is a keyword used to represent the current instance of a struct or enum in method definitions and implementations. It is similar to `this` in other programming languages.

   ```rust
   impl Rectangle {
       fn area(&self) -> u32 {
           self.width * self.height // self refers to the current instance of Rectangle
       }
   }
   ```

:::

Below is an example of using `Self`, `self`, `struct` and `constructor`.

```rust
// Define a struct named `Rectangle` to represent a rectangle
struct Rectangle {
    width: u32,
    height: u32,
}

// Implement a constructor for the Rectangle struct
impl Rectangle {
    // Constructor that takes width and height as parameters
    fn new(width: u32, height: u32) -> Self {
        Self { width, height } // Return a new Rectangle instance
    }

    // Constructor that creates a square with equal width and height
    fn square(size: u32) -> Self {
        Self { width: size, height: size } // Return a new Rectangle instance
    }

    fn dobule_size(&mut self){
        self.width = 2*self.width;
    }

    // Method to calculate the area of the rectangle
    fn area(&self) -> u32 {
        self.width * self.height // Return the area of the rectangle
    }
}

fn main() {
    // Create a new Rectangle instance using the new constructor
    let mut rect1 = Rectangle::new(10, 20);
    println!("Area of rect1: {}", rect1.area()); // Output: Area of rect1: 200
    rect1.dobule_size();
    println!("Updated area of rect1: {}", rect1.area()); // Output: Area of rect1: 400

    // Create a new square using the square constructor
    let square1 = Rectangle::square(5);
    println!("Area of square1: {}", square1.area()); // Output: Area of square1: 25
}
```

### Tuple

In Rust, a tuple is a fixed-size ordered collection of heterogeneous elements. Unlike arrays, tuples can contain elements of different types. Tuples are defined using parentheses and can store values of any type, including other tuples.

An example demonstrating how to use a tuple in Rust:

```rust
fn main() {
    // Define a tuple with two elements
    let person: (u32, &str) = (30, "John");

    // Access elements of the tuple using indexing
    let age = person.0;
    let name = person.1;

    // Print the tuple elements
    println!("Age: {}", age);   // Output: Age: 30
    println!("Name: {}", name); // Output: Name: John
}
```

## String and Victor

In Rust, strings and vectors are common data structures. There 2 primary types of strings, one is `string slices` and the other is just called `strings`, often used interchangeably. Understanding their differences and working with both is important. Vectors, similar to lists in other languages, are collections that allow dynamic item storage and manipulation. Learning how to add, modify, and retrieve values from vectors is essential for effective Rust programming.

### String Slices and String

> TL;DT - String slices are **immutable** references to portions of strings, while strings provide **mutable**, **dynamic/growable** string storage with ownership semantics.

Here's an example demonstrating string slices and string:

```rust
fn print_type_of<T>(_: &T){
    println!("Type: {}", std::any::type_name::<T>())
}

fn main() {
    // String slice example
    let greeting = "Hello, world!"; // String slice
    let slice = &greeting[0..=4]; // Take a slice of the first 5 characters(= equals inclusive)
    println!("First string slice: {}", slice); // Output: "Hello"

    // Owned string (String) example
    let mut s = String::from("Rust is ");
    s.push_str("awesome!"); // Append a string slice to the owned string
    println!("Owned string: {}", s); // Output: "Rust is awesome!"

    // Convert String Slice to String 
    let convert_slince_to_string = "Sai is learning Rust".to_string();
    print_type_of(&convert_slince_to_string); // Type: alloc::string::String
 
    let sentence = String::from("Hello, world! This is a sentence");
    let words: Vec<&str> = sentence.split_whitespace().collect();
    println!("{:?}", words); // ["Hello,", "world!", "This", "is", "a", "sentence."]
}
```

Differences between string slices and owned strings:

- Ownership:
   - String slices (`&str`) are references to a portion of a string literal or an owned string. They don't have ownership and are therefore **immutable**.
   - Owned strings (`String`) have ownership of their data and are mutable. They are dynamically allocated on the heap and **can grow or shrink as needed**.
- Memory Allocation:
   - String slices point to a portion of memory containing the string's characters. They have a fixed size and cannot be modified.
   - Owned strings are stored on the heap, allowing them to be dynamically resized and modified.
- Usage:
   - String slices are commonly used to reference substrings within a larger string or to pass portions of strings to functions.
   - Owned strings are used when dynamic string manipulation, such as concatenation or modification, is required.

### Victor

In Rust, vectors (`Vec<T>`) are typically used when you need to store and manage a dynamically sized collection of elements. Here are some common operational actions of victor.

```rust
fn main() {
    // Create a vector of integers
    let mut numbers = vec![1, 2, 3, 4, 5];

    // Get the last element of the vector
    if let Some(last) = numbers.last() {
        println!("Last element: {}", last); // Output: Last element: 5
    }

    // Unwrap the last element of the vector
    // Unwrap means: Give me the result of the computation, and if there was an error, panic and stop the program. 
    let last_element = numbers.pop().unwrap();
    println!("Unwrapped last element: {}", last_element); // Output: Unwrapped last element: 5

    // Get the first element of the vector
    if let Some(first) = numbers.first() {
        println!("First element: {}", first); // Output: First element: 1
    }

    // Match on the length of the vector
    match numbers.len() {
        0 => println!("Vector is empty"),
        len => println!("Vector has {} elements", len), // Output: Vector has 4 elements
    }

    // ================ Push, Append, Extend, Insert ================
    // Push a new element to the end of the vector
    numbers.push(6);
    println!("Vector after push: {:?}", numbers); 
    // Output: Vector after push: [1, 2, 3, 4, 6]

    // Append another vector to the end of the vector
    let mut more_numbers = vec![7, 8, 9];
    numbers.append(&mut more_numbers);
    println!("Vector after append: {:?}", numbers); 
    // Output: Vector after append: [1, 2, 3, 4, 6, 7, 8, 9]

    // Extend the vector with elements from an iterator (from 10 to 12)
    numbers.extend(10..=12);
    println!("Vector after extend: {:?}", numbers); 
    // Output: Vector after extend: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12]

    // Insert an element at a specific index
    numbers.insert(5, 5);
    println!("Vector after insert: {:?}", numbers); 
    // Output: Vector after insert: [1, 2, 3, 4, 6, 5, 7, 8, 9, 10, 11, 12]
}
```

## Enums and Variants

Enums (enumerations) in Rust are a way to define a type by enumerating its possible variants. Here's how you can use enums in Rust to represent disk sizes and disk types:

:::infoEnums vs Victor
Enums and vectors serve different purposes in Rust, so they are used in different contexts.

Use an enum when:
1. You have a fixed set of possible values that a variable can take.
2. Each value represents a distinct variant or state.
3. You want to enforce type safety by restricting the possible values.

Use a vector when:
1. You need a dynamically sized collection of items.
2. You want to store multiple values of the same type.
3. You need to add, remove, or modify elements dynamically during runtime.
4. You want to iterate over the elements or perform operations on the collection as a whole.

In summary, use enums when you have a fixed set of distinct variants, while use vectors when you need a dynamic collection of values that can grow or shrink at runtime.
:::

### Use enums with struct

Here's an example demonstrating how to use enums with structs in Rust:

```rust
#[derive(Debug)]
// Define an enum for disk type
enum DiskType {
    HDD,
    SSD,
}

// Define a struct for disk
struct Disk {
    size_gb: u32,
    disk_type: DiskType,
}

fn main() {
    // Create a disk instance
    let my_disk = Disk {
        size_gb: 512,
        disk_type: DiskType::SSD,
    };

    // Match on the disk type and print the corresponding message
    match my_disk.disk_type {
        DiskType::HDD => println!("Disk type: HDD"),
        DiskType::SSD => println!("Disk type: SSD"),
    }
}
```

In this example:
- We define an enum `DiskType` with two variants: `HDD` and `SSD`, representing different types of disk drives.
- We define a struct `Disk` with two fields: `size_gb` to store the size of the disk in gigabytes and `disk_type` to store the type of the disk as a `DiskType` enum variant.
- In the `main` function, we create an instance of `Disk` named `my_disk` with a size of 512 gigabytes and a type of `SSD`.
- We use a `match` expression to match on the `disk_type` field of `my_disk`. Depending on the variant of `disk_type`, we print out the corresponding message indicating the disk type.


### Use enums with impl

In Rust, `impl` is a keyword used to implement traits or define methods for a particular struct, enum, or trait. It allows developers to define the behavior associated with types, enabling code reuse and providing a way to organize functionality within Rust programs. By using `impl`, developers can define methods, associated functions, and trait implementations, enhancing the flexibility and expressiveness of their Rust code.

Here's an example demonstrating the use of enum and file size formatting unit in Rust:


```rust
// Define an enum for file size unit
enum SizeUnit {
    Bytes,
    Kilobytes,
    Megabytes,
    Gigabytes,
}

// Define a struct for file
struct File {
    size: u64, // Size in bytes
}

impl File {
    // Method to format file size in a human-readable format
    fn format_size(&self) -> (f64, SizeUnit) {
        let mut size = self.size as f64;
        let mut unit = SizeUnit::Bytes;

        if size >= 1024.0 {
            size /= 1024.0;
            unit = SizeUnit::Kilobytes;
        }
        if size >= 1024.0 {
            size /= 1024.0;
            unit = SizeUnit::Megabytes;
        }
        if size >= 1024.0 {
            size /= 1024.0;
            unit = SizeUnit::Gigabytes;
        }

        (size, unit)
    }
}

fn main() {
    let my_file = File { size: 56789123 }; // File size in bytes

    let (formatted_size, unit) = my_file.format_size();

    // Match on the file size unit and print the human-readable format
    // Output: File size: 54.16 MB
    match unit {
        SizeUnit::Bytes => println!("File size: {:.2} bytes", formatted_size),
        SizeUnit::Kilobytes => println!("File size: {:.2} KB", formatted_size),
        SizeUnit::Megabytes => println!("File size: {:.2} MB", formatted_size),
        SizeUnit::Gigabytes => println!("File size: {:.2} GB", formatted_size),
    }
}
```

In this example:
- We define an enum `SizeUnit` with variants representing different file size units (Bytes, Kilobytes, Megabytes, Gigabytes).
- We define a struct `File` with a field `size` representing the size of the file in bytes.
- We implement a method `format_size` for the `File` struct to convert the file size into a human-readable format, returning a tuple containing the formatted size and the corresponding size unit.
- In the `main` function, we create an instance of `File` named `my_file` with a size of 56789123 bytes.
- We call the `format_size` method on `my_file` to obtain the formatted size and unit.
- We use a `match` expression to match on the file size unit (`SizeUnit`) and print the human-readable format accordingly.


### Use enums with vic

```rust
enum Shape {
    Circle(f64), 
    Square (f64),
}

fn main () {
    let shapes = vec! [Shape:: Circle(5.0), Shape:: Square (3.0)];
    
    let total_area: f64 = shapes
        .iter()
        .map(|shape| match shape {
            Shape:: Circle(radius) => std::f64::consts::PI * radius * radius,
            Shape:: Square (length) => length *length,
        })
        .sum();

    // Output: Total area: 87.53981633974483 sq. units
    println! ("Total area: {} sq. units", total_area);
}
```

Let's take a closer look at the `.map(|shape| match shape { ... })` part.

1. The `map` function is being called on the iterator of `shapes`.
2. For each element in the `shapes` vector, the provided closure `(|shape| match shape { ... })` is applied.
3. Inside the closure, the `match` expression is used to pattern match on each `shape` enum variant.
4. Depending on the variant of the `shape`, the corresponding area calculation is performed:
   - If the shape is a `Circle`, the area of the circle is calculated using the formula: π * radius * radius.
   - If the shape is a `Square`, the area of the square is calculated using the formula: length * length.
5. The calculated area value for each shape is returned by the closure and stored in a new iterator.
6. Finally, the `sum` function is called on the iterator of calculated areas to obtain the total area of all shapes.

So, this part of the code calculates the area for each shape in the `shapes` vector using a match expression within a closure passed to the `map` function, and then sums up all the individual areas to get the total area.


### Use enums with match

When using `match` with an enum in Rust, you cannot skip matching conditions for each enum variant. Rust requires **exhaustive pattern** matching for enums, meaning that you must handle all possible variants of the enum within the `match` expression. Skipping any variant would result in a compilation error.

This behavior ensures that all possible cases are handled explicitly, promoting safer and more predictable code. If you want to ignore specific enum variants, you can use the `_` wildcard pattern to match any value without performing any specific action for that variant.

```rust
enum WineGrapes{
    CabernetFranc, 
    Tannat, 
    Merlot,
} 

fn taste_wine(grapes: WineGrapes) {
    match grapes {
        WineGrapes::CabernetFranc => println! ("This is a Cabertnet Franc wine."),
        WineGrapes::Tannat => println! ("This is a Tannat wine."),
        _ => println! ("This is not a Cabernet Franc wine."),
        // WineGrapes: :Merlot => println! ("This is a Merlot wine."),
    }
}

fn main() {
    taste_wine (WineGrapes::Merlot);
    // Output: This is not a Cabernet Franc wine.
}
```



### Option & Some

In Rust, Option is an enumeration that represents the presence or absence of a value. It has two variants: `Some(T)`, indicating that a value of type T is present, and `None`, indicating that no value is present.

They are closely related as `Some` is used to wrap values when they are present, while `None` is used to indicate absence of a value. Here are 2 examples demonstrating the use of `Option` and `Some`:

#### Example 1

```rust
fn main() {
    let x = Some(5); // An Option type with a value
    let y: Option<Option<()>> = Some(None);    // An Option type with no value

    if let Some(value) = x {
        println!("Value of x: {}", value); // Output: Value of x: 5
    } else {
        println!("No value for x");
    }

    if let Some(value) = y {
        println!("Value of y: {:?}", value);
    } else {
        println!("No value for y"); // Output: No value for y
    }
}

/*Result:
Value of x: 5
Value of y: None
*/
```

- The variable `x` is assigned the value `Some(5)`, indicating that it contains a value of `5`.
- The variable `y` is of type `Option<Option<()>>` and is assigned `Some(None)`, indicating that it contains no value.

#### Example 2
```rust
//  [IMPORTANT] Option<i32>:  represent this fn can return None of i32
fn divide(x: i32, y: i32) -> Option<i32> {
    if y == 0 {
        None // Division by zero is not allowed, return None
    } else {
        Some(x / y) // Return the result of division wrapped in Some
    }
}

fn main() {
    let result1 = divide(10, 2); // Result: Some(5)
    let result2 = divide(10, 0); // Result: None

    match result1 {
        Some(value) => println!("Result1: {}", value),
        None => println!("Result1: Division by zero"),
    }

    match result2 {
        Some(value) => println!("Result2: {}", value),
        None => println!("Result2: Division by zero"),
    }
    
    // unwarp returns the contained Some value, consuming the self value.
    // Because this function may panic, its use is generally discouraged.
    println!("Result2: {:?}", result2.unwrap())
}
```

In this example:
- The `divide` function takes two integers `x` and `y` as input and attempts to divide `x` by `y`. If `y` is zero, it returns `None` to indicate division by zero is not allowed. Otherwise, it returns `Some(result)` where `result` is the result of the division.
- In the `main` function, we call `divide` twice: once with valid inputs (10 and 2) and once with an invalid input (10 and 0).
- We use `match` expressions to pattern match on the results. If the result is `Some(value)`, we print the value. If the result is `None`, we print a message indicating division by zero.


## Create a library


### cargo doc

Try to use `cargo doc` to create document for your function and library file.

```rust
//! ====== This part is for cargo doc to genereate a document ======
//! ================= when creating a library page section ================

use std::io::{BufReader, BufRead};
use clap::Parser;

#[derive(Parser)]
#[command(name = "resplit")]
#[command(version = "0.0.1")]
#[command(author = "Alfredo Deza")]
#[command(about = "Split strings by one or more delimeters and return a field, like cut")]

pub struct Cli {
    #[arg(short('f'))]
    field: usize,
    #[arg(short('d'))]
    delimeter: String,
    #[arg(long)]
    debug: bool,
}

/// ====== This part is for cargo doc to genereate a document ======
/// ========== when creating a function section ==========
/// This function reads a line from stdin and returns it as a String.
/// It will panic if it fails to read a line with a message "Failed to read input line".
/// # Examples:
/// ```
// let input = read_stdin():
/// ```
///***
pub fn read_stdin() -> String {

    let stdin = std::io::stdin();
    let mut reader = BufReader::new(stdin.lock());
    let mut line = String::new();

    // BufRead provides read_line()
    reader.read_line(&mut line).expect("Failed to read input line");
    line.trim().to_string()
}
```


### Debug

The CodeLLDB extension in the Visual Studio Code IDE for debugging Rust programming provides enhanced debugging capabilities, leveraging the LLDB debugger, allowing users to debug Rust code efficiently within the VS Code environment.

Try to use debug mode and set a breakpoint on the line `println! ("Please enter a word (type 'stop' to exit):");` to fix the line position of `input.clear ();`. The current version of the code won't be able to stop the loop since its position is wrong.

```rust
use std::io;

fn main () {
    let mut input = String::new();
    while input.trim() != "stop" {
        println! ("Please enter a word (type 'stop' to exit):");
        io::stdin().read_line(&mut input).expect("Failed to read input"); 
        println! ("You entered: {}", input);
        input.clear ();
    }
    println! ("'Goodbye!");
}
```