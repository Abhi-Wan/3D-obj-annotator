import { createContext, useContext, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { OBJLoader, USDLoader } from "three/examples/jsm/Addons.js"
import type { FileType } from "../../utils/types"

type ModelContextType = {
  modelUrl: string | null
  fileType: FileType
  fileName: string | null
  setModel: (file: File) => void
}

const ModelContext = createContext<ModelContextType | null>(null);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<FileType>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const setModel = (file: File) => {
    // Clear loader cache and model URL to free memory of prev model
    if (modelUrl) {
      useGLTF.clear(modelUrl);
      useLoader.clear(OBJLoader, modelUrl);
      useLoader.clear(USDLoader, modelUrl);
      URL.revokeObjectURL(modelUrl);
    }

    const url = URL.createObjectURL(file);
    const fileNameParts = file.name.split('.');
    const name = fileNameParts[0];
    const ext = fileNameParts.pop()?.toLowerCase() as FileType;

    setModelUrl(url);
    setFileType(ext);
    setFileName(name);
  }

  return (
    <ModelContext value={{ modelUrl, fileType, fileName, setModel }}>
      {children}
    </ModelContext>
  )
}

export function useModelContext() {
  const context = useContext(ModelContext);
  if (!context) throw new Error('No ModelContext available');
  return context;
}