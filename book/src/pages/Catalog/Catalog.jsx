import '../../app/styles/All.css'
import './Catalog.css'
import BookCard from "../../components/BookCard"
import { useEffect, useState, useCallback } from "react"
import { getBooks } from "../../services/api"
import Header from "../../components/Header"

const Catalog = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const fetchBooks = useCallback(async (search = '') => {
        setLoading(true)
        try {
            const data = await getBooks({ search })
            setBooks(data)
        } catch (error) {
            console.error("Ошибка загрузки товаров:", error)
            setBooks([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBooks(debouncedSearch)
    }, [debouncedSearch, fetchBooks])

    return (
        <>
            <Header/>
            <div className="hPage search-block">
                <h1 className="name-catalog name-page">Каталог</h1>
                <div className="search">
                    <input 
                        className="search-input" 
                        type="text" 
                        placeholder="Поиск по названию или автору"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="catalog">
                {loading ? (
                    <p>Загрузка товаров...</p>
                ) : books.length === 0 ? (
                    <p>По вашему запросу ничего не найдено</p>
                ) : (
                    books.map((book) => (
                        <BookCard 
                            key={book.id} 
                            book={book} 
                        />
                    ))
                )}
            </div>
        </>
    )
}

export default Catalog