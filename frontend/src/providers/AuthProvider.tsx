import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { restoreAuth } = useAuth()
  console.log('AuthProvider')
  useEffect(() => {
    // Restore auth state on mount
    restoreAuth()
  }, [restoreAuth])

  return <>{children}</>
}

export default AuthProvider 