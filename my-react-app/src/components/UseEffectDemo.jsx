import {useState, useEffect} from 'react';
import Button from './Button';
import './UseEffectDemo.css';

/**
 * useEffect Hook Demonstration
 *
 * useEffect is for handling side effects in functional components.
 * Side effects include: data fetching, subscriptions, timers, manually changing DOM, logging, etc.
 *
 * Syntax: useEffect(effectFunction, dependencyArray)
 *
 * Key Patterns:
 * 1. No dependency array -> runs after EVERY render
 * 2. Empty array [] -> runs ONCE after initial mount
 * 3. [dep1, dep2] -> runs when dependencies change
 * 4. Return cleanup function -> runs before next effect or unmount
 */
const UseEffectDemo = () => {
    const [count, setCount] = useState(0);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    // PATTERN 1: Effect runs on EVERY render
    // ⚠️ Use sparingly - can cause performance issues
    useEffect(() => {
        console.log('🔄 Component rendered! Count:', count);
        // This runs after every render, even on initial mount

    });

    // PATTERN 2: Effect runs ONCE on mount (empty dependency array)
    // Perfect for: initial data fetch, setup subscriptions, one-time analytics
    useEffect(() => {
        console.log('🚀 Component mounted! Running once.');
        document.title = 'useEffect Demo - React Hooks';

        // Cleanup runs when component unmounts
        return () => {
            console.log('👋 Component will unmount');
            document.title = 'React App';
        };
    }, []); // Empty array = run once

    // PATTERN 3: Effect with specific dependencies
    // Runs when 'count' changes
    useEffect(() => {
        console.log(`📊 Count changed to: ${count}`);

        // Example: Save to localStorage when count changes
        localStorage.setItem('savedCount', count.toString());
    }, [count]); // Only re-run when count changes

    // PATTERN 4: Data fetching with async/await
    // Demonstrates loading states and error handling
    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('check')
        return ()=>{
            console.log('clear')
        }
    }, []);
    // PATTERN 5: Timer/Interval with cleanup
    // This pattern prevents memory leaks by clearing interval on unmount or when timer stops
    useEffect(() => {
        let interval;

        if (isTimerRunning) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }

        // ⚡ CRITICAL: Always cleanup intervals/timeouts
        return () => {
            if (interval) {
                clearInterval(interval);
                console.log('⏱️ Timer cleaned up');
            }
        };
    }, [isTimerRunning]); // Re-run when timer state changes

    // PATTERN 6: Event listeners with cleanup
    // Window resize listener - demonstrates proper cleanup to prevent memory leaks
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup: Remove event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
            console.log('🧹 Resize listener removed');
        };
    }, []); // Only set up once

    // PATTERN 7: Debouncing with useEffect
    // Advanced pattern: Delay API calls until user stops typing
    useEffect(() => {
        // Set up a timer to update debounced value after delay
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
            console.log('🔍 Debounced search term:', searchTerm);
        }, 500); // Wait 500ms after user stops typing

        // Cleanup: Cancel previous timer on every keystroke
        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]); // Run when searchTerm changes

    // PATTERN 8: Conditional effect execution
    // Only fetch when debouncedTerm has a value
    useEffect(() => {
        if (debouncedTerm.length >= 3) {
            console.log('🌐 Would fetch search results for:', debouncedTerm);
            // In real app: fetch(`/api/search?q=${debouncedTerm}`)
        }
    }, [debouncedTerm]);

    const toggleTimer = () => setIsTimerRunning(prev => !prev);
    const resetTimer = () => {
        setIsTimerRunning(false);
        setSeconds(0);
    };

    return (
        <div className="useeffect-container">
            <div className="useeffect-header">
                <h2>useEffect Hook Deep Dive</h2>
                <p className="hook-description">
                    Master side effects, lifecycle events, and async operations
                </p>
            </div>

            {/* Demo 1: Basic Counter with Effect */}
            <div className="demo-card">
                <h3>1️⃣ Basic Effect with Dependencies</h3>
                <p className="demo-explanation">
                    The effect runs when <code>count</code> changes. Check console to see execution.
                    Also persists to localStorage.
                </p>
                <div className="counter-display">{count}</div>
                <div className="button-group">
                    <Button text="Increment" onClick={() => setCount(count + 1)} variant="primary"/>
                    <Button text="Decrement" onClick={() => setCount(count - 1)} variant="secondary"/>
                    <Button text="Reset" onClick={() => setCount(0)} variant="danger"/>
                </div>
                <div className="code-snippet">
          <pre>{`useEffect(() => {
  console.log(\`Count changed to: \${count}\`);
  localStorage.setItem('savedCount', count);
}, [count]); // Runs when count changes`}</pre>
                </div>
            </div>

            {/* Demo 2: Data Fetching */}
            <div className="demo-card">
                <h3>2️⃣ Async Data Fetching</h3>
                <p className="demo-explanation">
                    Demonstrates API calls, loading states, and proper async/await patterns.
                </p>
                <Button
                    text={loading ? "Loading..." : "Fetch User Data"}
                    onClick={fetchUser}
                    variant="primary"
                    disabled={loading}
                />
                {/*condition rendering*/}
                {user && (
                    <div className="user-data">
                        <h4>{user.name}</h4>
                        <p>Email: {user.email}</p>
                        <p>Company: {user.company.name}</p>
                        <p>Website: {user.website}</p>
                    </div>
                )}
                <div className="code-snippet">
          <pre>{`useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(url);
    const data = await response.json();
    setData(data);
    setLoading(false);
  };
  fetchData();
}, []); // Empty array = run once on mount`}</pre>
                </div>
            </div>

            {/* Demo 3: Timer with Cleanup */}
            <div className="demo-card">
                <h3>3️⃣ Interval with Cleanup</h3>
                <p className="demo-explanation">
                    Critical pattern: Always cleanup timers to prevent memory leaks.
                    The cleanup function runs before the next effect and on unmount.
                </p>
                <div className="timer-display">{seconds}s</div>
                <div className="button-group">
                    <Button
                        text={isTimerRunning ? "Pause" : "Start"}
                        onClick={toggleTimer}
                        variant={isTimerRunning ? "secondary" : "primary"}
                    />
                    <Button text="Reset" onClick={resetTimer} variant="danger"/>
                </div>
                <div className="code-snippet">
          <pre>{`useEffect(() => {
  const interval = setInterval(() => {
    setSeconds(prev => prev + 1);
  }, 1000);

  return () => clearInterval(interval); // ⚡ Cleanup
}, [isTimerRunning]);`}</pre>
                </div>
            </div>

            {/* Demo 4: Event Listeners */}
            <div className="demo-card">
                <h3>4️⃣ Event Listeners with Cleanup</h3>
                <p className="demo-explanation">
                    Window resize listener. Resize your browser window to see it update.
                    Always remove event listeners in cleanup.
                </p>
                <div className="window-width">
                    Window Width: <strong>{windowWidth}px</strong>
                </div>
                <div className="code-snippet">
          <pre>{`useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []); // Set up once`}</pre>
                </div>
            </div>

            {/* Demo 5: Debouncing */}
            <div className="demo-card">
                <h3>5️⃣ Advanced: Debouncing Search</h3>
                <p className="demo-explanation">
                    Delays API calls until user stops typing (500ms). Essential for search autocomplete.
                    Check console to see debounce in action.
                </p>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type to search (debounced)..."
                    className="search-input"
                />
                <div className="debounce-info">
                    <p>Current Input: <code>{searchTerm}</code></p>
                    <p>Debounced Value: <code>{debouncedTerm}</code></p>
                </div>
                <div className="code-snippet">
          <pre>{`useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm);
    // API call here
  }, 500); // Wait 500ms

  return () => clearTimeout(timer); // Cancel on new keystroke
}, [searchTerm]);`}</pre>
                </div>
            </div>

            {/* Key Takeaways */}
            <div className="demo-card key-takeaways">
                <h3>🎯 Key Takeaways</h3>
                <ul>
                    <li><strong>Always cleanup:</strong> Return cleanup function for subscriptions, timers, listeners
                    </li>
                    <li><strong>Dependencies matter:</strong> Missing dependencies = stale closures. Extra dependencies
                        = unnecessary re-runs
                    </li>
                    <li><strong>One effect per concern:</strong> Separate effects for different purposes (better
                        readability & debugging)
                    </li>
                    <li><strong>Async/await:</strong> Cannot make useEffect callback async directly. Create async
                        function inside
                    </li>
                    <li><strong>Execution order:</strong> Effects run AFTER render, cleanup runs BEFORE next effect or
                        unmount
                    </li>
                    <li><strong>Common pitfalls:</strong> Infinite loops (missing deps), memory leaks (no cleanup),
                        stale closures
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UseEffectDemo;
