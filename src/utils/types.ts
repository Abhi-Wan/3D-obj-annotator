export type FileType = 'glb' | 'gltf' | 'obj' | 'usdz' | null;

export type SceneCaptureRef = { screenshot: (pixelRatio?: number) => Promise<string | undefined> };

export const AnnotationType = {
  ARROW: "Arrow",
  TEXTBOX: "Textbox"
} as const;

export type AnnotationType = typeof AnnotationType[keyof typeof AnnotationType];