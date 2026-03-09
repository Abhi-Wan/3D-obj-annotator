import { DoubleSide, Quaternion, Vector3 } from "three";

type CircleProps = {
  position: Vector3
  normal: Vector3
  radius?: number
  color?: string
}

export function Circle({ position, normal, radius = 0.01, color = 'red'}: CircleProps) {
  // Orient circle to normal of mesh surface
  const rotation = new Quaternion().setFromUnitVectors(
    new Vector3(0, 0, 1),
    normal
  );

  // Slightly offset from model to prevent clipping
  const offsetDistance = 0.001;
  const offsetPos = position.clone().addScaledVector(
    normal.normalize(),
    offsetDistance
  );

  return (
    <mesh position={offsetPos} quaternion={rotation}>
      <ringGeometry args={[radius, radius + 0.001, 64]} />
      <meshBasicMaterial color={color} side={DoubleSide} />
    </mesh>
  )
}