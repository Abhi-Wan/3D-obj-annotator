import { forwardRef, Suspense, useImperativeHandle, useRef, useState } from 'react';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Vector3 } from 'three';
import html2canvas from 'html2canvas';
import { Model } from './models/Model';
import { LoaderCustom } from './LoaderCustom';
import { Arrow } from './annotations/Arrow';
import { Textbox } from './annotations/Textbox';
import { Circle } from './annotations/Circle';
import { AnnotationType, type SceneCaptureRef } from "../utils/types";

type ArrowData = {
  id: number
  position: Vector3
  direction: Vector3
}

type TextboxData = {
  id: number
  position: Vector3
  text: string
}

type CircleData = {
  id: number
  position: Vector3
  normal: Vector3
  radius: number
}

type SceneProps = {
  annotation: AnnotationType
  selectingRadius: boolean
  onSelectingRadiusChange: (value: boolean) => void
}

export const Scene = forwardRef<SceneCaptureRef, SceneProps>(({ annotation, selectingRadius, onSelectingRadiusChange }, ref) => {
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const annotationId = useRef(0);
  const [arrows, setArrows] = useState<ArrowData[]>([]);
  const [textboxes, setTextboxes] = useState<TextboxData[]>([]);
  const [circles, setCircles] = useState<CircleData[]>([]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    // Ignore click if mouse was dragged (camera control)
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 2) return;

    // Get intersection point and normal from the mesh
    if (e.point && e.face) {
      const position = new Vector3(...Object.values(e.point) as [number, number, number]);

      if (annotation === AnnotationType.ARROW) {
        const normal = new Vector3(...Object.values(e.face.normal) as [number, number, number]);
        if (!normal) return;

        const worldNormal = normal.clone().transformDirection(e.object.matrixWorld);

        setArrows(prev => [...prev, { id: annotationId.current++, position, direction: worldNormal }]);
      }

      if (annotation === AnnotationType.TEXTBOX) {
        const inputText = window.prompt("Enter annotation text:");
        if (!inputText) return;
        setTextboxes(prev => [...prev, { id: annotationId.current++, position, text: inputText }]);
      }

      if (annotation === AnnotationType.CIRCLE) {
        if (!selectingRadius) {
          const normal = new Vector3(...Object.values(e.face.normal) as [number, number, number]);
          if (!normal) return;

          const worldNormal = normal.clone().transformDirection(e.object.matrixWorld);

          // Show temp circle with small radius to indicate center of circle being placed
          setCircles(prev => [...prev, { id: annotationId.current++, position, normal: worldNormal, radius: 0.0001 }]);
          onSelectingRadiusChange(true);
        } else {
          const updatedCircles = circles.slice(0, circles.length - 1);
          const lastCircle = circles[circles.length - 1]; // temp circle placed with prior click

          // Calculate circle radius as 3D distance between the 2 clicks on model mesh
          const radiusPos = new Vector3(...Object.values(e.point) as [number, number, number]);
          const dx = radiusPos.x - lastCircle.position.x;
          const dy = radiusPos.y - lastCircle.position.y;
          const dz = radiusPos.z - lastCircle.position.z;
          const radius = (Math.sqrt(dx * dx + dy * dy + dz * dz));

          // Update temp circle with finalized radius
          setCircles([...updatedCircles, { id: lastCircle.id, position: lastCircle.position, normal: lastCircle.normal, radius }]);
          onSelectingRadiusChange(false);
        }
      }
    }
  }

  // Screenshot function that is called from ObjectPage on capture button click
  // Set pixel ratio to selected quality and return render URL for screenshot
  const { gl, scene, camera } = useThree();
  useImperativeHandle(ref, () => ({
    screenshot: async (pixelRatio = 2) => {
      const current = gl.getPixelRatio();
      gl.setPixelRatio(pixelRatio);
      gl.render(scene, camera);

      // Take screenshot with html2canvas instead of gl to include textbox annotations
      const container = document.getElementById('canvas-container');
      if (!container) return;
      const canvas = await html2canvas(container, { scale: pixelRatio });
      const url = canvas.toDataURL('image/png');

      gl.setPixelRatio(current);
      return url;
    }
  }))

  return (
    <>
      <color attach='background' args={["#101010"]} />
      <ambientLight />
      <OrbitControls />
      <Stage adjustCamera={false} environment={'warehouse'}>
        <Suspense fallback={<LoaderCustom />}>
          <Model
            handlePointerDown={handlePointerDown}
            handleClick={handleClick}
          />
        </Suspense>
      </Stage>
      {arrows.map(arrow => (
        <Arrow key={arrow.id} position={arrow.position} direction={arrow.direction} />
      ))}
      {textboxes.map(textbox => (
        <Textbox key={textbox.id} position={textbox.position} text={textbox.text} />
      ))}
      {circles.map(circle => (
        <Circle key={circle.id} position={circle.position} normal={circle.normal} radius={circle.radius} />
      ))}
    </>
  );
})