import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Canvas } from '@react-three/fiber';
import { Scene } from '../components/Scene';
import { useModelContext } from '../components/context/ModelContext';
import { useScreenshotContext } from '../components/context/ScreenshotContext';
import { Fallback } from '../components/Fallback';
import type { SceneCaptureRef } from '../utils/types';
import './ObjectPage.css';

export function ObjectPage() {
  const navigate = useNavigate();
  const { modelUrl, fileType, fileName } = useModelContext();

  if (!modelUrl || !fileType) {
    return <Fallback message='Model not found or is no longer available' />
  }

  // Screenshot resolution (default device pixel ratio of 2)
  const [quality, setQuality] = useState(2);
  const selectQuality = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const qualitySelected = Number(e.target.value);
    setQuality(qualitySelected);
  }

  // Ref for screenshot function (defined in Scene component as it needs Canvas context)
  const captureRef = useRef<SceneCaptureRef>(null);
  const { addScreenshot } = useScreenshotContext();
  const screenshotIdx = useRef(0);

  const handleScreenshot = () => {
    const url = captureRef.current?.screenshot(quality);
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

  return (
    <div className='object-page'>
      <div className='scene-container'>
        {modelUrl && fileType && (
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 1.5], near: 0.01, far: 1000, fov: 50 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <Scene ref={captureRef} />
          </Canvas>
        )}

        <button onClick={() => navigate('/')} className='back-button'>
          Back
        </button>

        <div className='capture-container'>
          <button onClick={handleScreenshot}>
            Capture
          </button>
          <p className='res-text'>Resolution:</p>
          <select value={quality} onChange={selectQuality} className='res-selector'>
            <option value="1">Low</option>
            <option value="2">Medium (default)</option>
            <option value="4">High</option>
            <option value="6">Very High</option>
          </select>
        </div>

        <button onClick={() => navigate('/gallery')} className='gallery-button'>
          Gallery
        </button>
      </div>
    </div>
  )
}