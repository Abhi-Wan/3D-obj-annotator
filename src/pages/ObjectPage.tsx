
import { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Loader, OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { OBJLoader, USDLoader } from 'three/examples/jsm/Addons.js';
import { Model } from '../components/Model';
import './ObjectPage.css';

export function ObjectPage() {
  const { scene: glb } = useGLTF("/Dune-Ornithopter.glb");
  const obj  = useLoader(OBJLoader, "/Dune-Ornithopter.obj");
  const usdz = useLoader(USDLoader, "/1975-Porsche-911.usdz");

  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <title>Annotator</title>

      <div className='canvas-container'>
        <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
          <color attach="background" args={["#101010"]} />
          <OrbitControls />
          <Loader />
          <ambientLight/>
          <Stage environment={'warehouse'} >
            <Suspense fallback={<Loader/>}>
              <Model object={glb} />
            </Suspense>
          </Stage>
        </Canvas>
      </div>
    </>
  )
}