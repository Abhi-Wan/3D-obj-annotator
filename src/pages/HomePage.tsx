import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useModelContext } from '../components/context/ModelContext';
import './HomePage.css';

export function HomePage() {
  const navigate = useNavigate();
  const { setModel } = useModelContext();
  const [fileSelected, setFileSelected] = useState(false);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setModel(file);
    setFileSelected(true);
  }

  const handleSubmit = () => {
    if (!fileSelected) {
      alert("Please choose a file");
      return;
    }
    navigate('/object');
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