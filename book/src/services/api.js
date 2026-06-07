import axios from "axios"

const API_URL = "http://localhost:8080"

// экземпляр axios с базовыми настройками
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// перехватчик запросов для добавления JWT токена
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// перехватчик ответов для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('user_role')
            window.location.href = '/auth'
        }
        if (error.response?.status === 403) {
            console.error('Доступ запрещен (403):', error.config?.url)
        }
        return Promise.reject(error)
    }
)

// ============ Аутентификация ============

export const authApi = {
    /**
     * Вход в систему
     * POST /api/auth/login
     * Тело запроса: { login: string, password: string }
     * Ответ: { token: string, role: string }
     */
    async login(login, password) {
        try {
            const response = await api.post('/api/auth/login', {
                login,
                password
            })
            
            // response.data содержит { token, role }
            return response.data
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                throw new Error('Неверный логин или пароль')
            }
            throw new Error(error.response?.data?.message || 'Ошибка входа')
        }
    },

    /**
     * Регистрация нового пользователя
     * POST /api/auth/register
     * Тело запроса: { login, password, fio, phoneNumber, email }
     * Ответ: { token: string, role: string }
     */
    async register(formData) {
        try {
            const response = await api.post('/api/auth/register', {
                login: formData.login,
                password: formData.password,
                fio: formData.fio,
                phoneNumber: formData.phoneNumber,
                email: formData.email
            })
            
            // response.data содержит { token, role }
            return response.data
        } catch (error) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error('Ошибка регистрации')
        }
    }
}

// ============ Книги (доступны всем авторизованным) ============

/**
 * Получить список книг с фильтрацией
 * GET /api/books?search=&categoryId=&inStock=YES|NO
 * 
 * Параметры:
 * - search: поиск по названию или автору
 * - categoryId: фильтр по ID категории
 * - inStock: YES/NO для фильтрации по наличию
 * 
 * Ответ: массив книг
 * [{ id, title, author, price, inStock, categoryId, categoryName, description }]
 */
export const getBooks = async (params = {}) => {
    const response = await api.get('/api/books', { params })
    return response.data
}

/**
 * Получить книгу по ID
 * GET /api/books/{id}
 * Ответ: { id, title, author, price, inStock, categoryId, categoryName, description }
 */
export const getBookById = async (id) => {
    const response = await api.get(`/api/books/${id}`)
    return response.data
}

// ============ Профиль клиента ============

/**
 * Получить профиль текущего клиента
 * GET /api/client/profile
 * 
 * Ответ: {
 *   userInfo: { id, login, status },
 *   clientInfo: { id, fio, phoneNumber, email }
 * }
 */
export const getCurrentClientProfile = async () => {
    try {
        const response = await api.get('/api/client/profile')
        return response.data
    } catch (error) {
        console.error("Ошибка получения профиля клиента:", error)
        return null
    }
}

/**
 * Обновить профиль клиента
 * PUT /api/client/profile
 * 
 * Тело запроса: { fullName, phoneNumber, email }
 * Ответ: { id, fio, phoneNumber, email }
 */
export const updateClientProfile = async (profileData) => {
    try {
        const response = await api.put('/api/client/profile', {
            fullName: profileData.fio || profileData.fullName,
            phoneNumber: profileData.phoneNumber,
            email: profileData.email
        })
        return response.data
    } catch (error) {
        console.error("Ошибка обновления профиля:", error)
        throw new Error(error.response?.data?.message || 'Ошибка обновления профиля')
    }
}

// Для обратной совместимости с существующим кодом
export const getClientByUserId = async (userId) => {
    // В новом API получаем профиль текущего пользователя
    return await getCurrentClientProfile()
}

export const updateClient = async (clientId, clientData) => {
    // В новом API clientId не нужен, берется из токена
    return await updateClientProfile(clientData)
}

// ============ Корзина ============

/**
 * Получить корзину текущего клиента
 * GET /api/client/cart
 * 
 * Ответ: {
 *   orderId, status, deliveryDate, totalAmount,
 *   items: [{ id, bookId, title, author, price, quantity, totalPrice }]
 * }
 */
export const getCart = async () => {
    try {
        const response = await api.get('/api/client/cart')
        return response.data
    } catch (error) {
        console.error("Ошибка получения корзины:", error)
        return null
    }
}

// Для обратной совместимости
export const getCartOrder = async (clientId) => {
    return await getCart()
}

/**
 * Добавить книгу в корзину
 * POST /api/client/cart/items
 * 
 * Тело запроса: { bookId, quantity }
 * Ответ: обновленная корзина (CartResponse)
 */
