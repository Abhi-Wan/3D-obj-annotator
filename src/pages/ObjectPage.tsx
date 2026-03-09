import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Canvas } from '@react-three/fiber';
import { Scene } from '../components/Scene';
import { useModelContext } from '../components/context/ModelContext';
import { useScreenshotContext } from '../components/context/ScreenshotContext';
import { Fallback } from '../components/Fallback';
import { AnnotationType, type SceneRef } from '../utils/types';
import './ObjectPage.css';

export function ObjectPage() {
  const navigate = useNavigate();
  const { modelUrl, fileType, fileName } = useModelContext();

  if (!modelUrl || !fileType) {
    return <Fallback message='Model not found or is no longer available' />
  }

  // Ref for screenshot, undo, and clear functions
  // (defined in Scene to use its state and Canvas context)
  const sceneRef = useRef<SceneRef>(null);

  // Annotation options selection
  const [annotationType, setAnnotationType] = useState<AnnotationType>(AnnotationType.ARROW);

  // State for user setting circle radius
  const [selectingRadius, setSelectingRadius] = useState(false);

  // Screenshot resolution (default device pixel ratio of 2)
  const [quality, setQuality] = useState(2);
  const selectQuality = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const qualitySelected = Number(e.target.value);
    setQuality(qualitySelected);
  }

  const { addScreenshot } = useScreenshotContext();
  const screenshotIdx = useRef(1);

  const handleScreenshot = async () => {
    const url = await sceneRef.current?.screenshot(quality);
    if (!url) {
      alert("Error capturing screenshot, please try again");
      return;
    }

    // Add screenshot to ScreenshotContext for gallery page
    addScreenshot(url);

    // Download captured image
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}-capture-${screenshotIdx.current++}.png`;
    link.click();
  }

  const handleUndo = () => {
    sceneRef.current?.undo();
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all annotations?")) {
      sceneRef.current?.clear();
    }
  }

  return (
    <div className='object-page'>
      <div className='canvas-container' id='canvas-container'>
        {modelUrl && fileType && (
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 1.5], near: 0.01, far: 1000, fov: 50 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <Scene
              annotationType={annotationType}
              ref={sceneRef}
              selectingRadius={selectingRadius}
              onSelectingRadiusChange={setSelectingRadius}
            />
          </Canvas>
        )}
      </div>

      <button onClick={() => navigate('/')} className='back-button'>
        Back
      </button>

      <div className="annotation-container">
        <p className='plain-text'>Annotation:</p>
        {Object.values(AnnotationType).map(opt => (
          <label key={opt}>
            <input
              type="radio"
              name="annotation"
              value={opt}
              checked={annotationType === opt}
              onChange={() => setAnnotationType(opt)}
            />
            {opt}
          </label>
        ))}
        <button className='undo-button' onClick={handleUndo}>
          Undo
        </button>
        <button className='clear-button' onClick={handleClearAll}>
          Clear all
        </button>
      </div>

      {annotationType === AnnotationType.CIRCLE &&
        <div className='circle-tooltip'>
          {selectingRadius ? "Click to set radius" : "Click to set center"}
        </div>
      }

      <div className='capture-container'>
        <button onClick={handleScreenshot} className='capture-button'>
          Capture
        </button>
        <p className='plain-text'>Resolution:</p>
        <select value={quality} onChange={selectQuality} className='res-selector'>
          <option value="1">Low</option>
          <option value="2">Medium (default)</option>
          <option value="3">High</option>
          <option value="4">Very High</option>
        </select>
      </div>

      <button onClick={() => navigate('/gallery')} className='gallery-button'>
        Gallery
      </button>
    </div>
  )
}