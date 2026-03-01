import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Center, OrbitControls, Stage } from '@react-three/drei';
import { useLocation, useNavigate } from 'react-router';
import { Model } from '../components/models/Model';
import { LoaderCustom } from '../components/LoaderCustom';
import type { FileType } from '../utils/types';
import './ObjectPage.css';

export function ObjectPage() {
  const navigate = useNavigate();

  const { state } = useLocation();
  console.log(state);
  if (!state) navigate('/');
  const { modelUrl, fileType } = state as { modelUrl: string, fileType: FileType };

  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <title>Annotator</title>

      <div className='canvas-container'>
        {modelUrl && fileType && (
          <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
            <color attach='background' args={["#101010"]} />
            <OrbitControls />
            <ambientLight />
            <Stage environment={'warehouse'} >
              <Suspense fallback={<LoaderCustom />}>
                <Bounds fit clip observe>
                  <Center>
                    <Model url={modelUrl} fileType={fileType} />
                  </Center>
                </Bounds>
              </Suspense>
            </Stage>
          </Canvas>
        )}

        <button onClick={() => navigate('/')} className='back-button'>
          Back
        </button>
      </div>
    </>
  )
}