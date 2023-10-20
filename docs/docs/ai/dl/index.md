

## TO-DO

➔ Consider the meaning of “artificial intelligence”
➔ Be able to define core concepts from AI including “agents”,“environments”, and “states”
➔ Learn the concept of “rational” behavior for AI agents




## Todo

Constraint Propagation and Search are fundamental techniques used in the field of Artificial Intelligence, especially in solving constraint satisfaction problems (CSPs). Here's a brief explanation of each:

1. Constraint Propagation:
Constraint propagation is a process used to simplify and narrow down the possible solutions in a constraint satisfaction problem. In a CSP, you have variables, domains, and constraints. Constraints define the relationships between variables and restrict the possible values they can take. Constraint propagation involves using these constraints to make logical inferences and reduce the domains of variables.

For example, if a constraint states that "Variable A must be less than Variable B," and Variable B has a domain of [1, 2, 3], then constraint propagation would eliminate any values in Variable A's domain that are greater than 3, as they cannot satisfy the constraint.

Common techniques for constraint propagation include arc consistency, which ensures that each value in a variable's domain is consistent with the domains of its neighbors, and forward checking, which updates the domains of unassigned variables based on the values assigned to other variables.

2. Search:
Search is the process of systematically exploring the space of possible solutions to find a valid assignment of values to variables that satisfies all constraints in a CSP. In many cases, CSPs can be too complex to solve by constraint propagation alone. Search algorithms help find solutions through systematic exploration.

Search algorithms can take various forms, including depth-first search, breadth-first search, and more sophisticated techniques like backtracking search. These algorithms explore possible assignments to variables, often using heuristics to prioritize the most promising choices first, and backtrack when a dead-end is encountered.

In AI applications, constraint propagation and search are often combined, with constraint propagation used to reduce the search space and guide the search algorithms. The goal is to efficiently find solutions to complex problems by iteratively applying constraints and exploring the solution space through search.

Together, constraint propagation and search play a crucial role in solving problems where logical constraints need to be satisfied, such as scheduling, planning, and optimization tasks in various domains.