export const addToCart = async (bookId, quantity = 1) => {
    try {
        const response = await api.post('/api/client/cart/items', {
            bookId,
            quantity
        })
        return response.data
    } catch (error) {
        console.error("Ошибка добавления в корзину:", error)
        throw new Error(error.response?.data?.message || 'Ошибка добавления в корзину')
    }
}

// Для обратной совместимости
export const addToComposition = async (compositionData) => {
    return await addToCart(compositionData.bookId, compositionData.quantity)
}

/**
 * Обновить количество товара в корзине
 * PUT /api/client/cart/items/{compositionId}
 * 
 * Тело запроса: { quantity }
 * Ответ: обновленная корзина (CartResponse)
 */
export const updateCartItem = async (compositionId, quantity) => {
    try {
        const response = await api.put(`/api/client/cart/items/${compositionId}`, {
            quantity
        })
        return response.data
    } catch (error) {
        console.error("Ошибка обновления позиции корзины:", error)
        throw new Error(error.response?.data?.message || 'Ошибка обновления корзины')
    }
}

// Для обратной совместимости
export const updateComposition = async (compositionId, compositionData) => {
    return await updateCartItem(compositionId, compositionData.quantity)
}

/**
 * Удалить товар из корзины
 * DELETE /api/client/cart/items/{compositionId}
 */
export const removeFromCart = async (compositionId) => {
    try {
        await api.delete(`/api/client/cart/items/${compositionId}`)
    } catch (error) {
        console.error("Ошибка удаления из корзины:", error)
        throw new Error(error.response?.data?.message || 'Ошибка удаления из корзины')
    }
}

// Для обратной совместимости
export const deleteComposition = async (compositionId) => {
    return await removeFromCart(compositionId)
}

/**
 * Установить дату доставки
 * PATCH /api/client/cart/delivery-date
 * 
 * Тело запроса: { deliveryDate: "2024-12-25" }
 * Ответ: обновленная корзина (CartResponse)
 */
export const setDeliveryDate = async (deliveryDate) => {
    try {
        const response = await api.patch('/api/client/cart/delivery-date', {
            deliveryDate
        })
        return response.data
    } catch (error) {
        console.error("Ошибка установки даты доставки:", error)
        throw new Error(error.response?.data?.message || 'Ошибка установки даты доставки')
    }
}

/**
 * Оформить заказ (checkout)
 * POST /api/client/cart/checkout
 * 
 * Ответ: { orderId, status, totalAmount, deliveryDate }
 */
export const checkout = async () => {
    try {
        const response = await api.post('/api/client/cart/checkout')
        return response.data
    } catch (error) {
        console.error("Ошибка оформления заказа:", error)
        throw new Error(error.response?.data?.message || 'Ошибка оформления заказа')
    }
}

/**
 * Найти позицию в корзине по ID книги
 * (Нет отдельного эндпоинта, фильтруем локально)
 */
export const getCartItemByBookId = async (bookId) => {
    try {
        const cart = await getCart()
        if (cart && cart.items) {
            return cart.items.find(item => item.bookId === bookId) || null
        }
        return null
    } catch (error) {
        console.error("Ошибка поиска позиции в корзине:", error)
        return null
    }
}

// Для обратной совместимости
export const getCompositionByOrderAndBook = async (orderId, bookId) => {
    return await getCartItemByBookId(bookId)
}

// ============ Заказы клиента ============

/**
 * Получить историю заказов текущего клиента
 * GET /api/client/orders
 * 
 * Ответ: массив заказов (без BASKET, новые сверху)
 * [{
 *   id, orderDate, deliveryDate, status, totalAmount,
 *   items: [{ id, bookId, title, author, price, quantity, totalPrice }]
 * }]
 */
export const getClientOrders = async () => {
    try {
        const response = await api.get('/api/client/orders')
        return response.data
    } catch (error) {
        console.error("Ошибка получения заказов:", error)
        return []
    }
}

// Для обратной совместимости
export const getOrdersByClientId = async (clientId) => {
    return await getClientOrders()
}

/**
 * Получить состав заказа
 * (В новом API состав уже включен в ответ getClientOrders)
 */
export const getOrderComposition = async (orderId) => {
    try {
        const orders = await getClientOrders()
        const order = orders.find(o => o.id === orderId)
        return order ? order.items : []
    } catch (error) {
        console.error("Ошибка получения состава заказа:", error)
        return []
    }
}

// Для обратной совместимости
export const getCompositionByOrderId = async (orderId) => {
    return await getOrderComposition(orderId)
}

// ============ Устаревшие методы (для совместимости) ============

/**
 * Получить книгу по ID (для заказов)
 */
export const getBookByIdForOrder = async (bookId) => {
    return await getBookById(bookId)
}

/**
 * Создать заказ (в новом API через checkout)
 */
export const createOrder = async (orderData) => {
    console.warn('createOrder устарел, используйте checkout()')
    return await checkout()
}

