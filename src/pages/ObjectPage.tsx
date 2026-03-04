import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Canvas } from '@react-three/fiber';
import { Scene } from '../components/Scene';
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
  if (!state) navigate('/');
  const { modelUrl, fileType, fileName } = state as StateType;

  const [quality, setQuality] = useState(2);
  const selectQuality = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const qualitySelected = Number(e.target.value);
    setQuality(qualitySelected);
  }

  // Ref for screenshot function (defined in Scene component as it needs Canvas context)
  const captureRef = useRef<SceneCaptureRef>(null);
  const screenshotIdx = useRef(0);

  const handleScreenshot = () => {
    const url = captureRef.current?.screenshot(quality);
    if (!url) {
      alert("Error capturing screenshot, please try again");
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}-capture-${screenshotIdx.current++}.png`;
    link.click();
  }

  return (
    <>
      <div className='scene-container'>
        {modelUrl && fileType && (
          <Canvas
            dpr={[1, 2]}
            camera={{ fov: 45 }}
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
      </div>
    </>
  )
}