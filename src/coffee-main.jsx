import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import CoffeeChat from './pages/CoffeeChat.jsx'

// Portfolio shell locks body/#root to 100vh + overflow:hidden.
// Coffee is a tall scrolling page — unlock document scroll for this entry only.
document.documentElement.classList.add('coffee-route')
document.body.classList.add('coffee-route')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <CoffeeChat />
    </ErrorBoundary>
  </StrictMode>,
)
