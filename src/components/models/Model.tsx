import type { FileType } from "../../utils/types";
import { GLBModel } from "./GLBModel";
import { OBJModel } from "./OBJModel";
import { USDModel } from "./USDModel";

export function Model({ url, fileType }: { url: string, fileType: FileType }) {
  if (fileType === 'glb' || fileType === 'gltf') {
    return (<GLBModel url={url} />);
  }
  if (fileType === 'obj') {
    return (<OBJModel url={url} />);
  }
  if (fileType === 'usdz') {
    return (<USDModel url={url} />);
  }
  return null;
}