import { useLocation, useNavigate } from 'react-router';
import { Scene } from '../components/Scene';
import type { FileType } from '../utils/types';
import './ObjectPage.css';

export function ObjectPage() {
  const navigate = useNavigate();

  const { state } = useLocation();
  if (!state) navigate('/');
  const { modelUrl, fileType } = state as { modelUrl: string, fileType: FileType };

  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <title>Annotator</title>

      <div className='scene-container'>
        {modelUrl && fileType && (
          <Scene url={modelUrl} fileType={fileType} />
        )}

        <button onClick={() => navigate('/')} className='back-button'>
          Back
        </button>
      </div>
    </>
  )
}