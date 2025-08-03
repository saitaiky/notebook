---
title: "Managing Python Projects with Poetry (and a Bit of pyenv)"
---

# Managing Python Projects with Poetry (and a Bit of pyenv)

If you're tired of juggling virtual environments, editing `requirements.txt` by hand, or worrying about dependency conflicts, Poetry offers a modern, all-in-one solution for Python project management. It handles dependency resolution, virtual environments, and packaging, all through a single CLI interface. Unlike traditional workflows where you use `venv` or `virtualenv` alongside separate tools for dependency management and publishing, Poetry is purpose-built to manage the full lifecycle of a Python project—cleanly and reproducibly.

## Getting Started with Poetry

To install Poetry, run the official installation script:

```bash
curl -sSL https://install.python-poetry.org | python3 -
````

Once installed, confirm that it's available with:

```bash
poetry --version
```

Poetry uses the `pyproject.toml` format, a modern standard for Python project configuration. You can create a new project scaffold with:

```bash
poetry new myproject
```

This generates a minimal but complete structure including tests, a package folder, and the necessary metadata. For an existing project, simply run `poetry init` and follow the prompt to define dependencies.

## Managing Dependencies and Virtual Environments

Poetry automatically manages a virtual environment for each project. When you run `poetry install`, it creates an isolated environment, resolves and installs dependencies based on your `pyproject.toml`, and locks them with exact versions in `poetry.lock`. You never need to touch `pip` or `venv` directly.

To install packages, use:

```bash
poetry add requests
```

Dev-only dependencies like linters or test frameworks can be added with:

```bash
poetry add --dev pytest black
```

You can run scripts or Python files inside the managed environment with:

```bash
poetry run python script.py
```

Or open an interactive shell inside the environment:

```bash
poetry shell
```

This workflow ensures isolation, reproducibility, and avoids cluttering your global Python installation.

## Using Poetry with pyenv

Poetry handles environments and dependencies well—but it does not manage which versions of Python are available on your system. That’s where `pyenv` comes in. It lets you install and switch between multiple Python versions without affecting your system Python.

For example, you can install Python 3.12.4 using:

```bash
pyenv install 3.12.4
pyenv local 3.12.4
```

Poetry will automatically detect and use the local version specified by `pyenv`. Alternatively, you can explicitly tell Poetry which Python version to use:

```bash
poetry env use 3.12
```

This is particularly useful when you're working across projects that require different Python versions, or when setting up reproducible environments for CI pipelines.

## Best Practices and Tips

Let Poetry manage your dependencies, environments, and packaging. You should commit both `pyproject.toml` and `poetry.lock` to version control to guarantee reproducibility across teams or machines. Avoid activating virtual environments manually—use `poetry run` or `poetry shell` to interact with them. In `pyproject.toml`, define your Python constraint clearly (e.g., `python = "^3.12"`), so Poetry can resolve compatible versions consistently.

Use `pyenv` when you need fine-grained control over Python versions, such as when testing libraries against multiple Python versions or aligning your development environment with production constraints.

## Summary of Key Commands

```bash
# Install poetry
curl -sSL https://install.python-poetry.org | python3 -

# Create a new project
poetry new myproject

# Initialise poetry in an existing project
poetry init

# Add packages
poetry add requests
poetry add --dev pytest

# Create or activate the environment
poetry install
poetry shell

# Run commands inside the virtual environment
poetry run python script.py

# Use pyenv to install and pin Python versions
pyenv install 3.12.4
pyenv local 3.12.4
poetry env use 3.12
```

Poetry brings clarity, consistency, and convenience to Python development. When combined with `pyenv` for version control, it forms a robust and modern toolchain that scales from small scripts to production-ready libraries. Rather than managing environments, dependencies, and packaging with different tools, you can rely on Poetry to unify the experience and make your Python projects easier to work with—and easier to share.
