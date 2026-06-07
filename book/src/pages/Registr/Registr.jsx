import { Link, useNavigate } from "react-router-dom"
import '../../app/styles/Auth-reg.css'
import './Registr.css'
import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { authApi } from "../../services/api"

const Registr = () => {
    const [form, setForm] = useState({
        fio: '',
        phoneNumber: '',
        email: '',
        login: '',
        password: '',
        passwordRepeat: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        if (error) setError('')
    }

    const validateForm = () => {
        if (!form.fio.trim()) {
            setError('Введите ФИО')
            return false
        }
        if (form.fio.trim().length < 5) {
            setError('ФИО должно содержать минимум 5 символов')
            return false
        }
        if (!form.phoneNumber.trim()) {
            setError('Введите номер телефона')
            return false
        }
        if (!form.email.trim()) {
            setError('Введите email')
            return false
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setError('Введите корректный email')
            return false
        }
        if (!form.login.trim()) {
            setError('Введите логин')
            return false
        }
        if (form.login.trim().length < 3) {
            setError('Логин должен содержать минимум 3 символа')
            return false
        }
        if (!form.password) {
            setError('Введите пароль')
            return false
        }
        if (form.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов')
            return false
        }
        if (form.password !== form.passwordRepeat) {
            setError('Пароли не совпадают')
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
            const response = await authApi.register({
                fio: form.fio.trim(),
                phoneNumber: form.phoneNumber.trim(),
                email: form.email.trim(),
                login: form.login.trim(),
                password: form.password
            })

            login(response, response.token)
            navigate('/') 

        } catch (err) {
            setError(err.message || 'Ошибка регистрации')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-auth-reg">
            <div className="image-reg"></div>
            <div className="functional-auth-reg">
                <h1 className="entry-reg">Регистрация</h1>

                <form onSubmit={handleSubmit}>
                    <div className="login-password">
                        <input 
                            name="fio" 
                            className="input" 
                            type="text" 
                            placeholder="ФИО" 
                            value={form.fio} 
                            onChange={handleChange} 
                            disabled={loading}
                        />
                        <input 
                            name="phoneNumber" 
                            className="input" 
                            type="tel" 
                            placeholder="Номер телефона" 
                            value={form.phoneNumber} 
                            onChange={handleChange} 
                            disabled={loading}
                        />
                        <input 
                            name="email" 
                            className="input" 
                            type="email" 
                            placeholder="Email" 
                            value={form.email} 
                            onChange={handleChange} 
                            disabled={loading}
                        />
                        <input 
                            name="login" 
                            className="input" 
                            type="text" 
                            placeholder="Логин" 
                            value={form.login} 
                            onChange={handleChange} 
                            disabled={loading}
                        />
                        <input 
                            name="password" 
                            className="input" 
                            type="password" 
                            placeholder="Пароль" 
                            value={form.password} 
                            onChange={handleChange} 
                            disabled={loading}
                        />
                        <input 
                            name="passwordRepeat" 
                            className="input" 
                            type="password" 
                            placeholder="Повторите пароль" 
                            value={form.passwordRepeat} 
                            onChange={handleChange} 
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button 
                        type="submit" 
                        className="entry-button"
                        disabled={loading}
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p className="register-link">
                    Уже есть аккаунт? <Link className="registerLink" to="/auth">Войти</Link>
                </p>
            </div>
        </div>
    )
}

export default Registr