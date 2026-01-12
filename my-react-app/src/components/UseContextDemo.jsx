import {useState, useContext, createContext} from 'react';
import Button from './Button';
import './UseContextDemo.css';

/**
 * useContext Hook Demonstration
 *
 * useContext allows you to consume context values without prop drilling.
 * Context provides a way to pass data through the component tree without
 * having to pass props down manually at every level.
 *
 * When to use:
 * - Theme data (dark mode, colors)
 * - User authentication data
 * - Language/localization preferences
 * - Global app settings
 *
 * Key Concepts:
 * 1. Create context with createContext()
 * 2. Wrap components with Context.Provider
 * 3. Consume context with useContext(Context)
 * 4. Any component can access context without prop drilling
 */

// STEP 1: Create Contexts
// Theme Context - for managing app theme
const ThemeContext = createContext();

// User Context - for managing user data
const UserContext = createContext();

// Settings Context - for app-wide settings
const SettingsContext = createContext();

/**
 * PATTERN 1: Simple Theme Toggler
 * Demonstrates basic context usage for global theme state
 */
const ThemedButton = () => {
    // STEP 3: Consume context with useContext
    const {theme, toggleTheme} = useContext(ThemeContext);

    return (
        <div className={`themed-section ${theme}`}>
            <h4>Current Theme: {theme}</h4>
            <Button
                text={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                onClick={toggleTheme}
                variant="primary"
            />
            <p className="explanation">
                This component can access theme without receiving it as props!
            </p>
        </div>
    );
};

/**
 * PATTERN 2: Nested Context Consumer
 * Shows how deeply nested components can access context
 */
const DeepNestedComponent = () => {
    const {theme} = useContext(ThemeContext);
    const {user} = useContext(UserContext);

    return (
        <div className={`nested-component ${theme}`}>
            <h4>Deep Nested Component</h4>
            <p>Welcome, {user.name}! (Role: {user.role})</p>
            <p>Theme: {theme}</p>
            <p className="explanation">
                No prop drilling needed! This is 3 levels deep but accesses context directly.
            </p>
        </div>
    );
};

const MiddleComponent = () => {
    // Notice: We don't need to receive or pass any props!
    return (
        <div className="middle-component">
            <h4>Middle Component (doesn't use context)</h4>
            <DeepNestedComponent/>
        </div>
    );
};

/**
 * PATTERN 3: Multiple Context Consumption
 * Component consuming multiple contexts at once
 */
const UserProfile = () => {
    const {user, updateUser} = useContext(UserContext);
    const {theme} = useContext(ThemeContext);
    const {settings, updateSettings} = useContext(SettingsContext);

    return (
        <div className={`user-profile ${theme}`}>
            <h4>User Profile</h4>
            <div className="profile-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Notifications:</strong> {settings.notifications ? 'ON' : 'OFF'}</p>
                <p><strong>Language:</strong> {settings.language}</p>
            </div>

            <div className="profile-actions">
                <Button
                    text="Toggle Notifications"
                    onClick={() => updateSettings({
                        ...settings,
                        notifications: !settings.notifications
                    })}
                    variant="secondary"
                />
                <Button
                    text="Change Language"
                    onClick={() => updateSettings({
                        ...settings,
                        language: settings.language === 'en' ? 'es' : 'en'
                    })}
                    variant="secondary"
                />
            </div>
        </div>
    );
};

/**
 * PATTERN 4: Context with Complex State
 * Demonstrates managing and updating complex state through context
 */
const SettingsPanel = () => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {theme} = useContext(ThemeContext);

    const toggleAutoSave = () => {
        updateSettings({...settings, autoSave: !settings.autoSave});
    };

    return (
        <div className={`settings-panel ${theme}`}>
            <h4>Settings Panel</h4>
            <div className="settings-list">
                <label className="setting-item">
                    <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => updateSettings({...settings, notifications: e.target.checked})}
                    />
                    Enable Notifications
                </label>

                <label className="setting-item">
                    <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={toggleAutoSave}
                    />
                    Auto-save
                </label>

                <label className="setting-item">
                    <span>Language:</span>
                    <select
                        value={settings.language}
                        onChange={(e) => updateSettings({...settings, language: e.target.value})}
                    >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

/**
 * Main Demo Component
 * STEP 2: Provides context values to all children
 */
const UseContextDemo = () => {
    // State that will be shared through contexts
    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState({
        name: 'Avinash',
        email: 'avinash@example.com',
        role: 'Frontend Developer'
    });
    const [settings, setSettings] = useState({
        notifications: true,
        language: 'en',
        autoSave: true
    });

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <div className={`usecontext-container ${theme}`}>
            <div className="usecontext-header">
                <h2>useContext Hook Deep Dive</h2>
                <p className="hook-description">
                    Avoid prop drilling and manage global state efficiently
                </p>
            </div>

            {/* STEP 2: Wrap components with Providers */}
            {/* Multiple providers can be nested */}
            <ThemeContext.Provider value={{theme, toggleTheme}}>
                <UserContext.Provider value={{user, updateUser: setUser}}>
                    <SettingsContext.Provider value={{settings, updateSettings: setSettings}}>

                        {/* Demo 1: Basic Theme Context */}
                        <div className="demo-card">
                            <h3>1️⃣ Basic Context Usage</h3>
                            <p className="demo-explanation">
                                Theme context shared across components without prop drilling.
                            </p>
                            <ThemedButton/>
                            <div className="code-snippet">
                            <pre>{`// 1. Create Context
                                const ThemeContext = createContext();
                                
                                // 2. Provide Value
                                <ThemeContext.Provider value={{ theme, toggleTheme }}>
                                  <ThemedButton />
                                </ThemeContext.Provider>
                                
                                // 3. Consume Context
                                const ThemedButton = () => {
                                  const { theme, toggleTheme } = useContext(ThemeContext);
                                  return <button onClick={toggleTheme}>{theme}</button>;
                                };`}
                                </pre>
                            </div>
                        </div>

                        {/* Demo 2: Deeply Nested Components */}
                        <div className="demo-card">
                            <h3>2️⃣ No Prop Drilling</h3>
                            <p className="demo-explanation">
                                Components at any depth can access context directly.
                            </p>
                            <MiddleComponent/>
                            <div className="code-snippet">
                <pre>{`// Middle component doesn't need to pass props
const MiddleComponent = () => {
  return <DeepNestedComponent />; // No props needed!
};

// Deep component accesses context directly
const DeepNestedComponent = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  return <div>{user.name} - {theme}</div>;
};`}</pre>
                            </div>
                        </div>

                        {/* Demo 3: Multiple Contexts */}
                        <div className="demo-card">
                            <h3>3️⃣ Multiple Context Consumption</h3>
                            <p className="demo-explanation">
                                A component can consume multiple contexts simultaneously.
                            </p>
                            <UserProfile/>
                            <div className="code-snippet">
                <pre>{`// Consuming multiple contexts in one component
const UserProfile = () => {
  const { user, updateUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const { settings } = useContext(SettingsContext);

  return (
    <div>
      <p>{user.name} - {theme} - {settings.language}</p>
    </div>
  );
};`}</pre>
                            </div>
                        </div>

                        {/* Demo 4: Complex State Management */}
                        <div className="demo-card">
                            <h3>4️⃣ Managing Complex State</h3>
                            <p className="demo-explanation">
                                Context can manage and update complex nested state objects.
                            </p>
                            <SettingsPanel/>
                            <div className="code-snippet">
                <pre>{`const [settings, setSettings] = useState({
  notifications: true,
  language: 'en',
  autoSave: true
});

<SettingsContext.Provider value={{
  settings,
  updateSettings: setSettings
}}>
  <SettingsPanel />
</SettingsContext.Provider>`}</pre>
                            </div>
                        </div>

                        {/* Key Takeaways */}
                        <div className="demo-card key-takeaways">
                            <h3>🎯 Key Interview Points</h3>
                            <ul>
                                <li><strong>What problem does it solve?</strong> Eliminates prop drilling - passing
                                    props through many levels
                                </li>
                                <li><strong>When to use:</strong> Global state (theme, auth, language), data needed by
                                    many components
                                </li>
                                <li><strong>When NOT to use:</strong> Simple parent-child communication (use props),
                                    frequently changing data (performance issue)
                                </li>
                                <li><strong>Performance:</strong> All consumers re-render when context value changes.
                                    Use React.memo or split contexts for optimization
                                </li>
                                <li><strong>Best practices:</strong> Create separate contexts for different concerns,
                                    provide default values in createContext()
                                </li>
                                <li><strong>Common patterns:</strong> Often combined with useReducer for complex state
                                    management (like Redux)
                                </li>
                                <li><strong>Default value:</strong> Second argument in createContext() used only when
                                    component has no Provider above it
                                </li>
                            </ul>

                            <div className="code-snippet">
                <pre>{`// Common Interview Question: Context vs Props
// ❌ Bad: Prop Drilling
<Grandparent theme={theme}>
  <Parent theme={theme}>
    <Child theme={theme} />
  </Parent>
</Grandparent>

// ✅ Good: Context
<ThemeContext.Provider value={theme}>
  <Grandparent>
    <Parent>
      <Child /> // Accesses theme directly
    </Parent>
  </Grandparent>
</ThemeContext.Provider>`}</pre>
                            </div>
                        </div>

                    </SettingsContext.Provider>
                </UserContext.Provider>
            </ThemeContext.Provider>
        </div>
    );
};

export default UseContextDemo;
