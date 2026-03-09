export type FileType = 'glb' | 'gltf' | 'obj' | 'usdz' | null;

export type SceneRef = {
  screenshot: (pixelRatio?: number) => Promise<string | undefined>
  undo: () => void
  clear: () => void
};

export const AnnotationType = {
  ARROW: "Arrow",
  TEXTBOX: "Textbox",
  CIRCLE: "Circle"
} as const;

export type AnnotationType = typeof AnnotationType[keyof typeof AnnotationType];