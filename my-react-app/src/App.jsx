import UserCard from './components/UserCard';
import Button from './components/Button';
import Counter from './components/Counter';
import TodoList from './components/TodoList';
import UseEffectDemo from './components/UseEffectDemo';
import UseRefDemo from './components/UseRefDemo';
import UseMemoDemo from './components/UseMemoDemo';
import UseContextDemo from './components/UseContextDemo';
import UseReducerDemo from './components/UseReducerDemo';
import UseCallbackDemo from './components/UseCallbackDemo';
import './App.css';

function App() {
  const handleButtonClick = (buttonName) => {
    alert(`You clicked the ${buttonName} button!`);
  };
  return (
    <div className="App">
      <header className="app-header">
        <h1>React Hooks Learning Hub</h1>
        <p>Master React fundamentals, hooks, and advanced patterns</p>
      </header>

      <main className="app-main">
        <section className="demo-section">
          <h2 className="section-title">Props Demonstration</h2>
          <p className="section-description">
            Components receiving data from parent via props
          </p>
          con
          <div className="user-cards">
            <UserCard
              name="John Doe"
              age={24}
              email="john@example.com"
              role="Frontend Developer"
            />
            <UserCard
              name="Jane Smith"
              age={32}
              email="jane@example.com"
              role="Backend Developer"
            />
            <UserCard
              name="Mike Johnson"
              age={25}
              email="mike@example.com"
              role="UI/UX Designer"
            />
          </div>

          <div className="button-demo">
            <h3>Button Component (Props Demo)</h3>
            <Button
              text="Primary Button"
              onClick={() => handleButtonClick('Primary')}
              // variant="primary"
            />
            <Button
              text="Secondary Button"
              onClick={() => handleButtonClick('Secondary')}
              variant="secondary"
            />
            <Button
              text="Danger Button"
              onClick={() => handleButtonClick('Danger')}
              variant="danger"
            />
            <Button
              text="Disabled Button"
              onClick={() => handleButtonClick('Disabled')}
              variant="primary"
              disabled={true}
            />
          </div>
        </section>

        <section className="demo-section">
          <h2 className="section-title">State Demonstration (useState)</h2>
          <p className="section-description">
            Components managing their own internal state
          </p>

          <Counter />
          <TodoList />
        </section>

        <section className="demo-section hooks-section">
          <h2 className="section-title">Advanced React Hooks</h2>
          <p className="section-description">
            Deep dive into useEffect, useRef, and useMemo with real-world examples
          </p>

          <div className="hooks-container">
            <div className="hook-demo">
              <UseEffectDemo />
            </div>

            <div className="hook-demo">
              <UseRefDemo />
            </div>

            <div className="hook-demo">
              <UseMemoDemo />
            </div>
          </div>
        </section>

        <section className="demo-section hooks-section">
          <h2 className="section-title">Interview Prep Hooks</h2>
          <p className="section-description">
            Master useContext, useReducer, and useCallback for frontend interviews
          </p>

          <div className="hooks-container">
            <div className="hook-demo">
              <UseContextDemo />
            </div>

            <div className="hook-demo">
              <UseReducerDemo />
            </div>

            <div className="hook-demo">
              <UseCallbackDemo />
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with React + Vite | Learning React Hooks</p>
      </footer>
    </div>
  );
}

export default App;
