import { useLoader } from "@react-three/fiber";
import { USDLoader } from "three/examples/jsm/Addons.js";

export function USDModel({ url }: { url: string }) {
  const usd = useLoader(USDLoader, url);
  return (
    <primitive object={usd} />
  )
}