import { useState, useCallback, useMemo, memo } from 'react';
import Button from './Button';
import './UseCallbackDemo.css';

/**
 * useCallback Hook Demonstration
 *
 * useCallback returns a memoized version of a callback function that only changes
 * if one of the dependencies has changed. It's used for performance optimization.
 *
 * Syntax: const memoizedCallback = useCallback(fn, dependencies)
 *
 * Key Concepts:
 * 1. Prevents unnecessary re-creation of functions on every render
 * 2. Useful when passing callbacks to optimized child components (React.memo)
 * 3. Dependencies array works like useEffect
 * 4. Returns the same function reference unless dependencies change
 *
 * useCallback(fn, deps) is equivalent to useMemo(() => fn, deps)
 *
 * When to use:
 * - Passing callbacks to memoized child components
 * - Function is used as dependency in useEffect/useMemo
 * - Expensive function creation (rare)
 * - Referential equality matters
 */

// ==================== PATTERN 1: Child Component WITHOUT React.memo ====================
// This component re-renders EVERY time parent re-renders (normal behavior)
const RegularButton = ({ onClick, label, renderCount }) => {
  console.log(`🔴 RegularButton "${label}" rendered`);
  return (
    <div className="component-box regular">
      <Button text={label} onClick={onClick} variant="secondary" />
      <p className="render-count">Renders: {renderCount.current++}</p>
    </div>
  );
};

// ==================== PATTERN 2: Child Component WITH React.memo ====================
// This component only re-renders if props actually change (optimized)
const MemoizedButton = memo(({ onClick, label, renderCount }) => {
  console.log(`🟢 MemoizedButton "${label}" rendered`);
  return (
    <div className="component-box memoized">
      <Button text={label} onClick={onClick} variant="primary" />
      <p className="render-count">Renders: {renderCount.current++}</p>
    </div>
  );
});

