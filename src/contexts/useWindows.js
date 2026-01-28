import { useContext } from 'react'
import { WindowContext } from './WindowContext'

export const useWindows = () => {
  const context = useContext(WindowContext)
  if (!context) {
    throw new Error('useWindows must be used within WindowProvider')
  }
  return context
}
