import Header from "../../components/Header"
import './User.css'
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import { getBookByIdForOrder, getClientByUserId, getOrderComposition, getOrdersByClientId, updateClientProfile } from "../../services/api"
import EditProfileModal from "../../components/EditProfileModal"

const User = () => {
    const { user, logout, loading: authLoading } = useAuth()
    const navigate = useNavigate()
    const [clientData, setClientData] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [expandedOrders, setExpandedOrders] = useState({})

    const getStatusLabel = (status) => {
        switch (status?.toUpperCase()) {
            case 'BASKET': return 'Корзина'
            case 'CREATED': return 'Создан'
            case 'IN_TRANSIT': return 'В пути'
            case 'DELIVERED': return 'Доставлен'
            case 'COMPLETED': return 'Завершён'
            case 'CANCELLED': return 'Отменён'
            default: return status || 'Неизвестно'
        }
    }

    const getStatusClass = (status) => `status-${status?.toLowerCase() || 'unknown'}`

    const fetchUserData = useCallback(async (showRefresh = false) => {
        if (!user) return
        
        try {
            if (showRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }
            
            
            const client = await getClientByUserId(user.id)
            setClientData(client)

            if (client) {
                let userOrders = await getOrdersByClientId(client.id)
                
                const ordersWithComposition = await Promise.all(
                    userOrders.map(async (order) => {
                        const composition = await getOrderComposition(order.id)
                        
                        const itemsWithBooks = await Promise.all(
                            composition.map(async (item) => {
                                const book = await getBookByIdForOrder(item.bookId)
                                return {
                                    ...item,
                                    book
                                }
                            })
                        )
                        
                        return {
                            ...order,
                            items: itemsWithBooks
                        }
                    })
                )
                
                setOrders(ordersWithComposition)
            }
        } catch(error) {
            console.error("Ошибка загрузки данных", error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [user])

    const handleRefresh = () => {
        fetchUserData(true)
    }

    useEffect(() => {
        if (authLoading) return
        
        if (!user) {
            navigate('/auth')
            return
        }
        
        fetchUserData()
    }, [user, navigate, authLoading, fetchUserData])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && user) {
                fetchUserData(true)
            }
        }
        
        window.addEventListener('focus', () => {
            fetchUserData(true)
        })
        
        document.addEventListener('visibilitychange', handleVisibilityChange)
        
        return () => {
            window.removeEventListener('focus', () => {})
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [user, fetchUserData])

    if (authLoading) {
        return (
            <>
                <Header />
                <div className="loading-container">
                    <p>Проверка авторизации...</p>
                </div>
            </>
        )
    }

    const handleLogout = () => {
        logout()
        navigate('/auth')
    }

    const handleEditProfile = () => {
        setIsModalOpen(true)
    }

    const handleSaveProfile = async (updatedData) => {
        try {
            const profileData = {
                fullName: updatedData.fullName || updatedData.fio,
                email: updatedData.email,
                phoneNumber: updatedData.phoneNumber,
            };

            const updated = await updateClientProfile(profileData);   
            setClientData(prev => ({
                ...prev,
                clientInfo: updated  
            }));

            alert('Данные успешно обновлены!');
        } catch (error) {
            console.error("Ошибка обновления данных:", error);
            alert(error.response?.data?.message || error.message || 'Ошибка обновления профиля');
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }))
    }

    if (loading && !refreshing) {
        return (
            <>
                <Header />
                <div className="loading-container">
                    <p>Загрузка данных...</p>
                </div>
            </>
        )
    }

    if (!clientData) {
        return (
            <>
                <Header />
                <div className="error-container">
                    <p>Данные пользователя не найдены</p>
                    <button onClick={() => navigate('/')}>Вернуться на главную</button>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="hPage about">
                <h1 className="name-page">Личный кабинет</h1>
            </div>
            <div className="content-block">
                <div className="user-block_info">
                    <ul className="user-info">
                        <li className="user-info_item">
                            <span className="user-info_label">ФИО:</span>
                            <p className="user-text">{clientData.client.fullName}</p>
                        </li>
                        <li className="user-info_item">
                            <span className="user-info_label">Email:</span>
                            <p className="user-text">{clientData.client.email}</p>
                        </li>
                        <li className="user-info_item">
                            <span className="user-info_label">Номер:</span>
                            <p className="user-text">{clientData.client.phoneNumber}</p>
                        </li>
                        <li className="user-info_item">
                            <span className="user-info_label">Логин:</span>
                            <p className="user-text">{clientData.user?.login}</p>
                        </li>
                    </ul>
                    <div className="user-buttons">
                        <button className="user-button edit-user" onClick={handleEditProfile}>
                            Редактировать
                        </button>
                        <button className="user-button exit-user" onClick={handleLogout}>
                            Выйти
                        </button>
                    </div>
                </div>
                
                <div className="user-orders_history">
                    <div className="orders-header">
                        <h2 className="historyH">История заказов</h2>
                        <button 
                            className="refresh-orders-btn" 
                            onClick={handleRefresh} 
                            disabled={refreshing}
                        >
                            {refreshing ? 'Обновление...' : 'Обновить'}
                        </button>
                    </div>
                    
                    {orders.length === 0 ? (
                        <div className="no-orders">
                            <p>У вас пока нет заказов</p>
                            <button className="refresh-empty-btn" onClick={handleRefresh} disabled={refreshing}>
                                {refreshing ? 'Загрузка...' : 'Проверить заказы'}
                            </button>
                        </div>
                    ) : (
                        <>
                            {refreshing && (
                                <div className="refreshing-indicator">
                                    <p>Обновление заказов...</p>
                                </div>
                            )}
                            {orders.map((order) => (
                                <div key={order.id} className="user-orders">
                                    <div 
                                        className="order-item"
                                        onClick={() => toggleOrderDetails(order.id)}
                                    >
                                        <div className="order-main-info">
                                            <h3 className="order-name">Заказ №{order.id}</h3>
                                            <p className="order-date">
                                                Дата заказа: {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                                            </p>
                                            {order.deliveryDate && (
                                                <p className="order-delivery-date">
                                                    Дата доставки: {new Date(order.deliveryDate).toLocaleDateString('ru-RU')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="order-right-info">
                                           <div className={`status-block status${getStatusClass(order.status)}`}>
                                                <p className="order-status">
                                                    {getStatusLabel(order.status)}
                                                </p>
                                            </div>
                                            <p className="order-total">Сумма: {order.totalAmount} ₽</p>
                                            <button className="order-toggle-btn">
                                                {/* {expandedOrders[order.id] ? '▲' : '▼'} */}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {expandedOrders[order.id] && (
                                        <div className="order-details">
                                            <h4>Состав заказа:</h4>
                                            {order.items && order.items.length > 0 ? (
                                                order.items.map((item) => (
                                                    <div key={item.id ?? `cart-item-${item.bookId || Math.random()}`} className="order-item-detail">
                                                        <div className="order-book-info">
                                                            <p className="order-book-title">{item.book?.title || 'Книга не найдена'}</p>
                                                            <p className="order-book-author">{item.book?.author || ''}</p>
                                                        </div>
                                                        <div className="order-book-price-info">
                                                            <p className="order-book-quantity">Количество: {item.quantity}</p>
                                                            <p className="order-book-price">Цена: {item.book.price} ₽</p>
                                                            <p className="order-book-total">Итого: {item.book.price * item.quantity} ₽</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>Состав заказа не найден</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
            
            <EditProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userData={{
                    fio: clientData.client.fullName,
                    email: clientData.client.email,
                    phoneNumber: clientData.client.phoneNumber,
                    login: clientData.user?.login
                }}
                onSave={handleSaveProfile}
            />
        </>
    )
}

export default User