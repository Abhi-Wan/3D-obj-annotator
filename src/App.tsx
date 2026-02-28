import { Route, Routes } from 'react-router'
import { HomePage } from './pages/HomePage'
import { ObjectPage } from './pages/ObjectPage'
import { GalleryPage } from './pages/GalleryPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route index element={<ObjectPage />} />
      <Route path='object' element={<HomePage />} />
      <Route path='gallery' element={<GalleryPage />} />
    </Routes>
  )
}

export default App