/**
 * Обновить заказ (в новом API через updateCartItem и setDeliveryDate)
 */
export const updateOrder = async (orderId, orderData) => {
    console.warn('updateOrder устарел, используйте updateCartItem() и setDeliveryDate()')
    if (orderData.deliveryDate) {
        return await setDeliveryDate(orderData.deliveryDate)
    }
    return null
}

/**
 * Удалить заказ (в новом API через removeFromCart)
 */
export const deleteOrder = async (orderId) => {
    console.warn('deleteOrder устарел, используйте removeFromCart() для удаления позиций')
    return null
}

// ============ Менеджер ============

/**
 * Получить все заказы (для администратора/менеджера)
 */
export const getAllManagerOrders = async () => {
    const response = await api.get('/api/manager/orders')
    return response.data
}

/**
 * Получить только свои заказы
 */
export const getMyManagerOrders = async () => {
    const response = await api.get('/api/manager/orders/my')
    return response.data
}

/**
 * Получить заказы без менеджера (доступные для взятия)
 */
export const getUnassignedOrders = async () => {
    const response = await api.get('/api/manager/orders/unassigned')
    return response.data
}

/**
 * Получить детальную информацию о заказе
 */
export const getManagerOrderDetails = async (orderId) => {
    const response = await api.get(`/api/manager/orders/${orderId}`)
    return response.data
}

/**
 * Взять заказ в работу
 */
export const assignOrder = async (orderId) => {
    const response = await api.patch(`/api/manager/orders/${orderId}/assign`)
    return response.data
}

/**
 * Обновить заказ (статус, дата доставки)
 */
export const updateManagerOrder = async (orderId, data) => {
    const response = await api.patch(`/api/manager/orders/${orderId}`, data)
    return response.data
}

// ============ СТАТИСТИКА (Администратор) ============

/**
 * Получить общую статистику для дашборда
 * GET /api/admin/statistics/overview
 */
export const getAdminDashboardStatistics = async () => {
    const response = await api.get('/api/admin/statistics/overview')
    return response.data
}

/**
 * Получить выручку за сегодня
 * GET /api/admin/statistics/revenue/today
 */
export const getTodayRevenue = async () => {
    const response = await api.get('/api/admin/statistics/revenue/today')
    return response.data
}

/**
 * Получить выручку за текущий месяц
 * GET /api/admin/statistics/revenue/month
 */
export const getMonthRevenue = async () => {
    const response = await api.get('/api/admin/statistics/revenue/month')
    return response.data
}

/**
 * Получить выручку за текущий год
 * GET /api/admin/statistics/revenue/year
 */
export const getYearRevenue = async () => {
    const response = await api.get('/api/admin/statistics/revenue/year')
    return response.data
}

/**
 * Получить топ продаваемых книг
 * GET /api/admin/statistics/books/top-selling
 */
export const getTopSellingBooks = async () => {
    const response = await api.get('/api/admin/statistics/books/top-selling')
    return response.data
}

// ============ Админ — Заказы ============

/**
 * Получить список всех заказов (для таблицы)
 * GET /api/admin/orders
 */
export const getAllAdminOrders = async () => {
    const response = await api.get('/api/admin/orders');
    return response.data;
};

/**
 * Получить детали одного заказа
 * GET /api/admin/orders/{id}
 */
export const getAdminOrderById = async (id) => {
    const response = await api.get(`/api/admin/orders/${id}`);
    return response.data;
};

/**
 * Обновить заказ (статус и/или дату доставки)
 * PATCH /api/admin/orders/{id}
 * Body: { status?: string, deliveryDate?: string }
 */
export const updateAdminOrder = async (id, data) => {
    const response = await api.patch(`/api/admin/orders/${id}`, data);
    return response.data;
};

/**
 * Назначить менеджера на заказ
 * PATCH /api/admin/orders/{orderId}/assign/{employeeId}
 */
export const assignEmployeeToOrder = async (orderId, employeeId) => {
    const response = await api.patch(`/api/admin/orders/${orderId}/assign/${employeeId}`);
    return response.data;
};

/**
 * (Опционально) Получить список всех менеджеров для выбора
 * GET /api/admin/employees
 */
export const getAllEmployees = async () => {
    const response = await api.get('/api/admin/employees');
    return response.data;
};

// ============ Админ — Книги ============

/**
 * Получить все книги (для таблицы)
 * GET /api/admin/books
 */
export const getAllAdminBooks = async () => {
    const response = await api.get('/api/admin/books');
    return response.data;
};

/**
 * Получить одну книгу по ID (для редактирования)
 * GET /api/admin/books/{id}
 */
export const getAdminBookById = async (id) => {
    const response = await api.get(`/api/admin/books/${id}`);
    return response.data;
};

