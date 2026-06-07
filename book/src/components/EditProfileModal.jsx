import React from 'react'
import '../app/styles/components/EditProfileModal.css'

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
    const [formData, setFormData] = React.useState({
        fio: userData.fio || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        login: userData.login || ''
    })

    if (!isOpen) return null

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
        onClose()
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Редактирование профиля</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label>ФИО:</label>
                        <input
                            type="text"
                            name="fio"
                            value={formData.fio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="modal-form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="modal-form-group">
                        <label>Номер телефона:</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="modal-form-group">
                        <label>Логин:</label>
                        <input
                            type="text"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            required
                            disabled
                        />
                        <small>Логин нельзя изменить</small>
                    </div>
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="modal-cancel-btn">
                            Отмена
                        </button>
                        <button type="submit" className="modal-save-btn">
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfileModal