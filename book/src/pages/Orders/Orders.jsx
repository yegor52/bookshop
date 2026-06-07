
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { 
    getAllManagerOrders, 
    getMyManagerOrders, 
    getUnassignedOrders, 
    assignOrder 
} from '../../services/api'
import './Orders.css'

const Orders = () => {
    const navigate = useNavigate()
    
    const [activeTab, setActiveTab] = useState('all')
    const [orders, setOrders] = useState([])
    const [availableCount, setAvailableCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const fetchOrders = async () => {
        setLoading(true)
        setError(null)
        
        try {
            let data
            if (activeTab === 'all') {
                data = await getAllManagerOrders()
            } else if (activeTab === 'my') {
                data = await getMyManagerOrders()
            } else if (activeTab === 'available') {
                data = await getUnassignedOrders()
            }
            setOrders(data || [])
        } catch (err) {
            console.error(err)
            setError('Не удалось загрузить заказы')
        } finally {
            setLoading(false)
        }
    }

    const fetchAvailableCount = async () => {
        try {
            const data = await getUnassignedOrders()
            setAvailableCount(data?.length || 0)
        } catch (err) {
            console.error('Ошибка получения количества доступных заказов:', err)
            setAvailableCount(0)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [activeTab])

    useEffect(() => {
        fetchAvailableCount()
    }, [])

    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchTerm === '' || 
            order.id.toString().includes(searchTerm) ||
            (order.client?.fio || order.clientName || '').toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter
        
        return matchesSearch && matchesStatus
    })

    const handleAssignOrder = async (orderId) => {
        if (!window.confirm('Взять этот заказ в работу?')) return
        
        try {
            await assignOrder(orderId)
            alert('Заказ успешно взят в работу!')
            fetchOrders()
            fetchAvailableCount()
        } catch (err) {
            alert('Не удалось взять заказ в работу')
            console.error(err)
        }
    }

    const getStatusClass = (status) => {
        const statusMap = {
            'CREATED': 'status-created',
            'IN_TRANSIT': 'status-processing',
            'DELIVERED': 'status-delivered',
            'COMPLETED': 'status-completed',
            'CANCELLED': 'status-cancelled'
        }
        return statusMap[status] || ''
    }

    const getStatusLabel = (status) => {
        const labelMap = {
            'CREATED': 'Создан',
            'IN_TRANSIT': 'В пути',
            'DELIVERED': 'Доставлен',
            'COMPLETED': 'Завершён',
            'CANCELLED': 'Отменён'
        }
        return labelMap[status] || status
    }

    const formatDate = (date) => {
        if (!date) return 'Не указана'
        return new Date(date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const formatPrice = (price) => {
        return `${Number(price || 0).toLocaleString('ru-RU')} ₽`
    }

    return (
        <>
            <Header />
            
            <div className="hPage about">
                <h1 className="name-page">Заказы</h1>
            </div>

            <div className="orders-page">
                <div className="orders-tabs">
                    <button 
                        className={`orders-tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        Все заказы
                    </button>
                    <button 
                        className={`orders-tab ${activeTab === 'my' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my')}
                    >
                        Мои заказы
                    </button>
                    <button 
                        className={`orders-tab ${activeTab === 'available' ? 'active' : ''}`}
                        onClick={() => setActiveTab('available')}
                    >
                        Взять в работу
                        <span className="tab-counter">{availableCount}</span>
                    </button>
                </div>

                <div className="orders-filters">
                    <div className="search-box">
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Поиск по ID или клиенту..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Все статусы</option>
                        <option value="CREATED">Создан</option>
                        <option value="IN_TRANSIT">В пути</option>
                        <option value="DELIVERED">Доставлен</option>
                        <option value="COMPLETED">Завершён</option>
                        <option value="CANCELLED">Отменён</option>
                    </select>
                </div>

                {loading && <div className="loading-container"><p>Загрузка заказов...</p></div>}
                {error && <div className="error-container"><p>{error}</p></div>}

                {!loading && !error && (
                    <>
                        <div className="orders-table-container">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>ID заказа</th>
                                        <th>Клиент</th>
                                        <th>Дата заказа</th>
                                        <th>Дата доставки</th>
                                        <th>Книг</th>
                                        <th>Сумма</th>
                                        <th>Статус</th>
                                        {activeTab === 'all' && <th>Менеджер</th>}
                                        {(activeTab === 'my' || activeTab === 'available') && <th>Действия</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="order-row">
                                            <td className="order-id">
                                                <span className="order-id-text">#{order.id}</span>
                                            </td>
                                            <td className="order-client">
                                                <div className="client-info">
                                                    <div className="client-avatar">
                                                        {(order.client?.fio || order.clientName || '?').charAt(0)}
                                                    </div>
                                                    <span className="client-name">
                                                        {order.client?.fio || order.clientName || '—'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="order-date">
                                                {formatDate(order.orderDate)}
                                            </td>
                                            <td className="order-delivery-date">
                                                {formatDate(order.deliveryDate)}
                                            </td>
                                            <td className="order-books-count">
                                                <span className="books-count-badge">
                                                    {order.items?.length || order.totalBooks || order.booksCount || 0} шт.
                                                </span>
                                            </td>
                                            <td className="order-amount">
                                                {formatPrice(order.totalAmount)}
                                            </td>
                                            <td className="order-status-cell">
                                                <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            {activeTab === 'all' && (
                                                <td className="order-manager">
                                                    {order.manager?.fio || order.managerName || 'Не назначен'}
                                                </td>
                                            )}
                                            {(activeTab === 'my' || activeTab === 'available') && (
                                                <td className="order-actions">
                                                    {activeTab === 'available' ? (
                                                        <button 
                                                            className="action-btn assign-btn"
                                                            onClick={() => handleAssignOrder(order.id)}
                                                        >
                                                            Присвоить
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="action-btn open-btn"
                                                            onClick={() => navigate(`/manager/orders/${order.id}`)}
                                                        >
                                                            Открыть
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredOrders.length === 0 && (
                            <div className="empty-orders">
                                <p>Заказы не найдены</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default Orders