import { useReducer, useState } from 'react';
import Button from './Button';
import './UseReducerDemo.css';

/**
 * useReducer Hook Demonstration
 *
 * useReducer is an alternative to useState for managing complex state logic.
 * It's similar to Redux reducers - you dispatch actions to update state.
 *
 * Syntax: const [state, dispatch] = useReducer(reducer, initialState)
 *
 * When to use useReducer over useState:
 * 1. Complex state logic with multiple sub-values
 * 2. Next state depends on previous state
 * 3. Multiple actions that update state
 * 4. State transitions that follow specific rules
 * 5. Want to optimize performance (dispatch is stable, doesn't change)
 *
 * Reducer function pattern:
 * (state, action) => newState
 */

// ==================== PATTERN 1: Simple Counter Reducer ====================
// Initial state for counter
const counterInitialState = { count: 0 };

// Reducer function: Takes current state and action, returns new state
function counterReducer(state, action) {
  // Switch statement is common pattern for handling different action types
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'INCREMENT_BY':
      return { count: state.count + action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// ==================== PATTERN 2: Complex Form Reducer ====================
const formInitialState = {
  username: '',
  email: '',
  password: '',
  age: '',
  errors: {},
  isSubmitting: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: '' } // Clear error on change
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error }
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors
      };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_SUCCESS':
      return formInitialState; // Reset form on success
    case 'SUBMIT_FAILURE':
      return { ...state, isSubmitting: false };
    case 'RESET_FORM':
      return formInitialState;
    default:
      return state;
  }
}

// ==================== PATTERN 3: Todo List Reducer ====================
const todoInitialState = {
  todos: [],
  filter: 'all', // all, active, completed
  nextId: 1
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: state.nextId, text: action.text, completed: false }
        ],
        nextId: state.nextId + 1
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      };
    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id ? { ...todo, text: action.text } : todo
        )
      };
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };
    default:
      return state;
  }
}

// ==================== PATTERN 4: Shopping Cart Reducer ====================
const cartInitialState = {
  items: [],
  total: 0
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.item.id);

      if (existingItem) {
        // Item exists, increase quantity
        const updatedItems = state.items.map(item =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: state.total + action.item.price
        };
      } else {
        // New item
        return {
          items: [...state.items, { ...action.item, quantity: 1 }],
          total: state.total + action.item.price
        };
      }
    }
    case 'REMOVE_ITEM': {
      const item = state.items.find(item => item.id === action.id);
      return {
        items: state.items.filter(item => item.id !== action.id),
        total: state.total - (item.price * item.quantity)
      };
    }
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.id);
      const quantityDiff = action.quantity - item.quantity;

      return {
        items: state.items.map(item =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        ),
        total: state.total + (item.price * quantityDiff)
      };
    }
    case 'CLEAR_CART':
      return cartInitialState;
    default:
      return state;
  }
}

