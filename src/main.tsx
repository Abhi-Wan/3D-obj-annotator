import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ScreenshotProvider } from './components/context/ScreenshotContext.tsx'
import App from './App.tsx'
import './index.css'

/**
 * Strict mode removed for this demo because the double mount is causing the cleanup
 * useEffect on ObjectPage to prematurely clear models from memory in the first unmount,
 * preventing them from being loaded into the scene and causing fetch errors.
 */
createRoot(document.getElementById('root')!).render(
  <ScreenshotProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ScreenshotProvider>
)