// ==================== PATTERN 3: Complex Search Component ====================
const SearchResults = memo(({ onSearch, query }) => {
  console.log(`🔍 SearchResults rendered with query: "${query}"`);

  // Simulate expensive computation
  const results = useMemo(() => {
    console.log('💰 Computing search results...');
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
    return items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="search-results">
      <h4>Search Results ({results.length} items)</h4>
      <ul className="results-list">
        {results.slice(0, 10).map((item, index) => (
          <li key={index}>{item}</li>
        ))}
        {results.length > 10 && <li className="more-results">...and {results.length - 10} more</li>}
      </ul>
    </div>
  );
});

// ==================== PATTERN 4: Todo Item Component ====================
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log(`📝 TodoItem "${todo.text}" rendered`);

  return (
    <li className={`todo-item-callback ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />
      <span className="todo-text">{todo.text}</span>
      <Button
        text="Delete"
        onClick={() => onDelete(todo.id)}
        variant="danger"
      />
    </li>
  );
});

// ==================== PATTERN 5: List Component with Item Actions ====================
const ItemList = memo(({ items, onItemClick, title }) => {
  console.log(`📋 ItemList "${title}" rendered with ${items.length} items`);

  return (
    <div className="item-list">
      <h4>{title}</h4>
      <ul>
        {items.map(item => (
          <li key={item.id} onClick={() => onItemClick(item.id)} className="list-item">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
});

const UseCallbackDemo = () => {
  // State for various demos
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn useCallback', completed: false },
    { id: 2, text: 'Optimize performance', completed: false },
    { id: 3, text: 'Build awesome apps', completed: false }
  ]);
  const [listAItems] = useState([
    { id: 1, name: 'Item A1' },
    { id: 2, name: 'Item A2' },
    { id: 3, name: 'Item A3' }
  ]);
  const [listBItems] = useState([
    { id: 1, name: 'Item B1' },
    { id: 2, name: 'Item B2' },
    { id: 3, name: 'Item B3' }
  ]);

  // Render counters (using refs to persist across renders)
  const regularButtonRenders = { current: 0 };
  const memoizedWithoutCallbackRenders = { current: 0 };
  const memoizedWithCallbackRenders = { current: 0 };

  // ❌ BAD: Function recreated on EVERY render
  // New function reference every time, breaks React.memo optimization
  const handleClickWithoutCallback = () => {
    console.log('Clicked without useCallback!');
    alert('Without useCallback - new function every render!');
  };

  // ✅ GOOD: Function reference stays the same (memoized)
  // Only creates new function if dependencies change
  const handleClickWithCallback = useCallback(() => {
    console.log('Clicked with useCallback!');
    alert(`With useCallback - same function reference! Count: ${count}`);
  }, [count]); // Only recreate when count changes

  // ✅ Empty dependency array - function never changes
  const handleClickStable = useCallback(() => {
    console.log('Stable function - never changes!');
    alert('This function reference never changes!');
  }, []); // No dependencies - function created once

  // ==================== PATTERN: Search Handler ====================
  // ❌ Without useCallback - SearchResults re-renders unnecessarily
  const handleSearchWithoutCallback = (query) => {
    console.log('Search without callback:', query);
  };

  // ✅ With useCallback - SearchResults only re-renders when needed
  const handleSearchWithCallback = useCallback((query) => {
    console.log('Search with callback:', query);
  }, []); // No dependencies needed

  // ==================== PATTERN: Todo Handlers ====================
  // ✅ Memoized toggle function
  const handleToggleTodo = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // No external dependencies - uses functional update

  // ✅ Memoized delete function
  const handleDeleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []); // No external dependencies

  // ==================== PATTERN: Item Click Handlers ====================
  // ❌ Without useCallback - new function every render
  const handleItemAClickWithout = (id) => {
    console.log(`List A item ${id} clicked (without callback)`);
    alert(`List A: Item ${id}`);
  };

  // ✅ With useCallback - stable function reference
  const handleItemAClickWith = useCallback((id) => {
    console.log(`List A item ${id} clicked (with callback)`);
    alert(`List A: Item ${id}`);
  }, []);

  const handleItemBClick = useCallback((id) => {
    console.log(`List B item ${id} clicked`);
    alert(`List B: Item ${id}`);
  }, []);

  // ==================== PATTERN: Dependent Functions ====================
  // Function that depends on state
  const handleIncrementBy = useCallback((amount) => {
    setCount(prevCount => prevCount + amount);
  }, []); // Using functional update - no need to depend on count

  // Function that uses another memoized function
  const handleDoubleIncrement = useCallback(() => {
    handleIncrementBy(2);
  }, [handleIncrementBy]); // Depends on memoized function

  return (
    <div className="usecallback-container">
      <div className="usecallback-header">
        <h2>useCallback Hook Deep Dive</h2>
        <p className="hook-description">
          Master function memoization and performance optimization
        </p>
      </div>

      {/* Demo 1: Basic Comparison */}
      <div className="demo-card">
        <h3>1️⃣ useCallback Fundamentals</h3>
        <p className="demo-explanation">
          Compare components with and without useCallback. Open console to see render behavior.
          The parent state changes, but only non-memoized components re-render.
        </p>

        <div className="state-controls">
          <div className="counter-display-small">Count: {count}</div>
          <Button
            text="Increment Count"
            onClick={() => setCount(count + 1)}
            variant="primary"
          />
          <Button
            text="Update Other State"
            onClick={() => setOtherState(otherState + 1)}
            variant="secondary"
          />
          <p className="info-text">Other State: {otherState} (triggers parent re-render)</p>
        </div>

        <div className="comparison-grid">
          <div className="comparison-column">
            <h4>❌ Without React.memo</h4>
            <p className="column-description">Always re-renders (normal behavior)</p>
            <RegularButton
              onClick={handleClickWithoutCallback}
              label="Regular Button"
              renderCount={regularButtonRenders}
            />
          </div>

          <div className="comparison-column">
            <h4>⚠️ memo + Without useCallback</h4>
            <p className="column-description">Re-renders because function reference changes</p>
            <MemoizedButton
              onClick={handleClickWithoutCallback}
              label="Memo Without Callback"
              renderCount={memoizedWithoutCallbackRenders}
            />
          </div>

          <div className="comparison-column">
            <h4>✅ memo + useCallback</h4>
            <p className="column-description">Doesn't re-render (optimized!)</p>
            <MemoizedButton
              onClick={handleClickStable}
              label="Memo With Callback"
              renderCount={memoizedWithCallbackRenders}
            />
          </div>
        </div>

        <div className="code-snippet">
          <pre>{`// ❌ Without useCallback - new function every render
const handleClick = () => {
  console.log('Clicked!');
};

// ✅ With useCallback - memoized function
const handleClick = useCallback(() => {
  console.log('Clicked!');
}, []); // Empty deps = function never changes

// With dependencies
const handleClick = useCallback(() => {
  console.log('Count:', count);
}, [count]); // Recreate only when count changes

// Using with React.memo
const MemoButton = memo(({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
});`}</pre>
        </div>
      </div>

      {/* Demo 2: Search with useCallback */}
      <div className="demo-card">
        <h3>2️⃣ useCallback with Complex Components</h3>
        <p className="demo-explanation">
          Search component only re-renders when query changes, not when parent re-renders.
        </p>

        <div className="search-demo">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="search-input"
          />

          <Button
            text="Trigger Parent Re-render"
            onClick={() => setOtherState(otherState + 1)}
            variant="secondary"
          />

          <SearchResults
            onSearch={handleSearchWithCallback}
            query={searchQuery}
          />
        </div>

        <div className="code-snippet">
          <pre>{`// ✅ Memoized search handler
const handleSearch = useCallback((query) => {
  // Expensive search operation
  fetchSearchResults(query);
}, []); // No dependencies - stable function

// Memoized child component
const SearchResults = memo(({ onSearch, query }) => {
  // Expensive computation
  const results = useMemo(() => {
    return performSearch(query);
  }, [query]);

  return <div>{results}</div>;
});

// Usage
<SearchResults onSearch={handleSearch} query={searchQuery} />`}</pre>
        </div>
      </div>

      {/* Demo 3: Todo List with useCallback */}
      <div className="demo-card">
        <h3>3️⃣ List Items with Callbacks</h3>
        <p className="demo-explanation">
          Each todo item is memoized and only re-renders when its own data changes.
          Check console to see which items re-render.
        </p>

        <div className="todo-demo">
          <ul className="todo-list-callback">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </ul>

          <Button
            text="Trigger Parent Re-render"
            onClick={() => setOtherState(otherState + 1)}
            variant="secondary"
          />
        </div>

        <div className="code-snippet">
          <pre>{`// ✅ Memoized handlers using functional updates
const handleToggle = useCallback((id) => {
  setTodos(prevTodos =>
    prevTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );
}, []); // No dependencies - uses functional update

const handleDelete = useCallback((id) => {
  setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
}, []);

// Memoized TodoItem component
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});`}</pre>
        </div>
      </div>

      {/* Demo 4: Multiple Lists */}
      <div className="demo-card">
        <h3>4️⃣ Multiple Lists with Independent Callbacks</h3>
        <p className="demo-explanation">
          Each list has its own memoized callback. Lists only re-render when their specific callback changes.
        </p>

        <div className="lists-grid">
          <ItemList
            items={listAItems}
            onItemClick={handleItemAClickWith}
            title="List A (with useCallback)"
          />

          <ItemList
            items={listBItems}
            onItemClick={handleItemBClick}
            title="List B (with useCallback)"
          />
        </div>

        <Button
          text="Trigger Parent Re-render"
          onClick={() => setOtherState(otherState + 1)}
          variant="secondary"
        />

        <div className="code-snippet">
          <pre>{`// Multiple memoized callbacks
const handleListAClick = useCallback((id) => {
  console.log('List A item clicked:', id);
}, []);

const handleListBClick = useCallback((id) => {
  console.log('List B item clicked:', id);
}, []);

// Memoized list component
const ItemList = memo(({ items, onItemClick, title }) => {
  return (
    <div>
      <h4>{title}</h4>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </div>
  );
});`}</pre>
        </div>
      </div>

      {/* Demo 5: Dependent Callbacks */}
      <div className="demo-card">
        <h3>5️⃣ Callbacks with Dependencies</h3>
        <p className="demo-explanation">
          Demonstrates how to handle callbacks that depend on state or other callbacks.
        </p>

        <div className="dependent-demo">
          <div className="counter-display-small">Count: {count}</div>

          <div className="button-group">
            <Button
              text="Increment by 1"
              onClick={() => handleIncrementBy(1)}
              variant="primary"
            />
            <Button
              text="Increment by 2"
              onClick={handleDoubleIncrement}
              variant="primary"
            />
            <Button
              text="Increment by 5"
              onClick={() => handleIncrementBy(5)}
              variant="primary"
            />
          </div>
        </div>

        <div className="code-snippet">
          <pre>{`// Base callback with functional update (no dependencies)
const handleIncrementBy = useCallback((amount) => {
  setCount(prevCount => prevCount + amount);
}, []); // No dependencies needed!

// Callback that depends on another callback
const handleDoubleIncrement = useCallback(() => {
  handleIncrementBy(2);
}, [handleIncrementBy]); // Depends on memoized function

// ⚠️ If callback depends on state, include in dependencies
const handleAlert = useCallback(() => {
  alert(\`Current count: \${count}\`);
}, [count]); // Recreate when count changes`}</pre>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="demo-card key-takeaways">
        <h3>🎯 Key Interview Points</h3>
        <ul>
          <li><strong>What is useCallback?</strong> Returns memoized callback that only changes if dependencies change</li>
          <li><strong>Why use it?</strong> Prevents unnecessary re-renders of child components wrapped in React.memo</li>
          <li><strong>When to use:</strong> Passing callbacks to optimized children, function as useEffect dependency, referential equality matters</li>
          <li><strong>When NOT to use:</strong> Every function (over-optimization), simple components, no performance issues</li>
          <li><strong>vs useMemo:</strong> useCallback(fn, deps) === useMemo(() =&gt; fn, deps). useCallback for functions, useMemo for values</li>
          <li><strong>Dependencies:</strong> Empty [] = never changes, [count] = changes when count changes, missing deps = stale closure bug</li>
          <li><strong>React.memo required:</strong> useCallback alone doesn't prevent re-renders - child must be wrapped in React.memo</li>
          <li><strong>Functional updates:</strong> Use setCount(prev =&gt; prev + 1) to avoid depending on state in useCallback</li>
          <li><strong>Performance:</strong> Premature optimization is bad. Only use when profiling shows actual performance issues</li>
          <li><strong>Common mistake:</strong> Using useCallback everywhere (adds overhead). Only use for expensive renders or strict referential equality</li>
        </ul>

        <div className="code-snippet">
          <pre>{`// ⚠️ Common Interview Questions

// Q1: When does useCallback help?
// A: Only when passing to React.memo components or as deps in useEffect

// ❌ Doesn't help - child not memoized
<RegularComponent onClick={useCallback(() => {}, [])} />

// ✅ Helps - child is memoized
<MemoComponent onClick={useCallback(() => {}, [])} />

// Q2: useCallback vs useMemo?
const memoizedCallback = useCallback(() => doSomething(), []);
const memoizedCallback = useMemo(() => () => doSomething(), []); // Same!

const memoizedValue = useMemo(() => computeExpensiveValue(), [dep]);

// Q3: How to avoid dependencies?
// ❌ Bad - depends on count
const increment = useCallback(() => setCount(count + 1), [count]);

// ✅ Good - no dependencies
const increment = useCallback(() => setCount(c => c + 1), []);

// Q4: Does useCallback prevent all re-renders?
// No! Parent re-renders, child with memo + useCallback doesn't re-render
// But children of that child still re-render unless also optimized`}</pre>
        </div>
      </div>
    </div>
  );
};

export default UseCallbackDemo;
