import type { ThreeEvent } from "@react-three/fiber";
import type { FileType } from "../../utils/types";
import { GLBModel } from "./GLBModel";
import { OBJModel } from "./OBJModel";
import { USDModel } from "./USDModel";

type ModelProps = {
  url: string,
  fileType: FileType,
  handlePointerDown: (event: ThreeEvent<PointerEvent>) => void;
  handleClick: (event: ThreeEvent<MouseEvent>) => void;
}

export function Model({ url, fileType, handlePointerDown, handleClick}: ModelProps) {
  return (
    <group onPointerDown={handlePointerDown} onClick={handleClick} >
      {(fileType === 'glb' || fileType === 'gltf') && <GLBModel url={url} />}
      {fileType === 'obj' && <OBJModel url={url} />}
      {fileType === 'usdz' && <USDModel url={url} />}
    </group>
  )
}