/**
 * Создать новую книгу
 * POST /api/admin/books
 * Body: { title, author, price, inStock, categoryId, description }
 */
export const createAdminBook = async (bookData) => {
    const response = await api.post('/api/admin/books', bookData);
    return response.data;
};

/**
 * Обновить книгу
 * PUT /api/admin/books/{id}
 * Body: { title, author, price, inStock, categoryId, description }
 */
export const updateAdminBook = async (id, bookData) => {
    const response = await api.put(`/api/admin/books/${id}`, bookData);
    return response.data;
};

/**
 * Удалить книгу
 * DELETE /api/admin/books/{id}
 */
export const deleteAdminBook = async (id) => {
    await api.delete(`/api/admin/books/${id}`);
};

/**
 * Получить все категории (для выбора жанра при создании/редактировании)
 * GET /api/admin/categories
 */
export const getAllAdminCategories = async () => {
    const response = await api.get('/api/admin/categories');
    return response.data;
};

// ============ Админ — Сотрудники ============

/**
 * Получить список всех сотрудников
 * GET /api/admin/employees
 */
export const getAllAdminEmployees = async () => {
    const response = await api.get('/api/admin/employees');
    return response.data;
};

/**
 * Получить сотрудника по ID (для редактирования)
 * GET /api/admin/employees/{id}
 */
export const getAdminEmployeeById = async (id) => {
    const response = await api.get(`/api/admin/employees/${id}`);
    return response.data;
};

/**
 * Создать нового сотрудника
 * POST /api/admin/employees
 * Body: { userId, fio, position, phoneNumber, email }
 */
export const createAdminEmployee = async (employeeData) => {
    const response = await api.post('/api/admin/employees', employeeData);
    return response.data;
};

/**
 * Обновить информацию о сотруднике
 * PUT /api/admin/employees/{id}
 * Body: { userId, fio, position, phoneNumber, email }
 * Примечание: login и email обычно нельзя менять
 */
export const updateAdminEmployee = async (id, employeeData) => {
    const response = await api.put(`/api/admin/employees/${id}`, employeeData);
    return response.data;
};

/**
 * Удалить сотрудника
 * DELETE /api/admin/employees/{id}
 */
export const deleteAdminEmployee = async (id) => {
    await api.delete(`/api/admin/employees/${id}`);
};

/**
 * (Опционально) Получить список всех пользователей без сотрудников
 * Для назначения роли при создании нового сотрудника
 */
export const getUsersWithoutEmployee = async () => {
    // Если сделаете такой эндпоинт на бэке
    const response = await api.get('/api/admin/users/without-employee');
    return response.data;
};

/**
 * Зарегистрировать нового сотрудника (создаёт User + Employee атомарно)
 * POST /api/admin/employees/register
 * Body: { login, password, fio, phoneNumber, email, role, position }
 */
export const registerAdminEmployee = async (data) => {
    const response = await api.post('/api/admin/employees/register', data);
    return response.data;
};

// ============ Админ — Клиенты ============

/**
 * Получить список всех клиентов
 * GET /api/admin/clients
 */
export const getAllAdminClients = async () => {
    const response = await api.get('/api/admin/clients');
    return response.data;
};

/**
 * Получить клиента по ID (для редактирования)
 * GET /api/admin/clients/{id}
 */
export const getAdminClientById = async (id) => {
    const response = await api.get(`/api/admin/clients/${id}`);
    return response.data;
};

/**
 * Создать нового клиента
 * POST /api/admin/clients
 * Body: { userId, fio, phoneNumber, email }
 */
export const createAdminClient = async (clientData) => {
    const response = await api.post('/api/admin/clients', clientData);
    return response.data;
};

/**
 * Обновить информацию о клиенте
 * PUT /api/admin/clients/{id}
 * Body: { userId, fio, phoneNumber, email }
 * Примечание: login и email обычно нельзя менять после создания
 */
export const updateAdminClient = async (id, clientData) => {
    const response = await api.put(`/api/admin/clients/${id}`, clientData);
    return response.data;
};

/**
 * Удалить клиента
 * DELETE /api/admin/clients/{id}
 */
export const deleteAdminClient = async (id) => {
    await api.delete(`/api/admin/clients/${id}`);
};

/**
 * (Опционально) Создать клиента через регистрацию + привязку
 * Можно использовать, если нужно создать User + Client одновременно
 */
export const registerAdminClient = async (clientData) => {
    // Используем обычную регистрацию (клиент сам регистрируется как CLIENT)
    const response = await api.post('/api/auth/register', {
        login: clientData.login,
        password: clientData.password,
        fio: clientData.fio,
        phoneNumber: clientData.phoneNumber,
        email: clientData.email
    });
    return response.data;
};

export default api