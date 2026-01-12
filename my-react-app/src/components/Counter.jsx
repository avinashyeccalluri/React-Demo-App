import { useState } from 'react';
import Button from './Button';
import './Counter.css';

// hooks -> useEffect, useState, useRef, useMemo, useCallback, usecontext

const Counter = () => {
  const [count, setCount] = useState(0); // string, obj, array, boolean, number
  // age, setAge
  // name, setName

  const increment = () => setCount((c)=> c+1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  
  // const arr = [ 2, 'Avinash' , (name)=>{console.log(name)} , true ];
  // arr[2]('Avinash from array');
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

// comments -> destructuring, spread operator, rest operator - ES6 features
// use spread operator to copy objects/arrays -> edit object of object.
// {name: 'Avinash', details: {age: 26, role: 'developer'}}

export default Counter;
