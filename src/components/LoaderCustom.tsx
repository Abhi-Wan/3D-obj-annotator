import { Html, useProgress } from "@react-three/drei";

export function LoaderCustom() {
  const { progress } = useProgress();
  return (<Html center>{Math.round(progress)}% loaded</Html>);
}