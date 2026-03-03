import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { ArrowHelper, Vector3 } from 'three';

type ArrowData = {
  position: Vector3;
  direction: Vector3;
};

type ArrowMarkersProps = {
  arrows: ArrowData[];
};

export function ArrowMarkers({ arrows }: ArrowMarkersProps) {
  const { scene } = useThree();
  const arrowHelpersRef = useRef<ArrowHelper[]>([]);

  useEffect(() => {
    if (arrows.length > arrowHelpersRef.current.length) {
      // Get the latest arrow that was added
      const latestArrow = arrows[arrows.length - 1];
      
      // Offset the arrow start position outward from the surface along the normal
      const offsetDistance = 2;
      const arrowOrigin = latestArrow.position.clone().addScaledVector(
        latestArrow.direction.normalize(),
        offsetDistance
      );
      
      // Create an ArrowHelper with:
      // - origin offset outward from the surface
      // - direction pointing inward (toward the object)
      // - length equal to offset (reaches to the surface)
      // - hex color (bright red)
      const arrow = new ArrowHelper(
        latestArrow.direction.normalize().multiplyScalar(-1),
        arrowOrigin,
        offsetDistance, // length of arrow
        0xff0000 // bright red color
      );
      
      scene.add(arrow);
      arrowHelpersRef.current.push(arrow);
    }
  }, [arrows, scene]);

  return null;
}
