import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [userName, setUserName] = useState(() => {
    // Load from localStorage on mount
    return localStorage.getItem('userName') || ''
  })

  const updateUserName = (name) => {
    setUserName(name)
    localStorage.setItem('userName', name)
  }

  return (
    <UserContext.Provider value={{ userName, updateUserName }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
