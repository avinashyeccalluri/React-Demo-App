import { useState, useMemo, useEffect } from 'react';
import Button from './Button';
import './UseMemoDemo.css';

/**
 * useMemo Hook Demonstration
 *
 * useMemo memoizes (caches) the result of expensive computations.
 * It only recalculates when dependencies change, preventing unnecessary work.
 *
 * Syntax: const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
 *
 * When to use useMemo:
 * 1. Expensive calculations (heavy loops, complex algorithms)
 * 2. Preventing unnecessary re-creation of objects/arrays (referential equality)
 * 3. Optimizing child component re-renders (with React.memo)
 * 4. Computing derived state from props/state
 *
 * When NOT to use useMemo:
 * 1. Simple calculations (overhead > benefit)
 * 2. Premature optimization (measure first!)
 * 3. Values that change frequently (defeats purpose)
 *
 * ⚠️ Remember: Premature optimization is the root of all evil!
 */

// Expensive calculation simulation
const fibonacci = (n) => {
  console.log(`🔢 Calculating fibonacci(${n})...`);
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

// Expensive filtering/sorting operation
const filterAndSortData = (data, searchTerm, sortOrder) => {
  console.log('🔍 Filtering and sorting data...');
  const start = performance.now();

  let result = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  result = result.sort((a, b) =>
    sortOrder === 'asc'
      ? a.price - b.price
      : b.price - a.price
  );

  const end = performance.now();
  console.log(`⏱️ Operation took ${(end - start).toFixed(2)}ms`);

  return result;
};

// Child component that demonstrates referential equality
const ExpensiveChild = ({ data, onRender }) => {
  useEffect(() => {
    onRender();
  }, [data, onRender]);

  return (
    <div className="child-component">
      <p>I re-render when 'data' reference changes</p>
      <p>Items count: {data.length}</p>
    </div>
  );
};

const UseMemoDemo = () => {
  const [fibNumber, setFibNumber] = useState(10);
  const [count, setCount] = useState(0); // Unrelated state
  const [theme, setTheme] = useState('light'); // Another unrelated state

  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 },
    { id: 4, name: 'Monitor', price: 300 },
    { id: 5, name: 'Headphones', price: 150 },
    { id: 6, name: 'Webcam', price: 80 },
    { id: 7, name: 'Microphone', price: 120 },
    { id: 8, name: 'Desk Lamp', price: 45 },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const [childRenderCount, setChildRenderCount] = useState(0);
  const [useMemoEnabled, setUseMemoEnabled] = useState(true);

  // WITHOUT useMemo: Recalculates on EVERY render (even when count changes!)
  const fibResultWithoutMemo = fibonacci(fibNumber);

  // WITH useMemo: Only recalculates when fibNumber changes
  const fibResultWithMemo = useMemo(() => {
    return fibonacci(fibNumber);
  }, [fibNumber]); // Dependencies: only recalculate when fibNumber changes

  // PATTERN 1: Expensive computation
  const selectedFibResult = useMemoEnabled ? fibResultWithMemo : fibResultWithoutMemo;

  // PATTERN 2: Derived state (filtering/sorting)
  // Without useMemo, this runs on EVERY render (expensive!)
  const filteredProducts = useMemo(() => {
    return filterAndSortData(products, searchTerm, sortOrder);
  }, [products, searchTerm, sortOrder]); // Only recalculate when these change

  // PATTERN 3: Object/Array memoization for referential equality
  // This prevents unnecessary child re-renders
  const memoizedProductList = useMemo(() => {
    return products.map(p => ({ ...p })); // Create new array
  }, [products]); // Only create new array when products actually change

  // Without useMemo, this function is recreated on every render
  // causing ExpensiveChild to re-render even when nothing changed
  const handleChildRender = useMemo(() => {
    return () => {
      setChildRenderCount(prev => prev + 1);
      console.log('🎨 ExpensiveChild rendered');
    };
  }, []); // Function never changes

  // PATTERN 4: Complex calculations
  const statistics = useMemo(() => {
    console.log('📊 Calculating statistics...');
    if (products.length === 0) return null;

    const total = products.reduce((sum, p) => sum + p.price, 0);
    const average = total / products.length;
    const max = Math.max(...products.map(p => p.price));
    const min = Math.min(...products.map(p => p.price));

    return { total, average, max, min };
  }, [products]); // Only recalculate when products change

  // PATTERN 5: Conditional memoization toggle (for demonstration)
  const toggleMemo = () => {
    setUseMemoEnabled(!useMemoEnabled);
  };

  return (
    <div className="usememo-container">
      <div className="usememo-header">
        <h2>useMemo Hook Deep Dive</h2>
        <p className="hook-description">
          Optimize performance by memoizing expensive computations
        </p>
      </div>

      {/* Demo 1: Expensive Calculation */}
      <div className="demo-card">
        <h3>1️⃣ Expensive Calculation (Fibonacci)</h3>
        <p className="demo-explanation">
          Without useMemo, fibonacci recalculates on EVERY render (even unrelated state changes).
          With useMemo, it only recalculates when the number changes.
        </p>

        <div className="memo-toggle">
          <label>
            <input
              type="checkbox"
              checked={useMemoEnabled}
              onChange={toggleMemo}
            />
            {' '}Use useMemo (check console to see difference)
          </label>
        </div>

        <div className="calculation-display">
          <div className="calc-input">
            <label>Fibonacci Number (try 1-35):</label>
            <input
              type="number"
              value={fibNumber}
              onChange={(e) => setFibNumber(Number(e.target.value))}
              min="1"
              max="35"
              className="number-input"
            />
          </div>
          <div className="calc-result">
            Result: <strong>{selectedFibResult}</strong>
          </div>
        </div>

        <div className="unrelated-state">
          <p>Unrelated State (causes re-render):</p>
          <div className="counter-display-small">{count}</div>
          <Button
            text="Increment Count"
            onClick={() => setCount(count + 1)}
            variant="secondary"
          />
          <p className="demo-note">
            {useMemoEnabled
              ? '✅ With useMemo: Fibonacci NOT recalculated (check console)'
              : '❌ Without useMemo: Fibonacci recalculated unnecessarily (check console)'}
          </p>
        </div>

        <div className="code-snippet">
          <pre>{`// ❌ WITHOUT useMemo - recalculates EVERY render
const result = fibonacci(number);

// ✅ WITH useMemo - only recalculates when number changes
const result = useMemo(() => {
  return fibonacci(number);
}, [number]); // Dependency array`}</pre>
        </div>
      </div>

      {/* Demo 2: Filtering and Sorting */}
      <div className="demo-card">
        <h3>2️⃣ Derived State (Filter & Sort)</h3>
        <p className="demo-explanation">
          Filtering/sorting large datasets is expensive. useMemo ensures it only runs when data or filters change.
        </p>

        <div className="filter-controls">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="search-input-small"
          />
          <div className="button-group">
            <Button
              text="Sort Ascending"
              onClick={() => setSortOrder('asc')}
              variant={sortOrder === 'asc' ? 'primary' : 'secondary'}
            />
            <Button
              text="Sort Descending"
              onClick={() => setSortOrder('desc')}
              variant={sortOrder === 'desc' ? 'primary' : 'secondary'}
            />
          </div>
        </div>

        <div className="products-list">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-item">
              <span className="product-name">{product.name}</span>
              <span className="product-price">${product.price}</span>
            </div>
          ))}
        </div>

        <Button
          text="Change Theme (Unrelated State)"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          variant="secondary"
        />
        <p className="demo-note">
          Changing theme doesn't re-filter products (check console).
          Only search/sort triggers recalculation.
        </p>

        <div className="code-snippet">
          <pre>{`const filteredProducts = useMemo(() => {
  return filterAndSort(products, searchTerm, sortOrder);
}, [products, searchTerm, sortOrder]);

// Only recalculates when products, searchTerm, or sortOrder change
// NOT when unrelated state (like theme) changes`}</pre>
        </div>
      </div>

      {/* Demo 3: Referential Equality */}
      <div className="demo-card">
        <h3>3️⃣ Referential Equality & Child Renders</h3>
        <p className="demo-explanation">
          Objects/arrays are recreated on every render (new reference).
          This causes child components to re-render unnecessarily.
          useMemo maintains the same reference when data hasn't changed.
        </p>

        <ExpensiveChild data={memoizedProductList} onRender={handleChildRender} />

        <div className="render-stats">
          <p>Child Component Renders: <strong>{childRenderCount}</strong></p>
          <Button
            text="Force Parent Re-render"
            onClick={() => setCount(count + 1)}
            variant="secondary"
          />
        </div>

        <div className="code-snippet">
          <pre>{`// ❌ WITHOUT useMemo - new array every render
const list = products.map(p => ({ ...p }));
<Child data={list} /> // Always re-renders!

// ✅ WITH useMemo - same reference unless products change
const list = useMemo(() => {
  return products.map(p => ({ ...p }));
}, [products]);
<Child data={list} /> // Only re-renders when products change`}</pre>
        </div>
      </div>

      {/* Demo 4: Complex Statistics */}
      <div className="demo-card">
        <h3>4️⃣ Complex Calculations (Statistics)</h3>
        <p className="demo-explanation">
          Aggregate calculations (sum, average, min, max) can be expensive with large datasets.
        </p>

        {statistics && (
          <div className="statistics-grid">
            <div className="stat-item">
              <span className="stat-label">Total Value:</span>
              <span className="stat-value">${statistics.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Price:</span>
              <span className="stat-value">${statistics.average.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Most Expensive:</span>
              <span className="stat-value">${statistics.max}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cheapest:</span>
              <span className="stat-value">${statistics.min}</span>
            </div>
          </div>
        )}

        <Button
          text="Add Random Product"
          onClick={() => {
            const newProduct = {
              id: Date.now(),
              name: `Product ${products.length + 1}`,
              price: Math.floor(Math.random() * 500) + 50,
            };
            setProducts([...products, newProduct]);
          }}
          variant="primary"
        />

        <div className="code-snippet">
          <pre>{`const statistics = useMemo(() => {
  const total = products.reduce((sum, p) => sum + p.price, 0);
  const average = total / products.length;
  const max = Math.max(...products.map(p => p.price));
  const min = Math.min(...products.map(p => p.price));
  return { total, average, max, min };
}, [products]); // Only recalculate when products change`}</pre>
        </div>
      </div>

      {/* When NOT to use useMemo */}
      <div className="demo-card warning-card">
        <h3>⚠️ When NOT to Use useMemo</h3>
        <div className="warning-content">
          <div className="warning-item">
            <h4>1. Simple Calculations</h4>
            <pre className="inline-code">{`// ❌ Overkill - overhead > benefit
const doubled = useMemo(() => number * 2, [number]);

// ✅ Just do it directly
const doubled = number * 2;`}</pre>
          </div>

          <div className="warning-item">
            <h4>2. Frequently Changing Dependencies</h4>
            <pre className="inline-code">{`// ❌ Defeats the purpose - recalculates constantly
const result = useMemo(() => {
  return expensiveCalc(mouseX, mouseY);
}, [mouseX, mouseY]); // Changes on every mouse move!`}</pre>
          </div>

          <div className="warning-item">
            <h4>3. Premature Optimization</h4>
            <p className="warning-text">
              "Premature optimization is the root of all evil" - Donald Knuth
              <br /><br />
              <strong>First:</strong> Write clean code<br />
              <strong>Then:</strong> Measure performance (Chrome DevTools Profiler)<br />
              <strong>Finally:</strong> Optimize bottlenecks with useMemo
            </p>
          </div>

          <div className="warning-item">
            <h4>4. Already Fast Operations</h4>
            <pre className="inline-code">{`// ❌ Unnecessary
const uppercased = useMemo(() => name.toUpperCase(), [name]);

// ✅ String operations are fast
const uppercased = name.toUpperCase();`}</pre>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="demo-card key-takeaways">
        <h3>🎯 Key Takeaways</h3>
        <ul>
          <li><strong>Purpose:</strong> Cache expensive computations to avoid recalculating on every render</li>
          <li><strong>When to use:</strong> Heavy calculations, derived state, referential equality needs</li>
          <li><strong>Dependencies:</strong> Only recalculates when dependency array values change</li>
          <li><strong>Referential equality:</strong> Same reference prevents child re-renders (use with React.memo)</li>
          <li><strong>Measure first:</strong> Don't optimize prematurely. Profile with DevTools first!</li>
          <li><strong>Trade-off:</strong> useMemo has overhead (memory + comparison). Use when benefit > cost</li>
          <li><strong>Similar to useCallback:</strong> useCallback is useMemo for functions</li>
          <li><strong>Best practice:</strong> Start without useMemo, add when profiling shows bottlenecks</li>
        </ul>
      </div>
    </div>
  );
};

export default UseMemoDemo;
