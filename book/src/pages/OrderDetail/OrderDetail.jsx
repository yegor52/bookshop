import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { 
    getManagerOrderDetails, 
    updateManagerOrder 
} from '../../services/api'
import './OrderDetail.css'

const OrderDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true)
                const data = await getManagerOrderDetails(id)
                setOrder(data)
            } catch (err) {
                console.error(err)
                setError('Не удалось загрузить данные заказа')
            } finally {
                setLoading(false)
            }
        }

        loadOrder()
    }, [id])

    const handleSaveChanges = async () => {
        if (!order) return

        setSaving(true)
        try {
            const updateData = {
                status: order.status,
                deliveryDate: order.deliveryDate
            }

            await updateManagerOrder(id, updateData)
            alert('Изменения сохранены!')
        } catch (err) {
            alert('Ошибка при сохранении изменений')
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    const handleStatusChange = (e) => {
        setOrder(prev => ({ ...prev, status: e.target.value }))
    }

    const handleDeliveryDateChange = (e) => {
        setOrder(prev => ({ ...prev, deliveryDate: e.target.value }))
    }

    const getStatusClass = (status) => {
        const map = {
            'CREATED': 'status-created',
            'IN_TRANSIT': 'status-processing',
            'DELIVERED': 'status-delivered',
            'COMPLETED': 'status-completed',
            'CANCELLED': 'status-cancelled'
        }
        return map[status] || ''
    }

    const getStatusLabel = (status) => {
        const map = {
            'CREATED': 'Создан',
            'IN_TRANSIT': 'В пути',
            'DELIVERED': 'Доставлен',
            'COMPLETED': 'Завершён',
            'CANCELLED': 'Отменён'
        }
        return map[status] || status
    }

    const formatDate = (date) => {
        if (!date) return ''
        return new Date(date).toISOString().split('T')[0]
    }

    if (loading) return <><Header/><div className="loading-container"><p>Загрузка заказа...</p></div></>
    if (error) return <><Header/><div className="error-container"><p>{error}</p></div></>
    if (!order) return <><Header/><div className="error-container"><p>Заказ не найден</p></div></>

    return (
        <>
            <Header />
            
            <div className="hPage about">
                <h1 className="name-page">Заказ №{order.id}</h1>
            </div>

            <div className="order-detail-page">
                <div className="order-detail-grid">
                    <div className="detail-card">
                        <h3 className="detail-card-title">Основная информация</h3>
                        <div className="detail-info-list">
                            <div className="detail-info-item">
                                <span className="detail-label">Статус</span>
                                <span className={`status-badge ${getStatusClass(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>
                            <div className="detail-info-item">
                                <span className="detail-label">Дата заказа</span>
                                <span className="detail-value">
                                    {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                                </span>
                            </div>
                            <div className="detail-info-item">
                                <span className="detail-label">Дата доставки</span>
                                <input 
                                    type="date" 
                                    className="delivery-date-input"
                                    value={formatDate(order.deliveryDate)}
                                    onChange={handleDeliveryDateChange}
                                />
                            </div>
                            <div className="detail-info-item">
                                <span className="detail-label">Менеджер</span>
                                <span className="detail-value">
                                    {order.manager?.fio || 'Не назначен'}
                                </span>
                            </div>
                            <div className="detail-info-item total-row">
                                <span className="detail-label">Сумма заказа</span>
                                <span className="detail-value total-amount">
                                    {Number(order.totalAmount).toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        </div>

                        <div className="status-actions">
                            <select 
                                className="status-select"
                                value={order.status}
                                onChange={handleStatusChange}
                            >
                                <option value="CREATED">Создан</option>
                                <option value="IN_TRANSIT">В пути</option>
                                <option value="DELIVERED">Доставлен</option>
                                <option value="COMPLETED">Завершён</option>
                                <option value="CANCELLED">Отменён</option>
                            </select>
                            <button 
                                className="save-status-btn" 
                                onClick={handleSaveChanges}
                                disabled={saving}
                            >
                                {saving ? 'Сохранение...' : 'Сохранить'}
                            </button>
                        </div>
                    </div>

                    <div className="detail-card">
                        <h3 className="detail-card-title">Клиент</h3>
                        <div className="client-detail">
                            <div className="client-detail-avatar">
                                {(order.client?.fio || '?').charAt(0)}
                            </div>
                            <div className="client-detail-info">
                                <h4 className="client-detail-name">{order.client?.fio}</h4>
                                <p className="client-detail-email">{order.client?.email}</p>
                                <p className="client-detail-phone">{order.client?.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="detail-card order-composition">
                    <h3 className="detail-card-title">Книги в заказе</h3>
                    <div className="composition-list">
                        {order.items?.map((item) => (
                            <div key={item.compositionId} className="composition-item">
                                <div className="composition-book-info">
                                    <h4 className="composition-book-title">{item.title}</h4>
                                    <p className="composition-book-author">{item.author}</p>
                                </div>
                                <div className="composition-book-details">
                                    <span className="composition-quantity">{item.quantity} шт.</span>
                                    <span className="composition-price">
                                        {Number(item.pricePerUnit).toLocaleString('ru-RU')} ₽
                                    </span>
                                    <span className="composition-total">
                                        {Number(item.totalPrice).toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="composition-summary">
                        <span>
                            Итого ({order.items?.reduce((sum, item) => sum + item.quantity, 0)} книг)
                        </span>
                        <span className="total-price">
                            {Number(order.totalAmount).toLocaleString('ru-RU')} ₽
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderDetail