import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Canvas, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { OBJLoader, USDLoader } from 'three/examples/jsm/Addons.js';
import { Scene } from '../components/Scene';
import { useScreenshots } from '../components/context/ScreenshotContext';
import { Fallback } from '../components/Fallback';
import type { FileType, SceneCaptureRef } from '../utils/types';
import './ObjectPage.css';

type StateType = {
  modelUrl: string
  fileType: FileType
  fileName: string
}

export function ObjectPage() {
  const navigate = useNavigate();

  const { state } = useLocation();
  if (!state) {
    return <Fallback message='Model not found or is no longer available' />
  }
  const { modelUrl, fileType, fileName } = state as StateType;

  const [isValidUrl, setIsValidUrl] = useState(true);
  useEffect(() => {
    if (!modelUrl) return;
    fetch(modelUrl)
      .then(() => setIsValidUrl(true))
      .catch(() => setIsValidUrl(false));
  }, [modelUrl])

  const [quality, setQuality] = useState(2);
  const selectQuality = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const qualitySelected = Number(e.target.value);
    setQuality(qualitySelected);
  }

  // Ref for screenshot function (defined in Scene component as it needs Canvas context)
  const captureRef = useRef<SceneCaptureRef>(null);
  const { addScreenshot } = useScreenshots();
  const screenshotIdx = useRef(0);

  const handleScreenshot = () => {
    const url = captureRef.current?.screenshot(quality);
    if (!url) {
      alert("Error capturing screenshot, please try again");
      return;
    }

    // Add screenshot to context so gallery page can display
    addScreenshot(url);

    // Download captured image
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}-capture-${screenshotIdx.current++}.png`;
    link.click();
  }

  useEffect(() => {
    // Unmount cleanup: clear loader caches and revoke URL to free memory
    return () => {
      if (modelUrl) {
        useGLTF.clear(modelUrl);
        useLoader.clear(OBJLoader, modelUrl);
        useLoader.clear(USDLoader, modelUrl);
        URL.revokeObjectURL(modelUrl);
      }
    }
  }, [])

  if (!isValidUrl) {
    return <Fallback message='Model not found or is no longer available' />
  }

  return (
    <div className='object-page'>
      <div className='scene-container'>
        {modelUrl && fileType && (
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 0.5], near: 0.01, far: 1000, fov: 50 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <Scene
              url={modelUrl}
              fileType={fileType}
              ref={captureRef}
            />
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