---
title: Debugging in Python
---

In the Python debugger (such as in VSCode or when using `pdb`), the terms **special variables** and **function variables** refer to different types of information available during debugging. Here’s a breakdown of what each category means:

### 1. **Special Variables**:
   - **Definition**: These are internal Python variables and objects that provide context about the current runtime environment, such as the state of the current stack, module-level attributes, or system-level details.
   - **Common Examples of Special Variables**:
     - **`__name__`**: This is the name of the current module. If the code is running as the main program, its value will be `"__main__"`. Otherwise, it will be the module’s name.
     - **`__file__`**: The file path of the currently executing script.
     - **`__doc__`**: The docstring of the current module or function.
     - **`__package__`**: The package that contains the current module.
     - **`__builtins__`**: A reference to Python’s built-in namespace (such as `print`, `int`, `str`, etc.).
     - **`__annotations__`**: A dictionary holding function annotations, if any.

   **Purpose**:
   - These variables are typically used to provide context about the environment in which the code is running. They are not user-defined but are automatically present in the Python runtime.

   **When to Use**:
   - Debugging at a meta-level: understanding the environment (e.g., which module is being executed, checking whether you're in a script vs. a module).

### 2. **Function Variables**:
   - **Definition**: These are the variables defined inside the current function, class, or scope. These can be **local variables**, **arguments** passed to the function, or **instance variables** (within a class method).
   - **Common Examples of Function Variables**:
     - Variables defined within a function or method.
     - Parameters passed to a function or method.
     - Variables created through loops, conditionals, or operations within the function.
     - `self` or `cls` within class methods (for object-oriented code).
   
   **Purpose**:
   - Function variables represent the core data that your function is operating on. When debugging, these are often the most relevant variables, as they provide insight into the current state of the computation.

   **When to Use**:
   - Debugging the logic and behavior of your code. Function variables help you understand what values your code is working with, whether parameters are passed correctly, and if variables hold the expected data.

### Example Breakdown:

Let’s consider an example to clarify:

```python
class ExampleClass:
    def __init__(self, value):
        self.value = value
    
    def add_to_value(self, increment):
        result = self.value + increment
        return result

if __name__ == "__main__":
    example = ExampleClass(10)
    print(example.add_to_value(5))
```

When debugging inside the `add_to_value` method:

- **Function Variables**:
  - `self`: Refers to the current instance of `ExampleClass`.
  - `increment`: The argument passed to the function (in this case, `5`).
  - `result`: A local variable storing the result of the addition (`self.value + increment`).

- **Special Variables**:
  - `__name__`: This would be `"__main__"` since the script is being executed directly.
  - `__file__`: The path to the file where this code resides.
  - `__doc__`: If a docstring is provided, this will contain the string. Otherwise, it will be `None`.

### Key Differences:

- **Scope and Usage**:
  - **Special Variables** are typically system-level and related to the environment or module being executed. They are present in every Python script and provide contextual information.
  - **Function Variables** are the user-defined variables that exist within the function or method's local scope. They represent the core of the logic you are debugging and manipulating.

- **Relevance**:
  - When debugging your application’s logic, you will mostly be interested in **function variables** because they reflect the state of your program at a specific point.
  - **Special variables** are more useful when you need to understand the broader environment or execution context (e.g., whether your script is running as a standalone program or part of a module).

### Conclusion:
- **Function Variables**: These are the key variables in your function or method that influence the logic of your program.
- **Special Variables**: These provide contextual information about the Python runtime and environment, offering insights into the execution context (e.g., module name, file path).

Let me know if you need more details on how to use them in your debugging workflow!