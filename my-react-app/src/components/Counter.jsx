import { useState } from 'react';
import Button from './Button';
import './Counter.css';

// hooks -> useEffect, useState, useRef, useMemo, useCallback, usecontext

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="counter-container">
      <h2>Counter (State Demo)</h2>
      <div className="counter-display">{count}</div>
      <div className="counter-buttons">
        <Button text="Increment" onClick={increment} variant="primary" />
        <Button text="Decrement" onClick={decrement} variant="secondary" />
        <Button text="Reset" onClick={reset} variant="danger" />
      </div>
    </div>
  );
};

export default Counter;
