import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Canvas } from '@react-three/fiber';
import { Scene } from '../components/Scene';
import type { FileType } from '../utils/types';
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenshotIdx = useRef(0);
  const handleScreenshot = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
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
            ref={canvasRef}
            gl={{ preserveDrawingBuffer: true }}
          >
            <Scene
              url={modelUrl}
              fileType={fileType}
            />
          </Canvas>
        )}

        <button onClick={() => navigate('/')} className='back-button'>
          Back
        </button>

        <button onClick={handleScreenshot} className='capture-button'>
          Capture
        </button>
      </div>
    </>
  )
}