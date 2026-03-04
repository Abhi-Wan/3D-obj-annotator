export type FileType = 'glb' | 'gltf' | 'obj' | 'usdz' | null;

export type SceneCaptureRef = { screenshot: (pixelRatio?: number) => string };