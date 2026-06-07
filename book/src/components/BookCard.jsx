import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"

const BookCard = ({ book }) => {
    const navigate = useNavigate()
    const { addToCart } = useCart()

    const isInStock = book.inStock === 'YES'

    const handleDetailsClick = () => {
        navigate(`/about/${book.id}`)
    }

    const handleAddToCart = async (e) => {
        e.stopPropagation()
        if (!isInStock) return
        await addToCart(book.id, 1)
        alert('Товар добавлен в корзину')
    }

    return (
        <div className="card card-product">
            <div className="info-book">
                <div className="text-book">
                    <h2 className="name-book">{book.title}</h2>
                    <p className="author">{book.author}</p>
                </div>
                <p className="price">{book.price} ₽</p>
            </div>

            <div className="buttons">
                <button 
                    className="catalog-btn basket" 
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                >
                    {isInStock ? 'В корзину' : 'Нет в наличии'}
                </button>
                <button className="catalog-btn details" onClick={handleDetailsClick}>
                    Подробнее
                </button>
            </div>
        </div>
    )
}

export default BookCard