const UseReducerDemo = () => {
  // Using multiple reducers in one component
  const [counterState, counterDispatch] = useReducer(counterReducer, counterInitialState);
  const [formState, formDispatch] = useReducer(formReducer, formInitialState);
  const [todoState, todoDispatch] = useReducer(todoReducer, todoInitialState);
  const [cartState, cartDispatch] = useReducer(cartReducer, cartInitialState);

  // Local state for form inputs
  const [todoInput, setTodoInput] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Sample products for cart demo
  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Keyboard', price: 79 }
  ];

  // Form validation and submission
  const validateForm = () => {
    const errors = {};

    if (!formState.username.trim()) {
      errors.username = 'Username is required';
    } else if (formState.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formState.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formState.password) {
      errors.password = 'Password is required';
    } else if (formState.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formState.age) {
      errors.age = 'Age is required';
    } else if (formState.age < 18 || formState.age > 100) {
      errors.age = 'Age must be between 18 and 100';
    }

    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      formDispatch({ type: 'SET_ERRORS', errors });
      return;
    }

    formDispatch({ type: 'SUBMIT_START' });

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formState);
      alert('Form submitted successfully!');
      formDispatch({ type: 'SUBMIT_SUCCESS' });
    }, 1000);
  };

  // Todo functions
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (todoInput.trim()) {
      todoDispatch({ type: 'ADD_TODO', text: todoInput });
      setTodoInput('');
    }
  };

  const handleEditTodo = (id, text) => {
    setEditingTodoId(id);
    setEditingText(text);
  };

  const handleSaveEdit = (id) => {
    if (editingText.trim()) {
      todoDispatch({ type: 'EDIT_TODO', id, text: editingText });
    }
    setEditingTodoId(null);
    setEditingText('');
  };

  // Filter todos
  const getFilteredTodos = () => {
    switch (todoState.filter) {
      case 'active':
        return todoState.todos.filter(todo => !todo.completed);
      case 'completed':
        return todoState.todos.filter(todo => todo.completed);
      default:
        return todoState.todos;
    }
  };

  return (
    <div className="usereducer-container">
      <div className="usereducer-header">
        <h2>useReducer Hook Deep Dive</h2>
        <p className="hook-description">
          Master complex state management with reducer pattern
        </p>
      </div>

      {/* Demo 1: Simple Counter */}
      <div className="demo-card">
        <h3>1️⃣ Basic Reducer Pattern</h3>
        <p className="demo-explanation">
          Simple counter demonstrating core reducer concepts: state, actions, dispatch.
        </p>
        <div className="counter-display">{counterState.count}</div>
        <div className="button-group">
          <Button
            text="Increment"
            onClick={() => counterDispatch({ type: 'INCREMENT' })}
            variant="primary"
          />
          <Button
            text="Decrement"
            onClick={() => counterDispatch({ type: 'DECREMENT' })}
            variant="secondary"
          />
          <Button
            text="+5"
            onClick={() => counterDispatch({ type: 'INCREMENT_BY', payload: 5 })}
            variant="primary"
          />
          <Button
            text="Reset"
            onClick={() => counterDispatch({ type: 'RESET' })}
            variant="danger"
          />
        </div>
        <div className="code-snippet">
          <pre>{`// 1. Define reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'INCREMENT_BY':
      return { count: state.count + action.payload };
    default:
      return state;
  }
}

// 2. Use reducer in component
const [state, dispatch] = useReducer(counterReducer, { count: 0 });

// 3. Dispatch actions
dispatch({ type: 'INCREMENT' });
dispatch({ type: 'INCREMENT_BY', payload: 5 });`}</pre>
        </div>
      </div>

      {/* Demo 2: Complex Form */}
      <div className="demo-card">
        <h3>2️⃣ Complex Form State Management</h3>
        <p className="demo-explanation">
          Managing multiple form fields, validation, and submission states with one reducer.
        </p>
        <form onSubmit={handleFormSubmit} className="demo-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={formState.username}
              onChange={(e) => formDispatch({
                type: 'UPDATE_FIELD',
                field: 'username',
                value: e.target.value
              })}
              className={formState.errors.username ? 'error' : ''}
            />
            {formState.errors.username && (
              <span className="error-message">{formState.errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formState.email}
              onChange={(e) => formDispatch({
                type: 'UPDATE_FIELD',
                field: 'email',
                value: e.target.value
              })}
              className={formState.errors.email ? 'error' : ''}
            />
            {formState.errors.email && (
              <span className="error-message">{formState.errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={formState.password}
              onChange={(e) => formDispatch({
                type: 'UPDATE_FIELD',
                field: 'password',
                value: e.target.value
              })}
              className={formState.errors.password ? 'error' : ''}
            />
            {formState.errors.password && (
              <span className="error-message">{formState.errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              value={formState.age}
              onChange={(e) => formDispatch({
                type: 'UPDATE_FIELD',
                field: 'age',
                value: parseInt(e.target.value) || ''
              })}
              className={formState.errors.age ? 'error' : ''}
            />
            {formState.errors.age && (
              <span className="error-message">{formState.errors.age}</span>
            )}
          </div>

          <div className="button-group">
            <Button
              text={formState.isSubmitting ? 'Submitting...' : 'Submit'}
              type="submit"
              variant="primary"
              disabled={formState.isSubmitting}
            />
            <Button
              text="Reset Form"
              onClick={() => formDispatch({ type: 'RESET_FORM' })}
              variant="danger"
              type="button"
            />
          </div>
        </form>

        <div className="code-snippet">
          <pre>{`// Handling complex form state
function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: '' }
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    default:
      return state;
  }
}

// Dispatch with payload
dispatch({ type: 'UPDATE_FIELD', field: 'email', value: 'test@example.com' });`}</pre>
        </div>
      </div>

      {/* Demo 3: Todo List */}
      <div className="demo-card">
        <h3>3️⃣ Todo List with Filters</h3>
        <p className="demo-explanation">
          Complex state with arrays, filtering, and multiple operations.
        </p>

        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <Button text="Add Todo" type="submit" variant="primary" />
        </form>

        <div className="filter-buttons">
          <Button
            text="All"
            onClick={() => todoDispatch({ type: 'SET_FILTER', filter: 'all' })}
            variant={todoState.filter === 'all' ? 'primary' : 'secondary'}
          />
          <Button
            text="Active"
            onClick={() => todoDispatch({ type: 'SET_FILTER', filter: 'active' })}
            variant={todoState.filter === 'active' ? 'primary' : 'secondary'}
          />
          <Button
            text="Completed"
            onClick={() => todoDispatch({ type: 'SET_FILTER', filter: 'completed' })}
            variant={todoState.filter === 'completed' ? 'primary' : 'secondary'}
          />
          <Button
            text="Clear Completed"
            onClick={() => todoDispatch({ type: 'CLEAR_COMPLETED' })}
            variant="danger"
          />
        </div>

        <ul className="todo-list">
          {getFilteredTodos().map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingTodoId === todo.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="edit-input"
                  />
                  <Button
                    text="Save"
                    onClick={() => handleSaveEdit(todo.id)}
                    variant="primary"
                  />
                  <Button
                    text="Cancel"
                    onClick={() => setEditingTodoId(null)}
                    variant="secondary"
                  />
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => todoDispatch({ type: 'TOGGLE_TODO', id: todo.id })}
                    className="todo-checkbox"
                  />
                  <span className="todo-text">{todo.text}</span>
                  <div className="todo-actions">
                    <Button
                      text="Edit"
                      onClick={() => handleEditTodo(todo.id, todo.text)}
                      variant="secondary"
                    />
                    <Button
                      text="Delete"
                      onClick={() => todoDispatch({ type: 'DELETE_TODO', id: todo.id })}
                      variant="danger"
                    />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="code-snippet">
          <pre>{`// Todo reducer with array operations
case 'ADD_TODO':
  return {
    ...state,
    todos: [...state.todos, { id: nextId, text, completed: false }]
  };

case 'TOGGLE_TODO':
  return {
    ...state,
    todos: state.todos.map(todo =>
      todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
    )
  };

case 'DELETE_TODO':
  return {
    ...state,
    todos: state.todos.filter(todo => todo.id !== action.id)
  };`}</pre>
        </div>
      </div>

      {/* Demo 4: Shopping Cart */}
      <div className="demo-card">
        <h3>4️⃣ Shopping Cart (Advanced)</h3>
        <p className="demo-explanation">
          Complex calculations and nested state updates in reducer.
        </p>

        <div className="products-grid">
          <h4>Products:</h4>
          {products.map(product => (
            <div key={product.id} className="product-card">
              <h5>{product.name}</h5>
              <p className="price">${product.price}</p>
              <Button
                text="Add to Cart"
                onClick={() => cartDispatch({ type: 'ADD_ITEM', item: product })}
                variant="primary"
              />
            </div>
          ))}
        </div>

        <div className="cart-section">
          <h4>Shopping Cart:</h4>
          {cartState.items.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <ul className="cart-items">
                {cartState.items.map(item => (
                  <li key={item.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">${item.price} x {item.quantity}</span>
                    </div>
                    <div className="item-actions">
                      <Button
                        text="-"
                        onClick={() => {
                          if (item.quantity > 1) {
                            cartDispatch({
                              type: 'UPDATE_QUANTITY',
                              id: item.id,
                              quantity: item.quantity - 1
                            });
                          }
                        }}
                        variant="secondary"
                      />
                      <span className="quantity">{item.quantity}</span>
                      <Button
                        text="+"
                        onClick={() => cartDispatch({
                          type: 'UPDATE_QUANTITY',
                          id: item.id,
                          quantity: item.quantity + 1
                        })}
                        variant="secondary"
                      />
                      <Button
                        text="Remove"
                        onClick={() => cartDispatch({ type: 'REMOVE_ITEM', id: item.id })}
                        variant="danger"
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <strong>Total: ${cartState.total}</strong>
              </div>
              <Button
                text="Clear Cart"
                onClick={() => cartDispatch({ type: 'CLEAR_CART' })}
                variant="danger"
              />
            </>
          )}
        </div>

        <div className="code-snippet">
          <pre>{`// Cart reducer with complex logic
case 'ADD_ITEM': {
  const existingItem = state.items.find(item => item.id === action.item.id);

  if (existingItem) {
    return {
      items: state.items.map(item =>
        item.id === action.item.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
      total: state.total + action.item.price
    };
  }
  return {
    items: [...state.items, { ...action.item, quantity: 1 }],
    total: state.total + action.item.price
  };
}`}</pre>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="demo-card key-takeaways">
        <h3>🎯 Key Interview Points</h3>
        <ul>
          <li><strong>When to use useReducer:</strong> Complex state logic, multiple sub-values, next state depends on previous, many actions</li>
          <li><strong>vs useState:</strong> useState for simple state, useReducer for complex state with multiple update patterns</li>
          <li><strong>Reducer pattern:</strong> (state, action) =&gt; newState. Pure function, no side effects, always returns new state</li>
          <li><strong>Action structure:</strong> Usually {`{ type: 'ACTION_NAME', payload: data }`}. Type identifies action, payload carries data</li>
          <li><strong>Immutability:</strong> Never mutate state directly. Always return new objects/arrays using spread operator</li>
          <li><strong>Performance:</strong> dispatch function is stable (doesn't change), good for passing to child components</li>
          <li><strong>With Context:</strong> Often combined with useContext to create global state management (Redux pattern)</li>
          <li><strong>Debugging:</strong> Easy to log actions and state changes. Reducer logic is testable (pure function)</li>
          <li><strong>Initial state:</strong> Can pass lazy initializer function as 3rd parameter: useReducer(reducer, initialArg, init)</li>
        </ul>

        <div className="code-snippet">
          <pre>{`// Common Interview Question: useReducer vs useState

// ❌ Complex with useState - hard to manage
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

// ✅ Cleaner with useReducer - single dispatch
const [state, dispatch] = useReducer(formReducer, initialState);

// Dispatching actions
dispatch({ type: 'UPDATE_FIELD', field: 'username', value: 'john' });
dispatch({ type: 'SUBMIT_START' });

// Reducer benefits:
// 1. Centralized state logic
// 2. Easier to test (pure function)
// 3. Better for complex state transitions
// 4. dispatch is stable (no re-renders from passing to children)`}</pre>
        </div>
      </div>
    </div>
  );
};

export default UseReducerDemo;
