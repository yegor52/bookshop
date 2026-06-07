import { memo } from "react"
import { Link, useNavigate } from "react-router-dom"
import '../app/styles/Header.css'
import { useAuth } from "../context/AuthContext"

const Header = () => {
    const { isAuthenticated, logout, getUserRole } = useAuth()
    const navigate = useNavigate()
    const role = getUserRole()?.toLowerCase()

    const handleLogout = () => {
        logout()
        navigate('/auth')
    }

    return (
        <div className="header">
            <h1 className="logo">Между строк</h1>
            
            <div className="menu">
                {role === 'admin' ? (
                    <>
                        <Link className="registerLink" to="/admin/buyers">Покупатели</Link>
                        <Link className="registerLink" to="/admin/employees">Сотрудники</Link>
                        <Link className="registerLink" to="/admin/books">Книги</Link>
                        <Link className="registerLink" to="/admin/orders">Заказы</Link>
                        <Link className="registerLink" to="/admin/statistics">Статистика</Link>
                        <button className="logout-btn" onClick={handleLogout}>
                            Выйти
                        </button>
                    </>
                ) : role === 'manager' ? (
                    <button className="logout-btn" onClick={handleLogout}>
                        Выйти
                    </button>
                ) : (
                    <>
                        <Link className="registerLink" to="/">Главная</Link>
                        <Link className="registerLink" to="/basket">Корзина</Link>
                        {isAuthenticated ? (
                            <Link className="registerLink" to="/user">Личный кабинет</Link>
                        ) : (
                            <Link className="registerLink" to="/auth">Войти</Link>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default memo(Header)