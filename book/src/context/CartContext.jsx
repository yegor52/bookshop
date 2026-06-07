import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    setDeliveryDate as setDeliveryDateApi, 
    checkout as checkoutApi 
} from '../services/api'

const CartContext = createContext()

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}

export const CartProvider = ({ children }) => {
    const { isAuthenticated, user, getUserRole } = useAuth()
    const [cartItems, setCartItems] = useState([])
    const [orderId, setOrderId] = useState(null)
    const [deliveryDate, setDeliveryDate] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const userRole = getUserRole()
    const isClient = userRole?.toLowerCase() === 'client'

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated || !user || !isClient) return
        
        try {
            const cart = await getCart()
            
            if (cart && cart.items) {
                setCartItems(cart.items)
                setOrderId(cart.orderId)
                setDeliveryDate(cart.deliveryDate || null)
            } else {
                setCartItems([])
                setOrderId(null)
                setDeliveryDate(null)
            }
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error)
        }
    }, [isAuthenticated, user, isClient])

    useEffect(() => {
        if (isClient && isAuthenticated) {
            fetchCart()
        }
    }, [isAuthenticated, isClient, fetchCart])

    const getItemId = (item) => item.compositionId || item.id

    const addItem = async (bookId, quantity = 1) => {
        if (!isAuthenticated || !isClient) return false
        
        try {
            const cart = await addToCart(bookId, quantity)
            await fetchCart()
            return true
        } catch (error) {
            console.error('Ошибка добавления в корзину:', error)
            return false
        }
    }

    const updateQuantity = async (item, newQuantity) => {
        if (!isClient) return
        
        const itemId = getItemId(item)
        if (!itemId) {
            console.error("Не найден compositionId у товара:", item)
            return
        }

        if (newQuantity < 1) {
            return removeItem(item)
        }

        try {
            setCartItems(prev => 
                prev.map(i => {
                    if (getItemId(i) === itemId) {
                        const unitPrice = i.pricePerUnit || i.price || 0
                        return {
                            ...i,
                            quantity: newQuantity,
                            totalPrice: unitPrice * newQuantity
                        }
                    }
                    return i
                })
            )

            await updateCartItem(itemId, newQuantity)
        } catch (error) {
            console.error('Ошибка обновления количества:', error)
            await fetchCart() 
        }
    }

    const removeItem = async (item) => {
        if (!isClient) return
        
        const itemId = getItemId(item)
        if (!itemId) return

        try {
            setCartItems(prev => prev.filter(i => getItemId(i) !== itemId))
            await removeFromCart(itemId)
        } catch (error) {
            console.error('Ошибка удаления из корзины:', error)
            await fetchCart()
        }
    }

    const updateDeliveryDate = async (date) => {
        setDeliveryDate(date)
        if (orderId && date) {
            try {
                await setDeliveryDateApi(date)
            } catch (error) {
                console.error('Ошибка установки даты:', error)
            }
        }
    }

    const checkout = async () => {
        if (!isClient) return false
        try {
            await checkoutApi()
            setCartItems([])
            setOrderId(null)
            setDeliveryDate(null)
            return true
        } catch (error) {
            console.error('Ошибка оформления:', error)
            throw error
        }
    }

    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    const totalPrice = cartItems.reduce((sum, item) => {
        const price = item.totalPrice || (item.pricePerUnit || item.price || 0) * (item.quantity || 1)
        return sum + price
    }, 0)

    const value = {
        cartItems,
        totalItems,
        totalPrice,
        deliveryDate,
        orderId,
        setDeliveryDate: updateDeliveryDate,
        addToCart: addItem,
        updateQuantity,
        removeFromCart: removeItem,
        checkout,
        isLoading,
        isUpdating,
        isClient 
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}