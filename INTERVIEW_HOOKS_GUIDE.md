# React Hooks Interview Preparation Guide

## Overview
This guide covers three essential React hooks commonly asked in frontend interviews: **useContext**, **useReducer**, and **useCallback**. Each section includes concepts, use cases, common interview questions, and code examples.

---

## 1. useContext Hook

### What is it?
`useContext` allows you to consume context values without prop drilling. It provides a way to pass data through the component tree without manually passing props at every level.

### Syntax
```javascript
const value = useContext(MyContext);
```

### When to Use
- **Theme management** (dark mode, colors)
- **User authentication** data
- **Language/localization** preferences
- **Global app settings**
- Any data needed by many components at different nesting levels

### When NOT to Use
- Simple parent-child communication (use props instead)
- Frequently changing data (can cause performance issues)
- Local component state

### Key Concepts
1. **Create Context**: `const ThemeContext = createContext()`
2. **Provide Value**: Wrap components with `<Context.Provider value={...}>`
3. **Consume Context**: Use `useContext(ThemeContext)` in any child component

### Common Interview Questions

#### Q1: What problem does useContext solve?
**A:** It eliminates "prop drilling" - the need to pass props through many intermediate components that don't use them.

```javascript
// ❌ Prop Drilling (Bad)
<Grandparent theme={theme}>
  <Parent theme={theme}>
    <Child theme={theme} /> // Props passed through Parent
  </Parent>
</Grandparent>

// ✅ Context (Good)
<ThemeContext.Provider value={theme}>
  <Grandparent>
    <Parent>
      <Child /> // Accesses theme directly via useContext
    </Parent>
  </Grandparent>
</ThemeContext.Provider>
```

#### Q2: What are the performance implications?
**A:** All consumers re-render when context value changes. To optimize:
- Split contexts by concern (auth context, theme context separately)
- Use React.memo for components that shouldn't re-render
- Memoize context value with useMemo

```javascript
// ✅ Optimized context value
const value = useMemo(() => ({ user, login, logout }), [user]);

<UserContext.Provider value={value}>
  {children}
</UserContext.Provider>
```

#### Q3: useContext vs Redux?
**A:**
- **useContext**: Built-in, simpler, good for small-medium apps
- **Redux**: Better dev tools, middleware support, time-travel debugging, better for large apps with complex state

#### Q4: Can you have multiple contexts?
**A:** Yes! Components can consume multiple contexts:

```javascript
const MyComponent = () => {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const settings = useContext(SettingsContext);

  return <div>...</div>;
};
```

### Code Example
```javascript
// 1. Create context
const ThemeContext = createContext();

// 2. Provider
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <Content />
    </ThemeContext.Provider>
  );
}

// 3. Consumer (any nested level)
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
}
```

---

## 2. useReducer Hook

### What is it?
`useReducer` is an alternative to `useState` for managing complex state logic. It follows the reducer pattern (like Redux): you dispatch actions to update state.

### Syntax
```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

### Reducer Pattern
```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

### When to Use useReducer over useState
1. Complex state logic with multiple sub-values
2. Next state depends on previous state
3. Multiple actions that update state
4. Want to optimize performance (dispatch is stable)
5. State transitions follow specific rules

### When to Use useState
- Simple state (strings, numbers, booleans)
- Independent state variables
- Few update patterns

### Common Interview Questions

#### Q1: useReducer vs useState - When to use which?
**A:**

```javascript
// ❌ Complex with useState - hard to manage
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

// ✅ Cleaner with useReducer
const [state, dispatch] = useReducer(formReducer, {
  username: '',
  email: '',
  password: '',
  errors: {},
  isSubmitting: false
});

dispatch({ type: 'UPDATE_FIELD', field: 'username', value: 'john' });
dispatch({ type: 'SUBMIT_START' });
```

#### Q2: What is the reducer function?
**A:** A pure function that takes `(state, action) => newState`:
- **Pure**: No side effects, same input = same output
- **Immutable**: Never mutate state, always return new object
- **Action structure**: Usually `{ type: 'ACTION_NAME', payload: data }`

#### Q3: How do you handle async operations with useReducer?
**A:** Reducers must be synchronous. Handle async operations outside:

```javascript
const fetchData = async () => {
  dispatch({ type: 'FETCH_START' });
  try {
    const data = await api.getData();
    dispatch({ type: 'FETCH_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'FETCH_ERROR', payload: error });
  }
};
```

#### Q4: Can you combine useReducer with useContext?
**A:** Yes! This pattern creates Redux-like global state:

```javascript
// State management
const [state, dispatch] = useReducer(reducer, initialState);

// Provide to entire app
<StateContext.Provider value={{ state, dispatch }}>
  <App />
</StateContext.Provider>

// Consume anywhere
const { state, dispatch } = useContext(StateContext);
dispatch({ type: 'UPDATE_USER', payload: user });
```

### Code Example
```javascript
// Initial state
const initialState = {
  todos: [],
  filter: 'all'
};

// Reducer function
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text: action.text }]
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      };
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

// Usage in component
function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', text });
  };

  return <div>...</div>;
}
```

---

## 3. useCallback Hook

### What is it?
`useCallback` returns a memoized version of a callback function that only changes if dependencies change. It's used for performance optimization.

### Syntax
```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b] // Dependencies
);
```

### Key Concepts
- **Memoization**: Caches function reference
- **Dependencies**: Function recreated only when dependencies change
- **Referential equality**: Same function reference across renders
- **Requires React.memo**: Child components must be wrapped in `React.memo()` to benefit

### When to Use
- Passing callbacks to memoized child components
- Function used as dependency in useEffect/useMemo
- Referential equality matters (e.g., dependency arrays)

