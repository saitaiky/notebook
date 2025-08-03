---
title: Editable install
---

### **Understanding Editable Installs in Python**

In Python, an editable install allows you to install a package in such a way that changes to the source code are immediately reflected in the installed package without needing to reinstall it. This is particularly useful during development when you are actively modifying the code and want to test changes without the overhead of reinstalling the package each time.


### **What is an Editable Install?**

An editable install is a feature provided by `pip` that allows you to install a package in "editable" mode. When a package is installed in editable mode, a special link is created in the site-packages directory pointing to the source code directory. This means that any changes made to the source code are immediately available to the installed package.


### **How to Create an Editable Install**

To create an editable install, you use the `-e` or `--editable` flag with `pip install`. Here’s how you can do it:

1. **Navigate to the Package Directory**: Open your terminal and navigate to the directory containing your package's 

setup.py

 file.

2. **Run the Editable Install Command**: Use the following command to install the package in editable mode:

   ```bash
   pip install -e .
   ```

   The `.` indicates the current directory. You can also specify a relative or absolute path to the package directory.


### **Example**

Suppose you have a Python package located at `/path/to/your/package`. To install it in editable mode, you would run:

```bash
pip install -e /path/to/your/package
```


### **Benefits of Editable Installs**

1. **Immediate Reflection of Changes**: Any changes made to the source code are immediately available without needing to reinstall the package.
2. **Convenient for Development**: Editable installs are particularly useful during development when you are frequently modifying the code and testing changes.
3. **Simplifies Collaboration**: When working in a team, editable installs allow team members to work on the same codebase and see changes in real-time.


### **How Editable Installs Work**

When you install a package in editable mode, `pip` creates a special file called `easy-install.pth` in the site-packages directory. This file contains a path to the source code directory, effectively linking the installed package to the source code.


### **Using Editable Installs with setup.py**

Editable installs are typically used with packages that have a setup.py file. Here’s an example of a simple  setup.py file:

```python
from setuptools import setup, find_packages

setup(
    name='mypackage',
    version='0.1',
    packages=find_packages(),
    install_requires=[
        # List your package dependencies here
    ],
)
```

To install this package in editable mode, navigate to the directory containing setup.py and run:

```bash
pip install -e .
```


### **Using Editable Installs with pyproject.toml**

With the introduction of PEP 517 and PEP 518, you can also use pyproject.toml for package configuration. Here’s an example:

```toml
[build-system]
requires = ["setuptools", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "mypackage"
version = "0.1"
dependencies = [
    # List your package dependencies here
]
```

To install this package in editable mode, navigate to the directory containing pyproject.toml and run:

```bash
pip install -e .
```


### Removing an Editable Install

To remove an editable install, you can use the `pip uninstall` command:

```bash
pip uninstall mypackage
```

This will remove the package from the site-packages directory, including the special link created by the editable install.


### Conclusion

Editable installs are a powerful feature in Python that facilitate development by allowing immediate reflection of code changes. By using the `-e` flag with `pip install`, you can create an editable install that links the installed package to the source code, making it easier to develop, test, and collaborate on Python projects.


### Further Reading

- [Python Packaging User Guide](https://packaging.python.org/)
- [Setuptools Documentation](https://setuptools.readthedocs.io/en/latest/)
- [PEP 517 – A build-system independent format for source trees](https://www.python.org/dev/peps/pep-0517/)
- [PEP 518 – Specifying Minimum Build System Requirements for Python Projects](https://www.python.org/dev/peps/pep-0518/)

