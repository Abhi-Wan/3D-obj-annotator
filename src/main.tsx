import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ModelProvider } from './components/context/ModelContext.tsx'
import { ScreenshotProvider } from './components/context/ScreenshotContext.tsx'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <ModelProvider>
    <ScreenshotProvider>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </ScreenshotProvider>
  </ModelProvider>
)
