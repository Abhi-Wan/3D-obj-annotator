import { useNavigate } from 'react-router';
import ModalImage from 'react-modal-image';
import { useScreenshots } from '../components/context/ScreenshotContext';
import { Fallback } from '../components/Fallback';
import './GalleryPage.css';


export function GalleryPage() {
  const navigate = useNavigate();
  const { screenshots } = useScreenshots();

  if (screenshots.length === 0) {
    return <Fallback message='No screenshots available to view' />
  }

  return (
    <div className='gallery-page'>
      <h1 className='title'>Gallery</h1>

      <button onClick={() => navigate(-1)} className='back-button'>
        Back
      </button>

      <div className='gallery-grid'>
        {screenshots.map((url, index) => (
          <div key={index} className='photo-container'>
            <ModalImage
              className='photo'
              small={url}
              large={url}
            />
          </div>
        ))}
      </div>
    </div>
  )
}