import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import CoffeeChat from './pages/CoffeeChat.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <CoffeeChat />
    </ErrorBoundary>
  </StrictMode>,
)
