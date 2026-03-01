import { useGLTF } from "@react-three/drei";

export function GLBModel({ url }: { url: string }) {
  const { scene: glb } = useGLTF(url);
  return (
    <primitive object={glb} />
  )
}