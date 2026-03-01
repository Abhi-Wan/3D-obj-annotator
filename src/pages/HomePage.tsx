import { useEffect, useRef, useState, type MouseEventHandler } from 'react';
import './HomePage.css';

export function HomePage() {
  const [fileType, setFileType] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const prevUrl = useRef<string | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Remove previous model URL to free memory
    if (prevUrl.current) {
      URL.revokeObjectURL(prevUrl.current);
    }

    const url = URL.createObjectURL(file);
    const ext = file.name.split('.').pop()?.toLowerCase() || null;

    prevUrl.current = url;
    setFileType(ext);
    setModelUrl(url);
  }

  useEffect(() => {
    // Clean up model URL after unmounting
    return () => {
      if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    }
  }, [])

  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <title>3D Annotator</title>

      <h1>3D Model Annotator</h1>
      <h3>Welcome! Upload a 3D model file, annotate, and save a snapshot image of the view</h3>

      <div className='upload-container'>
        <input
          type='file'
          accept='.glb,.gltf,.obj,.usdz'
          onChange={handleUpload}
        />
        <p>Supported file types: .glb, .gltf, .obj, .usdz</p>
      </div>

      <button className='submit-button'>View model</button>
    </>
  )
}