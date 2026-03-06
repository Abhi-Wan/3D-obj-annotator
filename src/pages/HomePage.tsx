import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import type { FileType } from '../utils/types';
import './HomePage.css';

export function HomePage() {
  const [fileType, setFileType] = useState<FileType>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const prevUrl = useRef<string | null>(null);
  const navigate = useNavigate();

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Remove previous model URL to free memory
    if (prevUrl.current) {
      URL.revokeObjectURL(prevUrl.current);
    }

    const url = URL.createObjectURL(file);
    const fileNameParts = file.name.split('.');
    const name = fileNameParts[0];
    const ext = fileNameParts.pop()?.toLowerCase() as FileType;

    prevUrl.current = url;
    setFileType(ext);
    setFileName(name);
    setModelUrl(url);
  }

  const handleSubmit = () => {
    if (!modelUrl || !fileType) {
      alert("Please choose a file");
      return;
    }
    navigate('/object', { state: { modelUrl, fileType, fileName } });
  }

  return (
    <div className='home-page'>
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

      <button className='submit-button' onClick={handleSubmit}>
        View model
      </button>

      <button className='gallery-button' onClick={() => navigate('/gallery')}>
        Screenshot Gallery
      </button>
    </div>
  )
}