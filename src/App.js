import { useRef, useState, useEffect } from 'react';
import './App.css';
import { BarcodeReader } from "dynamsoft-javascript-barcode";

BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.0.2/dist/";

function App() {
  const [active,setActive] = useState(false);
  const [continuous,setContinuous] = useState(true);
  const decoding = useRef(false);
  const interval = useRef(null);
  const scanned = useRef(false);
  const reader = useRef(null);
  const cameraElement = useRef(null);

  console.log("continuous:");
  console.log(continuous);

  const startCamera = () => {
    setActive(true);
  }

  const stopCamera = () => {
    stopDecoding();
    setActive(false);
  }

  const onOpened = () => {
    console.log("on opened");
    startDecoding();
  }

  useEffect(() => {
    const init = async () => {
      reader.current = await BarcodeReader.createInstance();
    }
    init();
    cameraElement.current.onOpened = onOpened;
    cameraElement.current.desiredResolution = {width:1280,height:720};
  }, []);

  const startDecoding = () => {
    scanned.current = false;
    stopDecoding();
    //1000/25=40
    interval.current = setInterval(decode, 40);
  }

  const stopDecoding = () => {
    clearInterval(interval.current);
  }

  const decode = async () => {
    if (decoding.current === false && reader) {
      console.log("decoding");
      const video = await cameraElement.current.getVideoElement();
      decoding.current = true;
      try {
        var results = await reader.current.decode(video);
        await cameraElement.current.updateAnalysingResults(wrapResults(results));

        console.log(scanned.current);
        console.log(continuous);
        if (results.length>0 && scanned.current === false && continuous === false) {
          scanned.current = true;
          stopDecoding();
          stopCamera();
          alert(results[0].barcodeText);
        }

      } catch (error) {
        console.log(error);
      }
      decoding.current = false;
    }
  }

  const wrapResults = (results) => {
    let analysingResults = [];
    for (let index = 0; index < results.length; index++) {
      const result = results[index];
      let analysingResult = {};
      analysingResult.text = result.barcodeText;
      analysingResult.localizationResult = [
        {x:result.localizationResult.x1,y:result.localizationResult.y1},
        {x:result.localizationResult.x2,y:result.localizationResult.y2},
        {x:result.localizationResult.x3,y:result.localizationResult.y3},
        {x:result.localizationResult.x4,y:result.localizationResult.y4}
      ];
      analysingResults.push(analysingResult)
    }
    return analysingResults;
  }

  const updateContinuous = (e) => {
    console.log("updateContinuous");
    console.log(e);
    setContinuous(!continuous);
  }

  return (
    <div>
      <camera-preview 
        ref={cameraElement}
        active={active}
        desired-camera="founder"
        draw-overlay={true}
        style={{display:active ? '' :' none'}}
      >
        <button id="close-btn" onClick={stopCamera}>Close</button>
      </camera-preview>
      <div style={{display:active ? 'none' : ''}}>
        <button onClick={startCamera} >Start Scanning</button>
        <label>
        <input
          type="checkbox"
          checked={continuous}
          onChange={updateContinuous}
        />
        Continuous Scan
        </label>
      </div>
    </div>
  );
}

export default App;
