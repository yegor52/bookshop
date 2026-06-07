import { Link, useNavigate } from "react-router-dom"
import '../../app/styles/Auth-reg.css'
import './Auth.css'
import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { authApi } from "../../services/api"

const Auth = () => {
    const [loginValue, setLoginValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showInfoModal, setShowInfoModal] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        setShowInfoModal(true)
    }, [])

    const getRedirectPath = (role) => {
        const normalizedRole = role?.toLowerCase()
        
        switch (normalizedRole) {
            case 'admin':
                return '/admin/statistics'
            case 'manager':
                return '/manager/orders'
            case 'client':
                return '/'
            default:
                return '/'
        }
    }

    const validateForm = () => {
        if (!loginValue.trim()) {
            setError('Введите логин')
            return false
        }
        if (loginValue.trim().length < 3) {
            setError('Логин должен содержать минимум 3 символа')
            return false
        }
        if (!passwordValue.trim()) {
            setError('Введите пароль')
            return false
        }
        if (passwordValue.trim().length < 6) {
            setError('Пароль должен содержать минимум 6 символов')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) return

        setLoading(true)

        try {
            const response = await authApi.login(loginValue.trim(), passwordValue.trim())
            
            login(response, response.token)
            
            const redirectPath = getRedirectPath(response.role)
            navigate(redirectPath)
            
        } catch (err) {
            setError(err.message || 'Неверный логин или пароль')
        } finally {
            setLoading(false)
        }
    }

    const handleCloseModal = () => {
        setShowInfoModal(false)
    }

    return (
        <div className="container-auth-reg">
            <div className="image-auth"></div>
            <div className="functional-auth-reg">
                <div className="text">
                    <h1 className="entry-reg">Войти</h1>
                    <p className="entry-text">Для входа необходимо ввести логин и пароль</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="login-password">
                        <input
                            className="input"
                            type="text"
                            placeholder="Логин"
                            value={loginValue}
                            onChange={(e) => setLoginValue(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            className="input"
                            type="password"
                            placeholder="Пароль"
                            value={passwordValue}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button 
                        type="submit" 
                        className="entry-button"
                        disabled={loading}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <p className="register-link">
                    Ещё нет аккаунта? <Link className="registerLink" to="/registr">Регистрация</Link>
                </p>
            </div>


            {showInfoModal && (
                <div className="info-modal-overlay" onClick={handleCloseModal}>
                    <div className="info-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="info-modal-header">
                            <h3 className="info-modal-title">Курсовая работа</h3>
                            {/* <button className="info-modal-close" onClick={handleCloseModal}>
                                ✕
                            </button> */}
                        </div>
                        
                        <div className="info-modal-body">
                            <div className="info-developer">
                                <span className="info-label">Разработчик:</span>
                                <span className="info-value">23-ИТД-1 Шаров Е. А.</span>
                            </div>
                            
                            <div className="info-description">
                                <p className="info-text">
                                    Система создана в рамках курсовой работы по предмету "Управление данными". 
                                    Она представляет собой демо-версию интернет магазина по продаже цветов. 
                                    Чтобы ознакомиться со всем возможным функционалом, можно воспользоваться 
                                    аккаунтами ниже.
                                </p>
                            </div>
                            
                            <div className="info-accounts">
                                <div className="info-account admin">
                                    <div className="info-account-role">Администратор</div>
                                    <div className="info-account-details">
                                        <span className="info-account-login">Логин: godofwar</span>
                                        <span className="info-account-password">Пароль: 112233</span>
                                    </div>
                                </div>
                                
                                <div className="info-account manager">
                                    <div className="info-account-role">Менеджер</div>
                                    <div className="info-account-details">
                                        <span className="info-account-login">Логин: men</span>
                                        <span className="info-account-password">Пароль: 12341234</span>
                                    </div>
                                </div>
                                
                                <div className="info-account client">
                                    <div className="info-account-role">Клиент</div>
                                    <div className="info-account-details">
                                        <span className="info-account-login">Логин: yegor52</span>
                                        <span className="info-account-password">Пароль: 030305</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="info-modal-footer">
                            <button className="info-modal-btn" onClick={handleCloseModal}>
                                Понятно
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Auth