import type { Vector3 } from "three";

type ArrowProps = {
  position: Vector3
  direction: Vector3
  length?: number
  color?: string
}

export function Arrow({ position, direction, length = 2, color = 'red' }: ArrowProps) {
  const offsetDistance = length;
  const origin = position.clone().addScaledVector(
    direction.normalize(),
    offsetDistance
  );

  const flipDir = direction.normalize().multiplyScalar(-1);

  return (
    <arrowHelper args={[flipDir, origin, length, color]} />
  )
}