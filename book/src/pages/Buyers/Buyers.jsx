import { useState, useEffect, useCallback } from 'react'
import Header from '../../components/Header'
import { 
    getAllAdminClients,
    getAdminClientById,
    updateAdminClient,
    deleteAdminClient
} from '../../services/api'
import './Buyers.css'

const Buyers = () => {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [editingClient, setEditingClient] = useState(null)
    const [saving, setSaving] = useState(false)

    const loadClients = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getAllAdminClients()
            setClients(data || [])
        } catch (err) {
            console.error('Ошибка загрузки клиентов:', err)
            setError('Не удалось загрузить список клиентов')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadClients()
    }, [loadClients])

    const getClientLogin = (client) => {
        return client.login || client.user?.login || '—'
    }

    const filteredClients = clients.filter(client => {
        const searchLower = searchTerm.toLowerCase()
        const login = getClientLogin(client)
        
        return (
            client.id?.toString().includes(searchTerm) ||
            (client.fio || '').toLowerCase().includes(searchLower) ||
            (client.email || '').toLowerCase().includes(searchLower) ||
            login.toLowerCase().includes(searchLower) ||
            (client.phoneNumber || '').toLowerCase().includes(searchLower)
        )
    })

    const handleEditClick = async (client) => {
        try {
            const detailed = await getAdminClientById(client.id)
            setEditingClient(detailed)
        } catch (err) {
            console.error(err)
            setEditingClient(client)
        }
    }

    const handleCloseModal = () => {
        setEditingClient(null)
    }

    const handleSaveClient = async () => {
        if (!editingClient) return
        setSaving(true)

        try {
            const updateData = {
                userId: editingClient.userId || editingClient.user?.id,
                fio: editingClient.fio,
                phoneNumber: editingClient.phoneNumber,
                email: editingClient.email
            }

            await updateAdminClient(editingClient.id, updateData)
            alert('Клиент успешно обновлён')
            handleCloseModal()
            loadClients()
        } catch (err) {
            console.error(err)
            alert(err.response?.data?.message || 'Ошибка при сохранении изменений')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteClient = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этого клиента?')) return

        try {
            await deleteAdminClient(id)
            alert('Клиент успешно удалён')
            if (editingClient?.id === id) handleCloseModal()
            loadClients()
        } catch (err) {
            alert(err.response?.data?.message || 'Ошибка при удалении клиента')
        }
    }

    if (loading) return <div className="loading-container"><p>Загрузка клиентов...</p></div>
    if (error) return <div className="error-container"><p>{error}</p><button onClick={loadClients}>Повторить</button></div>

    return (
        <>
            <Header />
            
            <div className="hPage about">
                <h1 className="name-page">Клиенты</h1>
            </div>

            <div className="buyers-admin-page">
                <div className="buyers-toolbar">
                    <div className="search-box">
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Поиск по ID, ФИО, email или логину..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="buyers-table-container">
                    <table className="buyers-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ФИО</th>
                                <th>Телефон</th>
                                <th>Email</th>
                                <th>Логин</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="buyer-row">
                                    <td><span className="buyer-id-text">#{client.id}</span></td>
                                    <td><span className="buyer-name">{client.fio}</span></td>
                                    <td><span className="buyer-phone">{client.phoneNumber}</span></td>
                                    <td><span className="buyer-email">{client.email}</span></td>
                                    <td><span className="buyer-login">{getClientLogin(client)}</span></td>
                                    <td>
                                        <div className="buyer-actions">
                                            <button 
                                                className="buyer-action-btn edit-buyer-btn"
                                                onClick={() => handleEditClick(client)}
                                            >
                                                Изменить
                                            </button>
                                            <button 
                                                className="buyer-action-btn delete-buyer-btn"
                                                onClick={() => handleDeleteClient(client.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingClient && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                Клиент №{editingClient.id}
                            </h2>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-field">
                                <label className="modal-label">ФИО *</label>
                                <input 
                                    type="text" 
                                    className="modal-input"
                                    value={editingClient.fio || ''}
                                    onChange={(e) => setEditingClient({...editingClient, fio: e.target.value})}
                                />
                            </div>

                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">Email (нельзя изменить)</label>
                                    <input 
                                        type="email" 
                                        className="modal-input"
                                        value={editingClient.email || ''}
                                        disabled
                                    />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Телефон</label>
                                    <input 
                                        type="tel" 
                                        className="modal-input"
                                        value={editingClient.phoneNumber || ''}
                                        onChange={(e) => setEditingClient({...editingClient, phoneNumber: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">Логин (нельзя изменить)</label>
                                <input 
                                    type="text" 
                                    className="modal-input"
                                    value={getClientLogin(editingClient)}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-btn cancel-btn" onClick={handleCloseModal}>
                                Отмена
                            </button>
                            <button 
                                className="modal-btn delete-client-modal-btn"
                                onClick={() => handleDeleteClient(editingClient.id)}
                            >
                                Удалить клиента
                            </button>
                            <button 
                                className="modal-btn save-btn" 
                                onClick={handleSaveClient}
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

export default Buyers