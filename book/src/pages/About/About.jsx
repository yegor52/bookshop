import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getBookById } from "../../services/api"
import { useCart } from "../../context/CartContext"
import Header from "../../components/Header"
import './About.css'

const About = () => {
    const { id } = useParams()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const { addToCart, isUpdating } = useCart()

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await getBookById(id)
                setBook(data)
            } catch (error) {
                console.error("Ошибка загрузки книги:", error)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchBook()
    }, [id])

    const isInStock = book?.inStock === 'YES'

    const handleAddToCart = async () => {
        if (!book || !isInStock) return
        const success = await addToCart(book.id, 1)
        if (success) {
            alert('Товар добавлен в корзину!')
        }
    }

    if (loading) return <><Header/><div className="about-block"><p>Загрузка...</p></div></>

    if (!book) {
        return (
            <>
                <Header/>
                <div className="about-block">
                    <p>Книга не найдена</p>
                    <Link to="/">Вернуться в каталог</Link>
                </div>
            </>
        )
    }

    return (
        <>
            <Header/>
            <div className="hPage about">
                <h1 className="name-page">О товаре</h1>
            </div>
            <div className="about-block">
                <div className="card card-book">
                    <div className="info-book">
                        <div className="text-book">
                            <h2 className="name-book">{book.title}</h2>
                            <p className="author">{book.author}</p>
                            <div className="description">
                                <h2 className="descript">Описание:</h2>
                                <p className="description-text">{book.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="athers">
                        <p className="price">{book.price} ₽</p>

                        <button 
                            className="catalog-btn basket" 
                            onClick={handleAddToCart}
                            disabled={!isInStock || isUpdating}
                        >
                            {!isInStock 
                                ? 'Нет в наличии' 
                                : isUpdating 
                                    ? 'Добавление...' 
                                    : 'В корзину'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </>
    )  
}

export default About