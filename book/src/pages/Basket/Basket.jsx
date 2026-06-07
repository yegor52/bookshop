import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header.jsx"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import './Basket.css'

const Basket = () => {
    const navigate = useNavigate()
    const { isAuthenticated, loading: authLoading } = useAuth()
    const { 
        cartItems, 
        totalItems, 
        totalPrice, 
        deliveryDate, 
        setDeliveryDate, 
        updateQuantity, 
        removeFromCart, 
        checkout,
        isLoading,
        isUpdating
    } = useCart()

    const [isCheckingOut, setIsCheckingOut] = useState(false)

    useEffect(() => {
        if (authLoading) return
        if (!isAuthenticated) navigate('/auth')
    }, [isAuthenticated, navigate, authLoading])

    const getMinDate = () => {
        const today = new Date()
        today.setDate(today.getDate() + 1)
        return today.toISOString().split('T')[0]
    }

    const handleCheckout = async () => {
        if (!deliveryDate) {
            alert('Пожалуйста, выберите дату доставки')
            return
        }
        if (cartItems.length === 0) {
            alert('Корзина пуста')
            return
        }

        setIsCheckingOut(true)
        const success = await checkout()
        if (success) {
            navigate('/user')
        }
        setIsCheckingOut(false)
    }

    if (authLoading || isLoading) {
        return (
            <>
                <Header />
                <div className="basket-loading"><p>Загрузка...</p></div>
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="hPage about">
                <h1 className="name-page">Корзина</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-basket">
                    <p>Ваша корзина пуста</p>
                    <button className="continue-shopping" onClick={() => navigate('/')}>
                        Продолжить покупки
                    </button>
                </div>
            ) : (
                <>
                    <div className="basket-block">
                        <div className="products">
                            {cartItems.map((item) => (
                                <div key={item.id ?? `cart-item-${item.bookId || Math.random()}`} className="product">
                                    <div className="product-info">
                                        <h2 className="name-book">{item.title}</h2>
                                        <p className="author">{item.author}</p>
                                    </div>
                                    <div className="counter">
                                        <button className="count" 
                                            onClick={() => updateQuantity(item, item.quantity - 1)}
                                            disabled={isUpdating}>
                                            -
                                        </button>
                                        <div className="count-data">{item.quantity}</div>
                                        <button className="count" 
                                            onClick={() => updateQuantity(item, item.quantity + 1)}
                                            disabled={isUpdating}>
                                            +
                                        </button>
                                    </div>
                                    <div className="functional-price">
                                        <p className="price">
                                            {(item.totalPrice || item.price * item.quantity).toFixed(0)} ₽
                                        </p>
                                        <button className="delete-product" 
                                            onClick={() => removeFromCart(item)}
                                            disabled={isUpdating}>
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-basket">
                            <div className="order-basket_name">Ваш заказ</div>
                            <div className="product-count_price">
                                <p className="product-count">Товаров ({totalItems})</p>
                                <p className="product-price">{totalPrice} ₽</p>
                            </div>
                            <div className="finaly-price">
                                <p>Итого</p>
                                <p className="price">{totalPrice} ₽</p>
                            </div>
                            <button 
                                className="offer-order" 
                                onClick={handleCheckout}
                                disabled={isUpdating || isCheckingOut}
                            >
                                {isCheckingOut ? 'Оформление...' : 'Оформить заказ'}
                            </button>
                        </div>
                    </div>

                    <div className="delivery-date">
                        <p className="date-name">Дата доставки:</p>
                        <input 
                            type="date" 
                            className="delivery-date_date"
                            value={deliveryDate || ''}
                            min={getMinDate()}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            disabled={isUpdating}
                        />
                    </div>
                </>
            )}
        </>
    )
}

export default Basket