---
title: Is Updating State A Side effect?
---

In React (and programming in general), a **side effect** refers to anything that affects something **outside** the current function’s scope or produces an observable change beyond returning a value. This can include things like making network requests, logging data, updating the DOM, or interacting with browser APIs.

### Definition
- A **pure function** is one that always returns the same output given the same input and doesn’t produce any observable side effects (e.g., no network requests, no direct DOM manipulations, no modifying external variables).
- A **side effect** happens when a function interacts with the outside world or alters something beyond its immediate scope. For example:
  - Fetching data from an API
  - Logging to the console
  - Subscribing to WebSocket events
  - Setting up timers (`setTimeout`, `setInterval`)
  - Manipulating the DOM directly
  - Storing data in local storage

These types of actions are called **side effects** because they don't belong purely to the logic of rendering a component or calculating a state value based on inputs.

### Examples
- **API Call**: When you fetch data from an external API, it affects the outside world by sending a network request and potentially changing the state of the server.
- **DOM Manipulation**: When you change the document title or directly manipulate DOM elements, you are creating side effects outside the function’s scope.
- **Logging**: Even logging to the console is a side effect because it interacts with the developer environment, not just the component itself.

### Why is Updating State Not Considered a "Side Effect"?
Although updating state **may seem like a side effect**, it’s not considered one in React for a few reasons:

- **State Updates Are Local**: Updating the state in React is an operation confined to the component itself. React's internal mechanism handles state updates in a controlled, predictable manner. It triggers a re-render but does not affect external systems or the broader environment, which is why it's not treated as a side effect.
  
- **Controlled by React**: React provides its own `setState` or `useState` mechanism to manage the state. These updates are considered part of the component's lifecycle and logic, and React ensures that these updates happen in a predictable, isolated way. This makes state updates deterministic (the same inputs always produce the same output within the component).

- **Side Effects Are External**: In contrast, side effects involve actions that are **external** to the component and are not managed directly by React’s rendering logic (such as interacting with APIs, changing browser history, or manually manipulating the DOM). These actions go beyond the local scope of the function.

### `useEffect` and side effects
`useEffect` is specifically designed for handling **side effects** that React components can't handle directly through rendering logic. State updates can trigger these side effects, but they are not side effects by themselves.

#### Example of a Side Effect in `useEffect`:
```tsx
import { useState, useEffect } from "react";

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetching data is a side effect
    async function fetchData() {
      const response = await fetch("https://api.example.com/data");
      const result = await response.json();
      setData(result); // Updating state
    }
    
    fetchData();
  }, []); // Empty array ensures this effect runs only once (after the initial render)

  return <div>Data: {data ? JSON.stringify(data) : "Loading..."}</div>;
}
```

- The **side effect** here is the API request that fetches data from an external source.
- The **state update** (`setData`) is not a side effect; it's React’s way of re-rendering the component when the data is available.

:::info State updates vs Side effects
- **State updates** are internal to the component and managed by React, causing re-renders.
- **Side effects** go beyond the internal workings of React and interact with the outside world (network requests, DOM manipulation, etc.).
:::

### `useEffect` Dependency

```tsx
import { useState, useEffect } from "react";

function SearchComponent({ query }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetching data based on the query is a side effect
    async function fetchData() {
      const response = await fetch(`https://api.example.com/data?search=${query}`);
      const result = await response.json();
      setData(result); // Updating state with fetched data
    }

    // Only fetch data when the query changes
    if (query) {
      fetchData();
    }
  }, [query]); // 'query' is the dependency

  return <div>Search Results: {data ? JSON.stringify(data) : "No data available"}</div>;
}
```
In this example, `useEffect` now has a dependency array with `query` in it:

- **Why include variables in the dependency array?**
  The `useEffect` hook runs its effect (the function you define) after rendering. By adding variables (like `query`) in the dependency array, you control *when* the effect runs. Specifically, the effect will re-run **only** when any of the variables in the dependency array change.
- **What happens here?**
  1. The component renders.
  2. When the `query` prop changes, `useEffect` detects the change because `query` is in the dependency array.
  3. The effect runs, fetching new data based on the updated `query`.
- **Why use it?**
  Including dependencies in the array ensures that the effect is run only when necessary, optimizing performance by avoiding unnecessary function executions (like fetching data) on every render.

### When React Calls `useEffect()`

| **Phase**             | **When `useEffect()` Runs**                      | **When Cleanup Runs**                |
|-----------------------|--------------------------------------------------|--------------------------------------|
| **After Initial Render**   | Runs once after the component renders for the first time (if no dependencies or empty array). | Not applicable yet (no cleanup).     |
| **After Re-Render**    | Runs after every update (unless dependencies are specified). | Before the next re-render if the effect has a cleanup. |
| **When Dependencies Change** | Runs only when one of the dependencies changes. | Before the effect re-runs if the dependencies changed. |
| **When Unmounting**    | Cleanup function runs when the component unmounts (for effects with cleanup). | Always cleans up before unmounting. |

- **No dependencies** (`[]`): The effect runs **only after the initial render**.
- **Specific dependencies** (`[count, name]`): The effect runs **only when any of the listed dependencies change**.
- **Cleanup function**: The cleanup function inside `useEffect` is called when the component is unmounted or before the effect re-runs.

### Summary
- **Side effects** are actions that happen **outside** the React component’s scope (API calls, subscriptions, logging, etc.).
- **State updates** are internal to the component and trigger re-renders but are not side effects by React's definition.



