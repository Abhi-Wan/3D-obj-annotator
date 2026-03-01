import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/Addons.js";

export function OBJModel({ url }: { url: string }) {
  const obj = useLoader(OBJLoader, url);
  return (
    <primitive object={obj} />
  )
}