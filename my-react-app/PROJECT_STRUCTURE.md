# React Props & State Demo - Project Structure

## Overview
This is a basic React application demonstrating the usage of props, state, and a clean file structure.

## File Structure
```
my-react-app/
├── src/
│   ├── components/          # All reusable components
│   │   ├── UserCard.jsx     # Props demo - displays user info
│   │   ├── UserCard.css
│   │   ├── Button.jsx       # Props demo - reusable button
│   │   ├── Button.css
│   │   ├── Counter.jsx      # State demo - simple counter
│   │   ├── Counter.css
│   │   ├── TodoList.jsx     # State demo - todo list
│   │   └── TodoList.css
│   ├── App.jsx              # Main application component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
└── vite.config.js          # Vite configuration
```

## Components Explanation

### Props Demonstration

#### 1. UserCard Component
- **Location**: `src/components/UserCard.jsx`
- **Purpose**: Demonstrates how to pass data from parent to child via props
- **Props**:
  - `name` (string, required) - User's name
  - `age` (number, required) - User's age
  - `email` (string, required) - User's email
  - `role` (string, required) - User's role
- **Key Concepts**:
  - Receiving props as function parameters
  - PropTypes for type checking
  - Using props to render dynamic content

#### 2. Button Component
- **Location**: `src/components/Button.jsx`
- **Purpose**: Reusable button showing props customization
- **Props**:
  - `text` (string, required) - Button label
  - `onClick` (function, required) - Click handler
  - `variant` (string, optional) - Button style: 'primary', 'secondary', or 'danger'
  - `disabled` (boolean, optional) - Whether button is disabled
- **Key Concepts**:
  - Default prop values
  - Conditional styling based on props
  - Passing functions as props

### State Demonstration

#### 3. Counter Component
- **Location**: `src/components/Counter.jsx`
- **Purpose**: Simple state management example
- **State**:
  - `count` (number) - Current counter value
- **Key Concepts**:
  - Using `useState` hook
  - Updating state with setter function
  - Multiple state update functions

#### 4. TodoList Component
- **Location**: `src/components/TodoList.jsx`
- **Purpose**: Complex state management with arrays of objects
- **State**:
  - `todos` (array) - List of todo items
  - `inputValue` (string) - Current input field value
- **Key Concepts**:
  - Managing complex state (arrays of objects)
  - Updating nested state immutably
  - Conditional rendering based on state
  - Event handling (onChange, onClick, onKeyPress)

## How Props Work

Props (properties) are how data flows from parent to child components:
- **Read-only**: Components cannot modify their props
- **Passed down**: Parent passes data to children
- **Type checking**: Can use PropTypes for validation

Example:
```jsx
// Parent component
<UserCard name="John" age={28} email="john@example.com" role="Developer" />

// Child component
const UserCard = ({ name, age, email, role }) => {
  return <div>{name}</div>; // Uses the props
};
```

## How State Works

State is data that a component manages internally:
- **Mutable**: Components can update their own state
- **Local**: Each component instance has its own state
- **Reactive**: UI updates when state changes

Example:
```jsx
const Counter = () => {
  const [count, setCount] = useState(0); // Initialize state

  const increment = () => setCount(count + 1); // Update state

  return <div>{count}</div>; // Display state
};
```

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser to the URL shown (usually http://localhost:5173)

## Key Takeaways

1. **Props** = Data passed from parent to child (immutable)
2. **State** = Data managed within a component (mutable)
3. **File Structure** = Organized components folder with component-specific CSS
4. **Reusability** = Components like Button can be used multiple times with different props
5. **Separation of Concerns** = Each component has its own file and styles
