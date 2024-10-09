---
title: The basic of pyenv
---

# How to Use `pyenv`: Practical Tips and Commands

If you’re familiar with Python and virtual environments but new to `pyenv`, this guide will walk you through the essential commands and practical tricks for managing multiple Python versions seamlessly. 

## Python versions 

### Listing Available Python Versions
After installing `pyenv`, you can list all the available versions of Python (those already installed on your machine) using:

```bash
pyenv versions
```

This shows all the Python versions managed by `pyenv` as well as any virtual environments you’ve created. The active version will have an asterisk (`*`) next to it.

### Installing a New Python Version
To install a specific version of Python, use:

```bash
pyenv install <version>
```

For example, to install Python 3.12.4:

```bash
pyenv install 3.12.4
```

This will download, compile, and install that version. You can then switch between it and other versions easily.

### Setting a Global Python Version
If you want to set a default Python version for your entire system, you can do so with the `global` command. For example:

```bash
pyenv global 3.12.4
```

This sets Python 3.12.4 as the default for all your projects unless you override it locally. Now, whenever you run `python`, this version will be used.

To verify, simply run:

```bash
python --version
```

### Setting a Local Python Version (Per Project)
For project-specific Python versions, use the `local` command. This allows you to define a Python version that applies only within a certain directory:

```bash
cd myproject
pyenv local 3.10.0
```

This command creates a `.python-version` file in the project directory, and when you're working within this directory, `pyenv` will automatically use Python 3.10.0. This is particularly useful when different projects require different versions of Python.

### Setting a terminal-session Python Version
To switch between installed Python versions, use the `global` or `local` commands, as shown above. But if you just want to temporarily switch Python versions for the current terminal session:

```bash
pyenv shell 3.8.5
```

This changes the Python version only for the duration of the current shell session. Once you exit the shell, the version will revert back to the global or local setting.


### Rehashing
Whenever you install a new Python version or virtual environment, you should run:

```bash
pyenv rehash
```

This updates `pyenv`'s shims so that the newly installed Python versions and commands become available immediately.

## Virtual Environment

### Creating a Virtual Environment
`pyenv` also works well with `virtualenv` via the `pyenv-virtualenv` plugin. You can create virtual environments tied to specific Python versions.

For example, to create a virtual environment using Python 3.12.4:

```bash
pyenv virtualenv 3.12.4 myenv
```

Now, you can activate it with:

```bash
pyenv activate myenv
```

And deactivate it with:

```bash
pyenv deactivate
```

### Activating a Virtual Environment Automatically
If you want a virtual environment to be automatically activated when you enter a specific directory (like your project folder), combine the `pyenv local` and `pyenv virtualenv` commands. For example:

```bash
cd myproject
pyenv local myenv
```

This will ensure the virtual environment `myenv` is automatically activated when you navigate to your project folder.

### Uninstalling a Python Version or Virtual Environment
To remove a Python version, use:

```bash
pyenv uninstall 3.12.4
```

To remove a virtual environment, run:

```bash
pyenv virtualenv-delete myenv
```

This ensures you’re not cluttering your system with old Python versions or environments that are no longer in use.

## Common Commands Summary

| **Command**                               | **Description**                                    |
|-------------------------------------------|----------------------------------------------------|
| `pyenv versions`                          | List all installed Python versions and environments|
| `pyenv install <version>`                 | Install a specific version of Python               |
| `pyenv global <version>`                  | Set a global Python version                        |
| `pyenv local <version>`                   | Set a Python version for a specific project        |
| `pyenv shell <version>`                   | Temporarily switch to a specific Python version    |
| `pyenv virtualenv <version> <env-name>`   | Create a virtual environment for a specific Python version |
| `pyenv activate <env-name>`               | Activate a virtual environment                     |
| `pyenv deactivate`                        | Deactivate the current virtual environment         |
| `pyenv uninstall <version>`               | Uninstall a specific Python version                |
| `pyenv virtualenv-delete <env-name>`      | Delete a virtual environment                       |
| `pyenv rehash`                            | Rebuild `pyenv`'s shims after installing new versions|

## Practical Tips

- **Use `pyenv local` in each project**: It’s a good practice to use `pyenv local` to define specific Python versions for each project, ensuring that your projects are isolated and won’t face version conflicts.
- **Virtual Environments**: Always use `pyenv virtualenv` to create virtual environments tied to specific Python versions, which makes it easy to manage dependencies and isolate your project environments.
- **Remember to rehash**: Anytime you install new versions or packages that add new binaries, run `pyenv rehash` to ensure `pyenv` knows about them.
- **Aliases**: If you frequently work with certain Python versions or environments, consider setting up aliases in your shell configuration to speed up activation.

By mastering these commands and tips, you can efficiently manage Python versions and virtual environments with `pyenv`.