import { useState, useEffect, useCallback } from 'react'
import Header from '../../components/Header'
import { 
    getAllAdminEmployees,
    getAdminEmployeeById,
    updateAdminEmployee,
    deleteAdminEmployee,
    registerAdminEmployee
} from '../../services/api'
import './Employees.css'

const Employees = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [positionFilter, setPositionFilter] = useState('all')

    const [editingEmployee, setEditingEmployee] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [saving, setSaving] = useState(false)

    const loadEmployees = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            let data = await getAllAdminEmployees()
            data = data.filter(emp => 
                emp.position !== 'SYSTEM' && 
                emp.fio !== 'Удалённый сотрудник'
            )
            
            setEmployees(data || [])
        } catch (err) {
            console.error('Ошибка загрузки сотрудников:', err)
            setError('Не удалось загрузить список сотрудников')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadEmployees()
    }, [loadEmployees])

    const filteredEmployees = employees.filter(emp => {
        const searchLower = searchTerm.toLowerCase()

        const matchesSearch = 
            emp.id?.toString().includes(searchTerm) ||
            (emp.fio || '').toLowerCase().includes(searchLower) ||
            (emp.email || '').toLowerCase().includes(searchLower) ||
            (emp.login || '').toLowerCase().includes(searchLower)

        const employeeRole = (emp.role || emp.user?.status || '').toUpperCase()
        const matchesRole = roleFilter === 'all' || employeeRole === roleFilter.toUpperCase()

        const matchesPosition = positionFilter === 'all' || emp.position === positionFilter

        return matchesSearch && matchesRole && matchesPosition
    })

    const handleEditClick = async (employee) => {
        try {
            const detailed = await getAdminEmployeeById(employee.id)
            setEditingEmployee({ ...detailed, _isNew: false })
        } catch (err) {
            console.error(err)
            setEditingEmployee({ ...employee, _isNew: false })
        }
    }

    const handleAddClick = () => {
        setEditingEmployee({
            id: null,
            fio: '',
            email: '',
            login: '',
            phoneNumber: '',
            password: '',
            position: 'WORKING',
            role: 'MANAGER',
            _isNew: true
        })
        setShowAddModal(true)
    }

    const handleCloseModal = () => {
        setEditingEmployee(null)
        setShowAddModal(false)
    }

    const handleSaveEmployee = async () => {
        if (!editingEmployee) return
        setSaving(true)

        try {
            if (editingEmployee._isNew) {
                if (!editingEmployee.login?.trim()) return alert('Введите логин')
                if (!editingEmployee.password?.trim()) return alert('Введите пароль')
                if (!editingEmployee.fio?.trim()) return alert('Введите ФИО')
                if (!editingEmployee.email?.trim()) return alert('Введите email')

                await registerAdminEmployee({
                    login: editingEmployee.login,
                    password: editingEmployee.password,
                    fio: editingEmployee.fio,
                    phoneNumber: editingEmployee.phoneNumber,
                    email: editingEmployee.email,
                    role: editingEmployee.role,
                    position: editingEmployee.position
                })
                alert('Сотрудник успешно добавлен')
            } else {
                const updateData = {
                    userId: editingEmployee.userId || editingEmployee.user?.id,
                    fio: editingEmployee.fio,
                    phoneNumber: editingEmployee.phoneNumber,
                    position: editingEmployee.position,
                    email: editingEmployee.email
                }
                await updateAdminEmployee(editingEmployee.id, updateData)
                alert('Сотрудник успешно обновлён')
            }

            handleCloseModal()
            loadEmployees()
        } catch (err) {
            console.error(err)
            alert(err.response?.data?.message || err.message || 'Ошибка при сохранении')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) return
        try {
            await deleteAdminEmployee(id)
            alert('Сотрудник удалён')
            if (editingEmployee?.id === id) handleCloseModal()
            loadEmployees()
        } catch (err) {
            alert('Ошибка при удалении')
        }
    }

    const getRoleLabel = (role) => {
        const r = (role || '').toUpperCase()
        return r === 'ADMIN' ? 'Администратор' : 'Менеджер'
    }

    const getPositionLabel = (pos) => {
        const map = {
            'WORKING': 'Работает',
            'VACATION': 'В отпуске',
            'SICK_LEAVE': 'На больничном',
            'DAY_OFF': 'Выходной'
        }
        return map[pos] || pos
    }

    const getPositionClass = (pos) => `position-${(pos || '').toLowerCase()}`

    if (loading) return <div className="loading-container"><p>Загрузка...</p></div>
    if (error) return <div className="error-container"><p>{error}</p><button onClick={loadEmployees}>Повторить</button></div>

    const isNew = editingEmployee?._isNew

    return (
        <>
            <Header />
            <div className="hPage about"><h1 className="name-page">Сотрудники</h1></div>

            <div className="employees-admin-page">
                <div className="employees-toolbar">
                    <div className="employees-filters">
                        <div className="search-box">
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Поиск по ID, ФИО, email или логину..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select className="filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                            <option value="all">Все роли</option>
                            <option value="ADMIN">Администратор</option>
                            <option value="MANAGER">Менеджер</option>
                        </select>
                        <select className="filter-select" value={positionFilter} onChange={e => setPositionFilter(e.target.value)}>
                            <option value="all">Все позиции</option>
                            <option value="WORKING">Работает</option>
                            <option value="VACATION">В отпуске</option>
                            <option value="SICK_LEAVE">На больничном</option>
                            <option value="DAY_OFF">Выходной</option>
                        </select>
                    </div>
                    <button className="add-employee-btn" onClick={handleAddClick}>
                        Добавить сотрудника
                    </button>
                </div>

                <div className="employees-table-container">
                    <table className="employees-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ФИО</th>
                                <th>Email</th>
                                <th>Логин</th>
                                <th>Телефон</th>
                                <th>Роль</th>
                                <th>Позиция</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="employee-row">
                                    <td><span className="employee-id-text">#{emp.id}</span></td>
                                    <td><span className="employee-name">{emp.fio}</span></td>
                                    <td><span className="employee-email">{emp.email}</span></td>
                                    <td><span className="employee-login">{emp.login}</span></td>
                                    <td><span className="employee-phone">{emp.phoneNumber}</span></td>
                                    <td>
                                        <span className="employee-role">
                                            {getRoleLabel(emp.role)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`position-badge ${getPositionClass(emp.position)}`}>
                                            {getPositionLabel(emp.position)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="employee-actions">
                                            <button className="employee-action-btn edit-employee-btn" 
                                                    onClick={() => handleEditClick(emp)}>
                                                Изменить
                                            </button>
                                            <button className="employee-action-btn delete-employee-btn" 
                                                    onClick={() => handleDeleteEmployee(emp.id)}>
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

            {(editingEmployee || showAddModal) && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {isNew
                                    ? 'Добавление нового сотрудника'
                                    : `Редактирование сотрудника №${editingEmployee?.id}`}
                            </h2>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-field">
                                <label className="modal-label">ФИО *</label>
                                <input 
                                    type="text" 
                                    className="modal-input"
                                    value={editingEmployee?.fio || ''}
                                    onChange={(e) => setEditingEmployee({...editingEmployee, fio: e.target.value})}
                                    placeholder="Фамилия Имя Отчество"
                                />
                            </div>

                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">
                                        Email {!isNew && '(нельзя менять)'}
                                        {isNew && ' *'}
                                    </label>
                                    <input 
                                        type="email" 
                                        className="modal-input"
                                        value={editingEmployee?.email || ''}
                                        onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                                        disabled={!isNew}
                                        placeholder="email@bookshop.ru"
                                    />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Телефон</label>
                                    <input 
                                        type="tel" 
                                        className="modal-input"
                                        value={editingEmployee?.phoneNumber || ''}
                                        onChange={(e) => setEditingEmployee({...editingEmployee, phoneNumber: e.target.value})}
                                        placeholder="+7 (999) 123-45-67"
                                    />
                                </div>
                            </div>

                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">
                                        Логин {!isNew && '(нельзя менять)'}
                                        {isNew && ' *'}
                                    </label>
                                    <input 
                                        type="text" 
                                        className="modal-input"
                                        value={editingEmployee?.login || ''}
                                        onChange={(e) => setEditingEmployee({...editingEmployee, login: e.target.value})}
                                        disabled={!isNew}
                                        placeholder="Логин"
                                    />
                                </div>
                                {isNew && (
                                    <div className="modal-field">
                                        <label className="modal-label">Пароль *</label>
                                        <input 
                                            type="password" 
                                            className="modal-input"
                                            value={editingEmployee?.password || ''}
                                            onChange={(e) => setEditingEmployee({...editingEmployee, password: e.target.value})}
                                            placeholder="Пароль для нового аккаунта"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">Роль</label>
                                    <select 
                                        className="modal-select"
                                        value={editingEmployee?.role || 'MANAGER'}
                                        onChange={(e) => setEditingEmployee({...editingEmployee, role: e.target.value})}
                                        disabled={!isNew}
                                    >
                                        <option value="MANAGER">Менеджер</option>
                                        <option value="ADMIN">Администратор</option>
                                    </select>
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Позиция</label>
                                    <select 
                                        className="modal-select"
                                        value={editingEmployee?.position || 'WORKING'}
                                        onChange={(e) => setEditingEmployee({...editingEmployee, position: e.target.value})}
                                    >
                                        <option value="WORKING">Работает</option>
                                        <option value="VACATION">В отпуске</option>
                                        <option value="SICK_LEAVE">На больничном</option>
                                        <option value="DAY_OFF">Выходной</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-btn cancel-btn" onClick={handleCloseModal}>Отмена</button>
                            {!isNew && (
                                <button className="modal-btn delete-employee-modal-btn" onClick={() => handleDeleteEmployee(editingEmployee.id)}>
                                    Удалить
                                </button>
                            )}
                            <button className="modal-btn save-btn" onClick={handleSaveEmployee} disabled={saving}>
                                {saving ? 'Сохранение...' : isNew ? 'Добавить сотрудника' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Employees