import { useRef } from "react";
import { Box3, Group, Vector3 } from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { GLBModel } from "./GLBModel";
import { OBJModel } from "./OBJModel";
import { USDModel } from "./USDModel";
import { useModelContext } from "../context/ModelContext";

type ModelProps = {
  handlePointerDown: (event: ThreeEvent<PointerEvent>) => void;
  handleClick: (event: ThreeEvent<MouseEvent>) => void;
}

export function Model({ handlePointerDown, handleClick }: ModelProps) {
  const { modelUrl, fileType } = useModelContext();

  const groupRef = useRef<Group>(null);
  const normalized = useRef(false);

  useFrame(() => {
    // useFrame runs every render tick, so ignore if model already scaled
    if (normalized.current || !groupRef.current) return;

    // Get dimensions of model and calculate normalization scale
    const box = new Box3().setFromObject(groupRef.current);
    const size = new Vector3();
    box.getSize(size);
    const maxAxis = Math.max(size.x, size.y, size.z);
    // Axes can be very very small instead of 0 if partial geometry loaded
    if (maxAxis < 0.01) return; 

    // Normalize scale of model (for consistent annotation size)
    groupRef.current.scale.setScalar(1 / maxAxis);

    // Manually align model to center of world space bounding box
    const center = new Vector3();
    box.getCenter(center);
    groupRef.current.position.set(
      -center.x / maxAxis,
      -center.y / maxAxis,
      -center.z / maxAxis
    );

    normalized.current = true;
  })

  if (!modelUrl || !fileType) return null;

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown} onClick={handleClick} >
      {(fileType === 'glb' || fileType === 'gltf') && <GLBModel url={modelUrl} />}
      {fileType === 'obj' && <OBJModel url={modelUrl} />}
      {fileType === 'usdz' && <USDModel url={modelUrl} />}
    </group>
  )
}