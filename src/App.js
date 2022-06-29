import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const [active,setActive] = useState(false);
  
  const cameraElement = useRef(null);
  const startScan = () => {
    setActive(true);
  }

  const stopScan = () => {
    setActive(false);
  }

  return (
    <div>
      <camera-preview 
        ref={cameraElement}
        active={active}
        desired-camera="founder"
        style={{display:active ? '' :' none'}}
      >
        <button id="close-btn" onClick={stopScan}>Close</button>
      </camera-preview>
      <div style={{display:active ? 'none' : ''}}>
        <button onClick={startScan} >Start Scanning</button>
      </div>
    </div>
  );
}

export default App;
