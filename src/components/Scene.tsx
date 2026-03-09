import { forwardRef, Suspense, useImperativeHandle, useRef, useState } from 'react';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Vector3 } from 'three';
import html2canvas from 'html2canvas';
import { Model } from './models/Model';
import { LoaderCustom } from './LoaderCustom';
import { Arrow } from './annotations/Arrow';
import { Textbox } from './annotations/Textbox';
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

export const Scene = forwardRef<SceneCaptureRef, { annotation: AnnotationType }>(({ annotation }, ref) => {
	const pointerDownPos = useRef({ x: 0, y: 0 });
	const [arrows, setArrows] = useState<ArrowData[]>([]);
	const arrowId = useRef(0);
	const [textboxes, setTextboxes] = useState<TextboxData[]>([]);
	const textboxId = useRef(0);

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

				setArrows(prev => [...prev, { id: arrowId.current++, position, direction: worldNormal }]);
			}

			if (annotation === AnnotationType.TEXTBOX) {
				const inputText = window.prompt("Enter annotation text:");
				if (!inputText) return;
				setTextboxes(prev => [...prev, { id: textboxId.current++, position, text: inputText }]);
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
		</>
	);
})