### When NOT to Use
- Every function (over-optimization)
- Simple components without performance issues
- Child components not wrapped in React.memo

### Common Interview Questions

#### Q1: What's the difference between useCallback and useMemo?
**A:**
```javascript
// useCallback - memoizes FUNCTIONS
const memoizedCallback = useCallback(() => {
  doSomething();
}, [dep]);

// useMemo - memoizes VALUES (computed results)
const memoizedValue = useMemo(() => {
  return computeExpensiveValue();
}, [dep]);

// They're equivalent for functions:
useCallback(fn, deps) === useMemo(() => fn, deps)
```

#### Q2: Does useCallback prevent all re-renders?
**A:** No! It only helps when:
1. Child component is wrapped in `React.memo()`
2. Function is passed as prop to that child
3. Function reference stability matters

```javascript
// ❌ Doesn't help - child not memoized
<RegularComponent onClick={useCallback(() => {}, [])} />

// ✅ Helps - child is memoized
const MemoComponent = memo(RegularComponent);
<MemoComponent onClick={useCallback(() => {}, [])} />
```

#### Q3: How to avoid dependencies in useCallback?
**A:** Use functional updates:

```javascript
// ❌ Bad - depends on count
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]); // Recreates when count changes

// ✅ Good - no dependencies
const increment = useCallback(() => {
  setCount(c => c + 1); // Functional update
}, []); // Never recreates
```

#### Q4: When should you NOT use useCallback?
**A:**
- **Premature optimization**: Only use when profiling shows actual performance issues
- **Simple components**: Overhead not worth it for trivial components
- **Everywhere**: Using it everywhere adds complexity and memory overhead

### Code Example
```javascript
// Child component with React.memo
const ExpensiveComponent = memo(({ onClick, data }) => {
  console.log('Rendering ExpensiveComponent');

  return (
    <div>
      <button onClick={onClick}>Click me</button>
      <p>{data}</p>
    </div>
  );
});

// Parent component
function Parent() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  // ❌ Without useCallback - ExpensiveComponent re-renders every time
  const handleClick = () => {
    console.log('Clicked!');
  };

  // ✅ With useCallback - ExpensiveComponent only re-renders when needed
  const handleClickMemo = useCallback(() => {
    console.log('Clicked!');
  }, []); // Empty deps = never changes

  return (
    <div>
      <button onClick={() => setOtherState(otherState + 1)}>
        Update Other State (Parent re-renders)
      </button>

      {/* This re-renders every time parent re-renders */}
      <ExpensiveComponent onClick={handleClick} data="Without useCallback" />

      {/* This doesn't re-render when parent re-renders */}
      <ExpensiveComponent onClick={handleClickMemo} data="With useCallback" />
    </div>
  );
}
```

---

## Quick Comparison Table

| Hook | Purpose | When to Use | Common Use Case |
|------|---------|-------------|-----------------|
| **useContext** | Access global state | Avoid prop drilling | Theme, auth, settings |
| **useReducer** | Complex state management | Multiple state updates | Forms, shopping carts |
| **useCallback** | Memoize functions | Optimize performance | Passing callbacks to memoized children |

---

## Tips for Interview Success

### 1. Understand the "Why"
Don't just memorize syntax - understand why each hook exists:
- **useContext**: Solves prop drilling
- **useReducer**: Solves complex state logic
- **useCallback**: Solves unnecessary re-renders

### 2. Know the Trade-offs
Every hook has performance implications:
- **useContext**: All consumers re-render
- **useReducer**: More boilerplate, but better organization
- **useCallback**: Memory overhead, only helps with React.memo

### 3. Practical Examples
Be ready to write code that:
- Creates a context provider
- Writes a reducer function with multiple actions
- Explains when useCallback actually helps

### 4. Common Mistakes to Avoid
```javascript
// ❌ Don't mutate state in reducer
case 'ADD_TODO':
  state.todos.push(newTodo); // WRONG!
  return state;

// ✅ Return new state
case 'ADD_TODO':
  return { ...state, todos: [...state.todos, newTodo] };

// ❌ Don't use useCallback without React.memo
<RegularComponent onClick={useCallback(() => {}, [])} />

// ✅ Use with React.memo
const MemoComponent = memo(RegularComponent);
<MemoComponent onClick={useCallback(() => {}, [])} />

// ❌ Don't forget dependencies
const handleClick = useCallback(() => {
  console.log(count); // Uses count but not in deps
}, []); // WRONG! Stale closure

// ✅ Include all dependencies
const handleClick = useCallback(() => {
  console.log(count);
}, [count]); // Correct
```

---

## Practice Questions

### useContext
1. Explain prop drilling and how useContext solves it
2. How would you optimize context performance?
3. When would you use Context vs Redux?

### useReducer
1. Write a reducer for a todo list with add, delete, and toggle actions
2. How do you handle async operations with useReducer?
3. When would you choose useReducer over useState?

### useCallback
1. Explain when useCallback actually improves performance
2. What's the difference between useCallback and useMemo?
3. Write an example showing useCallback with React.memo

---

## Next Steps

1. **Run the app**: `npm run dev` to see all examples in action
2. **Open console**: See render logs to understand re-render behavior
3. **Experiment**: Modify code to see how changes affect behavior
4. **Build projects**: Create small apps using each hook

## Files Created
- `UseContextDemo.jsx` - Complete useContext examples with theme, user, and settings
- `UseReducerDemo.jsx` - Counter, form, todo list, and shopping cart examples
- `UseCallbackDemo.jsx` - Performance optimization examples with React.memo

Good luck with your frontend interview preparation! 🚀
