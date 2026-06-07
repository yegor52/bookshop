import { useState, useEffect, useCallback } from 'react'
import Header from '../../components/Header'
import { 
    getAllAdminBooks,
    getAdminBookById,
    createAdminBook,
    updateAdminBook,
    deleteAdminBook,
    getAllAdminCategories
} from '../../services/api'
import './Books.css'

const Books = () => {
    const [books, setBooks] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [genreFilter, setGenreFilter] = useState('all')
    const [stockFilter, setStockFilter] = useState('all')

    const [showAddModal, setShowAddModal] = useState(false)
    const [editingBook, setEditingBook] = useState(null)
    const [showDescription, setShowDescription] = useState(null)
    const [saving, setSaving] = useState(false)

    const loadData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const [booksData, categoriesData] = await Promise.all([
                getAllAdminBooks(),
                getAllAdminCategories()
            ])
            
            setBooks(booksData || [])
            setCategories(categoriesData || [])
        } catch (err) {
            console.error('Ошибка загрузки книг:', err)
            setError('Не удалось загрузить книги')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    const filteredBooks = books.filter(book => {
        const matchesSearch = 
            book.id.toString().includes(searchTerm) ||
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesGenre = genreFilter === 'all' || book.categoryName === genreFilter
        const matchesStock = stockFilter === 'all' || book.inStock === stockFilter

        return matchesSearch && matchesGenre && matchesStock
    })

    const handleEditClick = async (book) => {
        try {
            const detailedBook = await getAdminBookById(book.id)
            setEditingBook(detailedBook)
        } catch (err) {
            console.error(err)
            setEditingBook(book)
        }
    }

    const handleAddClick = () => {
        setEditingBook({
            id: null,
            title: '',
            author: '',
            categoryId: categories[0]?.id || '',
            price: '',
            inStock: 'YES',
            description: ''
        })
        setShowAddModal(true)
    }

    const handleCloseModal = () => {
        setEditingBook(null)
        setShowAddModal(false)
    }

        const handleSaveBook = async () => {
        if (!editingBook) return
        setSaving(true)

        try {
            const bookData = {
                title: editingBook.title,
                author: editingBook.author,
                price: Number(editingBook.price),
                inStock: editingBook.inStock,
                categoryId: Number(editingBook.categoryId),
                description: editingBook.description || ''
            }

            if (editingBook.id) {
                await updateAdminBook(editingBook.id, bookData)
                alert('Книга успешно обновлена')
            } else {
                await createAdminBook(bookData)
                alert('Книга успешно добавлена')
            }

            handleCloseModal()
            loadData() 
        } catch (err) {
            console.error(err)
            alert(err.response?.data?.message || 'Ошибка при сохранении книги')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteBook = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту книгу?')) return

        try {
            await deleteAdminBook(id)
            alert('Книга удалена')
            loadData()
        } catch (err) {
            console.error(err)
            alert('Ошибка при удалении книги')
        }
    }

    const formatPrice = (price) => {
        return `${Number(price || 0).toLocaleString('ru-RU')} ₽`
    }

    if (loading) {
        return (
            <>
                <Header />
                <div className="hPage about"><h1 className="name-page">Книги</h1></div>
                <div className="loading-container"><p>Загрузка каталога...</p></div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="hPage about"><h1 className="name-page">Книги</h1></div>
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
                <h1 className="name-page">Книги</h1>
            </div>

            <div className="books-admin-page">
                <div className="books-admin-toolbar">
                    <div className="books-admin-filters">
                        <div className="search-box">
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Поиск по ID, названию или автору..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select 
                            className="filter-select"
                            value={genreFilter}
                            onChange={(e) => setGenreFilter(e.target.value)}
                        >
                            <option value="all">Все жанры</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <select 
                            className="filter-select"
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                        >
                            <option value="all">Все</option>
                            <option value="YES">В наличии</option>
                            <option value="NO">Нет в наличии</option>
                        </select>
                    </div>
                    <button className="add-book-btn" onClick={handleAddClick}>
                        Добавить книгу
                    </button>
                </div>

                <div className="books-admin-table-container">
                    <table className="books-admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Автор</th>
                                <th>Жанр</th>
                                <th>Цена</th>
                                <th>В наличии</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book) => (
                                <tr key={book.id} className="book-row">
                                    <td><span className="book-id-text">#{book.id}</span></td>
                                    <td><span className="book-title">{book.title}</span></td>
                                    <td><span className="book-author">{book.author}</span></td>
                                    <td><span className="book-genre-badge">{book.categoryName}</span></td>
                                    <td className="book-price">{formatPrice(book.price)}</td>
                                    <td>
                                        <span className={`stock-badge ${book.inStock === 'YES' ? 'in-stock' : 'out-of-stock'}`}>
                                            {book.inStock === 'YES' ? 'В наличии' : 'Нет'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="book-actions">
                                            <button 
                                                className="book-action-btn desc-btn"
                                                onClick={() => setShowDescription(showDescription === book.id ? null : book.id)}
                                            >
                                                Описание
                                            </button>
                                            <button 
                                                className="book-action-btn edit-book-btn"
                                                onClick={() => handleEditClick(book)}
                                            >
                                                Изменить
                                            </button>
                                            <button 
                                                className="book-action-btn delete-book-btn"
                                                onClick={() => handleDeleteBook(book.id)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showDescription && (
                    <div className="description-panel">
                        <div className="description-header">
                            <h3>
                                {books.find(b => b.id === showDescription)?.title}
                            </h3>
                            <button className="description-close" onClick={() => setShowDescription(null)}>
                                Закрыть
                            </button>
                        </div>
                        <p className="description-text">
                            {books.find(b => b.id === showDescription)?.description || 'Описание отсутствует'}
                        </p>
                        <div className="description-meta">
                            <span>Автор: {books.find(b => b.id === showDescription)?.author}</span>
                            <span>Жанр: {books.find(b => b.id === showDescription)?.categoryName}</span>
                            <span>Цена: {formatPrice(books.find(b => b.id === showDescription)?.price)}</span>
                        </div>
                    </div>
                )}
            </div>

            {(editingBook || showAddModal) && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingBook?.id ? `Редактирование книги №${editingBook.id}` : 'Добавление новой книги'}
                            </h2>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-field">
                                <label className="modal-label">Название</label>
                                <input 
                                    type="text" 
                                    className="modal-input"
                                    value={editingBook?.title || ''}
                                    onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                                    placeholder="Введите название книги"
                                />
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Автор</label>
                                <input 
                                    type="text" 
                                    className="modal-input"
                                    value={editingBook?.author || ''}
                                    onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                                    placeholder="Введите имя автора"
                                />
                            </div>
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">Жанр</label>
                                    <select 
                                        className="modal-select"
                                        value={editingBook?.categoryId || ''}
                                        onChange={(e) => setEditingBook({...editingBook, categoryId: e.target.value})}
                                    >
                                        <option value="">Выберите жанр</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">Цена (₽)</label>
                                    <input 
                                        type="number" 
                                        className="modal-input"
                                        value={editingBook?.price || ''}
                                        onChange={(e) => setEditingBook({...editingBook, price: e.target.value})}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">В наличии</label>
                                <select 
                                    className="modal-select"
                                    value={editingBook?.inStock || 'YES'}
                                    onChange={(e) => setEditingBook({...editingBook, inStock: e.target.value})}
                                >
                                    <option value="YES">Да</option>
                                    <option value="NO">Нет</option>
                                </select>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Описание</label>
                                <textarea 
                                    className="modal-textarea"
                                    value={editingBook?.description || ''}
                                    onChange={(e) => setEditingBook({...editingBook, description: e.target.value})}
                                    placeholder="Введите описание книги"
                                    rows={5}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-btn cancel-btn" onClick={handleCloseModal}>
                                Отмена
                            </button>
                            {editingBook?.id && (
                                <button 
                                    className="modal-btn delete-book-modal-btn"
                                    onClick={() => handleDeleteBook(editingBook.id)}
                                >
                                    Удалить книгу
                                </button>
                            )}
                            <button 
                                className="modal-btn save-btn" 
                                onClick={handleSaveBook}
                                disabled={saving}
                            >
                                {saving ? 'Сохранение...' : editingBook?.id ? 'Сохранить изменения' : 'Добавить книгу'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Books