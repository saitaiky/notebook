---
title: Is Updating State A Side effect?
description: Whether updating React state is a side effect, explaining pure functions, useEffect boundaries, and why setState calls during render cause unexpected behavior.
keywords:
  - react side effects
  - react state
  - useeffect
  - react pure functions
  - react setState
  - react hooks
  - react rendering
---

:::info TL-DR;
* **Side Effects**: External interactions outside React's internal component scope.
* **State Updates**: Internal to React, triggering predictable re-renders, and not classified as side effects.
:::

In React (and programming in general), a **side effect** refers to anything that affects something **outside** the current function’s scope or produces an observable change beyond returning a value. Examples include network requests, logging data, updating the DOM directly, or interacting with browser APIs.

## Core Definitions

* **Pure Function**: Always returns the same output for the same input and produces no observable side effects (no network calls, DOM manipulations, or external variable changes).

* **Side Effect**: Occurs when a function interacts externally or modifies something beyond its immediate scope. Examples:

  * Fetching data from an API
  * Logging to the console
  * Subscribing to WebSocket events
  * Setting timers (`setTimeout`, `setInterval`)
  * Direct DOM manipulation
  * Storing data in local storage

These actions are termed **side effects** because they aren't purely about rendering logic or state calculations.

## Practical Examples of Side Effects

* **API Call**: Fetching external data affects server states and network traffic.
* **DOM Manipulation**: Changing the document title or directly modifying DOM elements impacts the webpage beyond the component.
* **Logging**: Console logs interact with the developer environment externally.

## Why React State Updates Are **Not** Side Effects

State updates in React might seem like side effects because they trigger re-renders. However, they're not considered side effects due to key reasons:

* **Local and Internal**: State updates are confined to the component itself. React manages these updates predictably without affecting external systems or the broader environment.

* **Controlled by React**: React’s mechanisms (`setState`, `useState`) ensure state updates occur deterministically and predictably. Given the same inputs, React consistently produces the same outputs internally.

* **External Interaction Defines Side Effects**: Side effects are specifically external to the component and involve interactions not managed directly by React's internal rendering logic.

## Common Misunderstandings

* **Is updating React state ever a side effect?**
  - No. React manages state updates internally, ensuring determinism and no external interactions.
* **What about state updates inside `useEffect`?**
  - The state update itself isn't the side effect. The external action preceding the state update (e.g., fetching data) constitutes the side effect.
* **State updates triggered by event handlers (e.g., `onClick`)**:
  - These are not side effects. They’re still internal operations fully controlled by React.

## `useEffect` and Side Effects

`useEffect` explicitly handles **side effects** React can't manage directly through rendering logic alone. State updates may trigger these effects but are themselves internal and not side effects.

### Example

```typescript
import { useState, useEffect } from "react";

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetching data is the side effect
    async function fetchData() {
      const response = await fetch("https://api.example.com/data");
      const result = await response.json();
      setData(result); // This state update is internal
    }
    
    fetchData();
  }, []); // Runs only once after initial render

  return <div>Data: {data ? JSON.stringify(data) : "Loading..."}</div>;
}
```

* **Side effect**: The external API call.
* **Not a side effect**: The subsequent internal state update (`setData`).

### Dependencies in `useEffect`

Dependency arrays (`[variable]`) in `useEffect` control when side effects run:

```typescript
import { useState, useEffect } from "react";

function SearchComponent({ query }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`https://api.example.com/data?search=${query}`);
      const result = await response.json();
      setData(result);
    }

    if (query) fetchData();
  }, [query]); // Runs effect when 'query' changes

  return <div>Search Results: {data ? JSON.stringify(data) : "No data available"}</div>;
}
```

### When React Calls `useEffect()`

The table below summarises the lifecycle phases of useEffect(), clearly outlining when effects run and when their corresponding cleanup functions execute. 

| **Phase**                | **When `useEffect()` Runs**                                    | **When Cleanup Runs**                           |
| ------------------------ | -------------------------------------------------------------- | ----------------------------------------------- |
| **After Initial Render** | Once after the initial render (with no or empty dependencies). | Not applicable yet (no cleanup).                |
| **After Re-Render**      | After every update (if no dependencies specified).             | Before the next re-render (if cleanup exists).  |
| **Dependencies Change**  | Only when specified dependencies change.                       | Before effect re-runs (if dependencies change). |
| **Unmounting**           | Not applicable (component unmounts).                           | Always runs cleanup before unmounting.          |

* **No dependencies (`[]`)**: Effect runs only once after initial render.
* **Specific dependencies (`[variable]`)**: Effect runs only when dependencies change.
* **Cleanup function**: Runs cleanup before re-runs or unmounting.


:::info Related Concepts: `useRef()` vs `useEffect()`

While `useEffect()` manages side effects triggered by state or prop changes, `useRef()` offers direct references to DOM elements or persistent values across renders without causing re-renders.

**When to use `useRef()`:**

* **Direct DOM interactions**: Focus, text selection, or media playback.
* **Imperative animations**: Directly trigger complex animations.
* **Integration with external libraries**: Reference DOM nodes that third-party libraries manage.

**Avoid using `useRef()` for:**

* **Triggering re-renders**: Changes in refs won't cause a component to re-render.
* **Declarative logic**: React is declarative; use state instead whenever possible.

**Quick Example:**

```typescript
import { useRef, useEffect } from "react";

function InputFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // useRef to directly interact with the DOM element
  }, []);

  return <input ref={inputRef} />;
}
```
:::
