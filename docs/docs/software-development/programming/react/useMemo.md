---
title: "useMemo: When and Why to Use It"
---

# Understanding useMemo in React: When and Why to Use It

## Introduction
React's `useMemo` hook is often misused or overused. Let's explore the three key scenarios where `useMemo` actually provides value.

## 1. Expensive Computations

### When to Use
When you have computationally expensive operations that don't need to be recalculated on every render.

```tsx
// Bad: Recalculates on every render
function ProductList({ products }) {
  const sortedProducts = products
    .filter(p => p.inStock)
    .sort((a, b) => b.price - a.price)
    .map(p => ({ ...p, discount: p.price * 0.1 }));

  return <div>{/* render products */}</div>;
}

// Good: Only recalculates when products change
function ProductList({ products }) {
  const sortedProducts = useMemo(() => {
    return products
      .filter(p => p.inStock)
      .sort((a, b) => b.price - a.price)
      .map(p => ({ ...p, discount: p.price * 0.1 }));
  }, [products]);

  return <div>{/* render products */}</div>;
}
```

## 2. Referential Equality

### When to Use
When passing objects or arrays as props or dependencies to other hooks.

```tsx
// Bad: Creates new object every render
function MapComponent({ center }) {
  const options = {
    center: center,
    zoom: 10,
    markers: [...],
  };

  return <GoogleMap options={options} />;
}

// Good: Maintains reference equality
function MapComponent({ center }) {
  const options = useMemo(() => ({
    center: center,
    zoom: 10,
    markers: [...],
  }), [center]);

  return <GoogleMap options={options} />;
}
```

## 3. Hook Dependencies

### When to Use
When a value is used as a dependency in useEffect or other hooks.

```tsx
// Bad: Triggers useEffect on every render
function SearchResults({ query }) {
  const searchConfig = {
    fuzzy: true,
    limit: 10,
    query: query
  };

  useEffect(() => {
    // This effect runs on EVERY render because searchConfig is always new
    performSearch(searchConfig);
  }, [searchConfig]);

  return <div>{/* results */}</div>;
}

// Good: Only triggers when necessary
function SearchResults({ query }) {
  const searchConfig = useMemo(() => ({
    fuzzy: true,
    limit: 10,
    query: query
  }), [query]);

  useEffect(() => {
    // Effect only runs when query changes
    performSearch(searchConfig);
  }, [searchConfig]);

  return <div>{/* results */}</div>;
}
```

## Anti-Patterns and Common Mistakes

### Don't Memoize Everything
```tsx
// Unnecessary: Primitive values don't benefit
const count = useMemo(() => 42, []);

// Unnecessary: Simple calculations
const doubled = useMemo(() => number * 2, [number]);

// Unnecessary: Already stable references
const handler = useMemo(() => {
  return () => console.log('click');
}, []); // Use useCallback instead
```

## Performance Impact

Remember that `useMemo` itself has a cost:
1. Memory to store the memoized value
2. Computation to check dependencies
3. Added code complexity

## When to Skip useMemo

Skip memoization when:
1. The computation is simple
2. The value is a primitive
3. The component always needs fresh data
4. The component renders infrequently

## Best Practices

1. Profile First
```tsx
// Add console.time to measure
function ExpensiveComponent({ data }) {
  const result = useMemo(() => {
    console.time('calculation');
    const value = expensiveCalculation(data);
    console.timeEnd('calculation');
    return value;
  }, [data]);
}
```

2. Use DevTools
```tsx
// React DevTools Profiler can help identify unnecessary re-renders
```

3. Document Your Reasoning
```tsx
// Good: Clear documentation
const memoizedValue = useMemo(
  () => expensiveOperation(props.data),
  [props.data], // Memoized because calculation takes >100ms on large datasets
);
```

## Conclusion

`useMemo` is a powerful optimization tool when used correctly. Always measure and profile before adding memoization, and be mindful of the tradeoffs between performance gains and code complexity.
