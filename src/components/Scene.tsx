import { Suspense, useRef, useState } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Bounds, Center, OrbitControls, Stage } from '@react-three/drei';
import { Model } from '../components/models/Model';
import { LoaderCustom } from '../components/LoaderCustom';
import { ArrowMarkers } from './ArrowMarkers';
import type { FileType } from "../utils/types";
import { Vector3 } from 'three';

type ArrowData = {
  position: Vector3;
  direction: Vector3;
};

export function Scene({ url, fileType }: { url: string, fileType: FileType }) {
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const [arrows, setArrows] = useState<ArrowData[]>([]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    // Ignore click if mouse was dragged (camera control)
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 1) return;

    // Get intersection point and normal from the mesh
    if (e.point && e.face) {
      const position = new Vector3(...Object.values(e.point) as [number, number, number]);
      const normal = new Vector3(...Object.values(e.face.normal) as [number, number, number]);
      if (!normal) return;

      const worldNormal = normal.clone().transformDirection(e.object.matrixWorld);
      
      setArrows(prev => [...prev, { position, direction: worldNormal }]);
    }
  }

  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
      <color attach='background' args={["#101010"]} />
      <OrbitControls />
      <Stage adjustCamera={false} environment={'warehouse'}>
        <Suspense fallback={<LoaderCustom />}>
          <Bounds fit clip observe={false}>
            <Center>
              <Model
                url={url}
                fileType={fileType}
                handlePointerDown={handlePointerDown}
                handleClick={handleClick}
              />
            </Center>
          </Bounds>
        </Suspense>
      </Stage>
      <ArrowMarkers arrows={arrows} />
    </Canvas>
  );
}