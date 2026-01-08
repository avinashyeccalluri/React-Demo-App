import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import './UseRefDemo.css';

/**
 * useRef Hook Demonstration
 *
 * useRef returns a mutable ref object with a .current property.
 * Unlike useState, changing a ref does NOT trigger a re-render.
 *
 * Key Use Cases:
 * 1. Accessing DOM elements directly (like document.querySelector)
 * 2. Storing mutable values that persist across renders (won't trigger re-render)
 * 3. Tracking previous values
 * 4. Managing timers, intervals, and third-party library instances
 * 5. Avoiding stale closures in callbacks
 *
 * Syntax: const myRef = useRef(initialValue)
 * Access/Modify: myRef.current
 */

const UseRefDemo = () => {
  // STATE (triggers re-renders)
  const [count, setCount] = useState(0);
  const [renderCount, setRenderCount] = useState(0);
  const [name, setName] = useState('');
  const [videoPlaying, setVideoPlaying] = useState(false);

  // REFS (do NOT trigger re-renders)
  const inputRef = useRef(null); // For DOM access
  const previousCountRef = useRef(0); // Track previous value
  const renderCountRef = useRef(0); // Count renders without causing re-render
  const timerRef = useRef(null); // Store timer ID
  const clickCountRef = useRef(0); // Mutable value that doesn't need re-render
  const videoRef = useRef(null); // DOM element (video/audio)
  const hasRenderedRef = useRef(false); // Skip first render in useEffect

  // PATTERN 1: Tracking renders without causing infinite loop
  // Using useState here would cause infinite re-renders!
  useEffect(() => {
    renderCountRef.current = renderCountRef.current + 1;
    console.log(`🔄 Component has rendered ${renderCountRef.current} times`);
  });

  // PATTERN 2: Storing previous value
  // Very useful for comparing current vs previous state
  useEffect(() => {
    previousCountRef.current = count;
  }, [count]);

  // PATTERN 3: Skip first render (componentDidUpdate equivalent)
  useEffect(() => {
    if (hasRenderedRef.current) {
      console.log('Name changed to:', name);
      // This won't run on initial mount, only on updates
    } else {
      hasRenderedRef.current = true;
    }
  }, [name]);

  // PATTERN 1: DOM Access - Focus Input
  const focusInput = () => {
    // Directly access DOM element
    inputRef.current?.focus();
    inputRef.current?.select(); // Also select the text
  };

  // PATTERN 2: DOM Access - Scroll to Element
  const scrollToInput = () => {
    inputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  // PATTERN 3: Get DOM measurements
  const getInputDimensions = () => {
    if (inputRef.current) {
      const { offsetWidth, offsetHeight, scrollWidth } = inputRef.current;
      alert(`Width: ${offsetWidth}px\nHeight: ${offsetHeight}px\nScroll Width: ${scrollWidth}px`);
    }
  };

  // PATTERN 4: Mutable value without re-render
  const handleFastClick = () => {
    clickCountRef.current += 1;
    console.log(`🖱️ Clicked ${clickCountRef.current} times (no re-render!)`);
    // This doesn't cause re-render, great for high-frequency updates
    // To see the count, you'd need to trigger a re-render with useState
  };

  const showClickCount = () => {
    alert(`You've clicked ${clickCountRef.current} times!`);
  };

  // PATTERN 5: Managing timers with refs
  const startAutoIncrement = () => {
    // Clear existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Store timer ID in ref (persists across re-renders)
    timerRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const stopAutoIncrement = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // PATTERN 6: Video/Audio control
  const toggleVideo = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying(!videoPlaying);
    }
  };

  const seekVideo = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
    }
  };

  return (
    <div className="useref-container">
      <div className="useref-header">
        <h2>useRef Hook Deep Dive</h2>
        <p className="hook-description">
          Access DOM elements and persist mutable values without re-renders
        </p>
      </div>

      {/* Demo 1: DOM Access */}
      <div className="demo-card">
        <h3>1️⃣ DOM Element Access</h3>
        <p className="demo-explanation">
          Use refs to directly access and manipulate DOM elements.
          No need for <code>document.querySelector()</code> or IDs!
        </p>
        <input
          ref={inputRef}
          type="text"
          placeholder="This input can be focused programmatically"
          className="ref-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="button-group">
          <Button text="Focus Input" onClick={focusInput} variant="primary" />
          <Button text="Scroll to Input" onClick={scrollToInput} variant="secondary" />
          <Button text="Get Dimensions" onClick={getInputDimensions} variant="primary" />
        </div>
        <div className="code-snippet">
          <pre>{`const inputRef = useRef(null);

<input ref={inputRef} />

// Direct DOM access
inputRef.current.focus();
inputRef.current.scrollIntoView();
const width = inputRef.current.offsetWidth;`}</pre>
        </div>
      </div>

      {/* Demo 2: Previous Value Tracking */}
      <div className="demo-card">
        <h3>2️⃣ Tracking Previous Values</h3>
        <p className="demo-explanation">
          Refs persist values across renders. Perfect for comparing current vs previous state.
        </p>
        <div className="counter-display">{count}</div>
        <div className="previous-value">
          Previous: <strong>{previousCountRef.current}</strong>
        </div>
        <div className="button-group">
          <Button text="Increment" onClick={() => setCount(count + 1)} variant="primary" />
          <Button text="Decrement" onClick={() => setCount(count - 1)} variant="secondary" />
        </div>
        <div className="code-snippet">
          <pre>{`const previousCountRef = useRef(0);

useEffect(() => {
  previousCountRef.current = count; // Store after render
}, [count]);

// Now you can compare: count vs previousCountRef.current`}</pre>
        </div>
      </div>

      {/* Demo 3: Render Count */}
      <div className="demo-card">
        <h3>3️⃣ Counting Renders (Without Causing Infinite Loop)</h3>
        <p className="demo-explanation">
          Using <code>useState</code> here would cause infinite re-renders!
          Refs let us track without triggering renders.
        </p>
        <div className="render-count">
          This component has rendered: <strong>{renderCountRef.current} times</strong>
        </div>
        <Button
          text="Force Re-render"
          onClick={() => setRenderCount(renderCount + 1)}
          variant="primary"
        />
        <div className="code-snippet">
          <pre>{`const renderCountRef = useRef(0);

useEffect(() => {
  renderCountRef.current += 1; // Doesn't trigger re-render!
  console.log('Rendered', renderCountRef.current, 'times');
});`}</pre>
        </div>
      </div>

      {/* Demo 4: Mutable Values */}
      <div className="demo-card">
        <h3>4️⃣ Mutable Values Without Re-renders</h3>
        <p className="demo-explanation">
          Perfect for high-frequency updates where you don't need UI updates.
          Great for analytics, tracking, temporary storage.
        </p>
        <div className="button-group">
          <Button text="Silent Click (No Re-render)" onClick={handleFastClick} variant="secondary" />
          <Button text="Show Click Count" onClick={showClickCount} variant="primary" />
        </div>
        <p className="demo-note">
          Click "Silent Click" multiple times (check console), then "Show Click Count"
        </p>
        <div className="code-snippet">
          <pre>{`const clickCountRef = useRef(0);

const handleClick = () => {
  clickCountRef.current += 1; // No re-render!
  console.log('Clicks:', clickCountRef.current);
};

// Use case: Analytics, temporary state, counters`}</pre>
        </div>
      </div>

      {/* Demo 5: Timer Management */}
      <div className="demo-card">
        <h3>5️⃣ Managing Timers and Intervals</h3>
        <p className="demo-explanation">
          Store timer IDs in refs to persist them across re-renders and enable cleanup.
          Essential pattern for preventing memory leaks.
        </p>
        <div className="counter-display">{count}</div>
        <div className="button-group">
          <Button text="Start Auto Increment" onClick={startAutoIncrement} variant="primary" />
          <Button text="Stop Auto Increment" onClick={stopAutoIncrement} variant="danger" />
          <Button text="Reset" onClick={() => setCount(0)} variant="secondary" />
        </div>
        <div className="code-snippet">
          <pre>{`const timerRef = useRef(null);

const startTimer = () => {
  timerRef.current = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerRef.current);
  timerRef.current = null;
};

// Cleanup on unmount
useEffect(() => () => clearInterval(timerRef.current), []);`}</pre>
        </div>
      </div>

      {/* Demo 6: Video Control */}
      <div className="demo-card">
        <h3>6️⃣ Media Element Control (Video/Audio)</h3>
        <p className="demo-explanation">
          Control media elements programmatically. Essential for custom video players.
        </p>
        <video
          ref={videoRef}
          className="demo-video"
          loop
          muted
          playsInline
        >
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
          Your browser doesn't support video.
        </video>
        <div className="button-group">
          <Button
            text={videoPlaying ? "Pause" : "Play"}
            onClick={toggleVideo}
            variant={videoPlaying ? "secondary" : "primary"}
          />
          <Button text="Skip to 5s" onClick={() => seekVideo(5)} variant="primary" />
          <Button text="Skip to 10s" onClick={() => seekVideo(10)} variant="primary" />
        </div>
        <div className="code-snippet">
          <pre>{`const videoRef = useRef(null);

<video ref={videoRef} src="video.mp4" />

// Programmatic control
videoRef.current.play();
videoRef.current.pause();
videoRef.current.currentTime = 10; // Seek to 10s
videoRef.current.volume = 0.5;`}</pre>
        </div>
      </div>

      {/* Key Differences: useRef vs useState */}
      <div className="demo-card comparison-card">
        <h3>🆚 useRef vs useState</h3>
        <div className="comparison-grid">
          <div className="comparison-item">
            <h4>useState</h4>
            <ul>
              <li>✅ Triggers re-render on change</li>
              <li>✅ Use for UI state</li>
              <li>✅ Immutable update pattern</li>
              <li>❌ Async updates (batched)</li>
              <li>❌ Creates closures</li>
            </ul>
          </div>
          <div className="comparison-item">
            <h4>useRef</h4>
            <ul>
              <li>✅ NO re-render on change</li>
              <li>✅ Use for instance variables</li>
              <li>✅ Mutable (.current)</li>
              <li>✅ Synchronous updates</li>
              <li>✅ Persists across renders</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="demo-card key-takeaways">
        <h3>🎯 Key Takeaways</h3>
        <ul>
          <li><strong>DOM access:</strong> useRef is the React way to access DOM elements (no IDs needed)</li>
          <li><strong>No re-renders:</strong> Changing .current doesn't trigger re-render (unlike setState)</li>
          <li><strong>Persists across renders:</strong> Value survives re-renders (unlike regular variables)</li>
          <li><strong>Synchronous:</strong> Updates are immediate, not batched like setState</li>
          <li><strong>Timer management:</strong> Perfect for storing setInterval/setTimeout IDs</li>
          <li><strong>Third-party libs:</strong> Store instances of charts, maps, WebSocket connections</li>
          <li><strong>Previous values:</strong> Great for tracking what state was before current render</li>
          <li><strong>When to use:</strong> Need mutable value OR DOM access. Use useState for UI state</li>
        </ul>
      </div>
    </div>
  );
};

export default UseRefDemo;
