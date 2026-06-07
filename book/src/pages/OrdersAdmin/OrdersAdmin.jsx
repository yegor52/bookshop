import { useState, useEffect, useCallback } from 'react'
import Header from '../../components/Header'
import { 
    getAllAdminOrders, 
    getAdminOrderById, 
    updateAdminOrder, 
    assignEmployeeToOrder,
    getAllEmployees 
} from '../../services/api'
import './OrdersAdmin.css'

const OrdersAdmin = () => {
    const [orders, setOrders] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [editingOrder, setEditingOrder] = useState(null)
    const [saving, setSaving] = useState(false)

    const loadData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const [ordersData, employeesData] = await Promise.all([
                getAllAdminOrders(),
                getAllEmployees()
            ])
            
            const filteredOrders = (ordersData || []).filter(order => 
                order.status !== 'BASKET'
            )
            
            setOrders(filteredOrders)
            setEmployees(employeesData || [])
        } catch (err) {
            console.error('Ошибка загрузки заказов:', err)
            setError('Не удалось загрузить заказы')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch = 
            order.id.toString().includes(searchTerm) ||
            (order.clientName || '').toLowerCase().includes(searchLower) ||
            (order.employeeName || '').toLowerCase().includes(searchLower)

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleEditClick = async (order) => {
        try {
            const detailed = await getAdminOrderById(order.id)
            
            let currentEmployeeId = null
            if (detailed.employeeName) {
                const found = employees.find(emp => emp.fio === detailed.employeeName)
                if (found) currentEmployeeId = found.id
            }

            setEditingOrder({
                ...detailed,
                employeeId: currentEmployeeId
            })
        } catch (err) {
            console.error(err)
            setEditingOrder({ ...order, employeeId: null })
        }
    }

    const handleCloseModal = () => {
        setEditingOrder(null)
    }

    const handleSaveOrder = async () => {
        if (!editingOrder) return
        setSaving(true)

        try {
            await updateAdminOrder(editingOrder.id, {
                status: editingOrder.status,
                deliveryDate: editingOrder.deliveryDate
            })

            if (editingOrder.employeeId) {
                await assignEmployeeToOrder(editingOrder.id, editingOrder.employeeId)
            }

            alert('Заказ успешно обновлён')
            handleCloseModal()
            loadData()
        } catch (err) {
            console.error(err)
            alert('Ошибка при сохранении изменений')
        } finally {
            setSaving(false)
        }
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

    const formatDate = (date) => !date ? '—' : new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })

    const formatPrice = (price) => `${Number(price || 0).toLocaleString('ru-RU')} ₽`

    if (loading) {
        return (
            <>
                <Header />
                <div className="hPage about"><h1 className="name-page">Заказы</h1></div>
                <div className="loading-container"><p>Загрузка заказов...</p></div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="hPage about"><h1 className="name-page">Заказы</h1></div>
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={loadData}>Повторить загрузку</button>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="hPage about">
                <h1 className="name-page">Заказы</h1>
            </div>

            <div className="orders-admin-page">
                <div className="orders-admin-filters">
                    <div className="search-box">
                        <span className="search-icon"></span>
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Поиск по ID, клиенту или менеджеру..."
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

                <div className="orders-admin-table-container">
                    <table className="orders-admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Клиент</th>
                                <th>Менеджер</th>
                                <th>Дата заказа</th>
                                <th>Дата доставки</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="order-row">
                                    <td className="order-id"><span className="order-id-text">#{order.id}</span></td>
                                    <td>
                                        <div className="client-cell">
                                            <div className="client-avatar">{order.clientName?.charAt(0) || '?'}</div>
                                            <span className="client-name">{order.clientName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {order.employeeName ? (
                                            <div className="manager-cell">
                                                <div className="manager-avatar">{order.employeeName.charAt(0)}</div>
                                                <span className="manager-name">{order.employeeName}</span>
                                            </div>
                                        ) : (
                                            <span className="no-manager">Не назначен</span>
                                        )}
                                    </td>
                                    <td className="date-cell">{formatDate(order.orderDate)}</td>
                                    <td className="date-cell">
                                        <span className={!order.deliveryDate ? 'no-date' : ''}>
                                            {formatDate(order.deliveryDate)}
                                        </span>
                                    </td>
                                    <td className="amount-cell">{formatPrice(order.totalAmount)}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEditClick(order)}>
                                            Редактировать
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingOrder && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Редактирование заказа №{editingOrder.id}</h2>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-section">
                                <h4 className="modal-section-title">Клиент</h4>
                                <div className="client-detail-modal">
                                    <div className="client-detail-avatar">
                                        {editingOrder.clientName?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="client-detail-name">{editingOrder.clientName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h4 className="modal-section-title">Менеджер</h4>
                                <select 
                                    className="modal-select"
                                    value={editingOrder.employeeId || ''}
                                    onChange={(e) => setEditingOrder({
                                        ...editingOrder, 
                                        employeeId: e.target.value ? Number(e.target.value) : null
                                    })}
                                >
                                    {(!editingOrder.employeeId) && (
                                        <option value="">Не назначен</option>
                                    )}
                                    
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.fio}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-section">
                                <h4 className="modal-section-title">Статус заказа</h4>
                                <select 
                                    className="modal-select"
                                    value={editingOrder.status}
                                    onChange={(e) => setEditingOrder({
                                        ...editingOrder, 
                                        status: e.target.value
                                    })}
                                >
                                    <option value="CREATED">Создан</option>
                                    <option value="IN_TRANSIT">В пути</option>
                                    <option value="DELIVERED">Доставлен</option>
                                    <option value="COMPLETED">Завершён</option>
                                    <option value="CANCELLED">Отменён</option>
                                </select>
                            </div>

                            <div className="modal-section">
                                <h4 className="modal-section-title">Дата доставки</h4>
                                <input 
                                    type="date" 
                                    className="modal-date-input"
                                    value={editingOrder.deliveryDate ? editingOrder.deliveryDate.split('T')[0] : ''}
                                    onChange={(e) => setEditingOrder({
                                        ...editingOrder, 
                                        deliveryDate: e.target.value || null
                                    })}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-btn cancel-btn" onClick={handleCloseModal}>
                                Отмена
                            </button>
                            <button 
                                className="modal-btn save-btn" 
                                onClick={handleSaveOrder}
                                disabled={saving}
                            >
                                {saving ? 'Сохранение...' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default OrdersAdmin