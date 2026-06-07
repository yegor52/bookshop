import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode' 

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const savedToken = localStorage.getItem('token')
                
                if (savedToken) {
                    const decoded = jwtDecode(savedToken)
                    
                    const currentTime = Date.now() / 1000
                    if (decoded.exp > currentTime) {
                        setUser({
                            id: decoded.userId, 
                            role: decoded.role,
                            status: decoded.role, 
                            login: decoded.sub 
                        })
                        setToken(savedToken)
                        
                        localStorage.setItem('user_role', decoded.role)
                    } else {
                        localStorage.removeItem('token')
                        localStorage.removeItem('user_role')
                    }
                }
            } catch (error) {
                console.error("Ошибка восстановления сессии:", error)
                localStorage.removeItem('token')
                localStorage.removeItem('user_role')
            } finally {
                setLoading(false)
            }
        }
        
        initializeAuth()
    }, [])

    const login = (userData, authToken) => {
        const decoded = jwtDecode(authToken)
        
        const userInfo = {
            id: decoded.userId || decoded.sub,
            role: decoded.role || userData.role,
            status: decoded.role || userData.role,
            login: decoded.sub
        }
        
        setUser(userInfo)
        setToken(authToken)
        
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(userInfo))
        localStorage.setItem('user_role', userInfo.role)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('user_role')
    }

    const getUserRole = () => {
        if (user?.role) return user.role
        if (user?.status) return user.status
        return localStorage.getItem('user_role') || null
    }

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        getUserRole,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}