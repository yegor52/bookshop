import { useState, useEffect, useCallback } from 'react'
import Header from '../../components/Header'
import { 
    getAdminDashboardStatistics, 
    getTodayRevenue, 
    getMonthRevenue, 
    getYearRevenue, 
    getTopSellingBooks 
} from '../../services/api'
import './Statistics.css'

const Statistics = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const [dashboardData, setDashboardData] = useState(null)
    const [todayRevenue, setTodayRevenue] = useState(null)
    const [monthRevenue, setMonthRevenue] = useState(null)
    const [yearRevenue, setYearRevenue] = useState(null)
    const [topBooks, setTopBooks] = useState([])

    const loadAllData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const [dashboard, today, month, year, books] = await Promise.all([
                getAdminDashboardStatistics().catch(() => null),
                getTodayRevenue().catch(() => null),
                getMonthRevenue().catch(() => null),
                getYearRevenue().catch(() => null),
                getTopSellingBooks().catch(() => []),
            ])

            setDashboardData(dashboard)
            setTodayRevenue(today)
            setMonthRevenue(month)
            setYearRevenue(year)
            setTopBooks(Array.isArray(books) ? books : [])
        } catch (err) {
            console.error('Ошибка загрузки статистики:', err)
            setError('Не удалось загрузить данные статистики')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadAllData()
    }, [loadAllData])

    const formatPrice = (price) => {
        if (price === null || price === undefined) return '0 ₽'
        return `${Number(price).toLocaleString('ru-RU')} ₽`
    }

    const formatNumber = (num) => {
        if (num === null || num === undefined) return '0'
        return Number(num).toLocaleString('ru-RU')
    }

    const totalRevenue = dashboardData?.totalRevenue || 0
    const averageCheck = dashboardData?.averageCheck || 0
    const topBook = topBooks.length > 0 ? topBooks[0] : null

    const genreData = {
        name: dashboardData?.topCategory || 'Нет данных',
        salesCount: dashboardData?.topCategorySales || 0
    }

    const topAuthors = (dashboardData?.topAuthors || []).map((author, index) => ({
        rank: index + 1,
        name: author.author || '—',
        sales: author.totalSold || 0,
        revenue: author.revenue || 0
    }))

    while (topAuthors.length < 3) {
        topAuthors.push({ rank: topAuthors.length + 1, name: 'Нет данных', sales: 0, revenue: 0 })
    }

    const topBooksForChart = topBooks.slice(0, 10)

    const completedPercent = dashboardData?.totalOrders 
        ? Math.round((dashboardData.completedOrders / dashboardData.totalOrders) * 100) 
        : 0

    const cancelledPercent = dashboardData?.totalOrders 
        ? Math.round((dashboardData.cancelledOrders / dashboardData.totalOrders) * 100) 
        : 0

    if (loading) {
        return (
            <>
                <Header />
                <div className="hPage about"><h1 className="name-page">Статистика</h1></div>
                <div className="loading-container"><p>Загрузка статистики...</p></div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="hPage about"><h1 className="name-page">Статистика</h1></div>
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={loadAllData}>Повторить загрузку</button>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="hPage about">
                <h1 className="name-page">Статистика</h1>
            </div>

            <div className="statistics-page">
                <div className="quick-stats">
                    <div className="quick-stat-card">
                        <span className="quick-stat-label">Сегодня</span>
                        <span className="quick-stat-value">{formatPrice(todayRevenue?.revenue)}</span>
                    </div>
                    <div className="quick-stat-card">
                        <span className="quick-stat-label">Месяц</span>
                        <span className="quick-stat-value">{formatPrice(monthRevenue?.revenue)}</span>
                    </div>
                    <div className="quick-stat-card">
                        <span className="quick-stat-label">Год</span>
                        <span className="quick-stat-value">{formatPrice(yearRevenue?.revenue)}</span>
                    </div>
                </div>

                <div className="stats-grid stats-grid-2col">
                    <div className="stats-card revenue-card">
                        <h3 className="stats-card-title">Прибыль</h3>
                        <div className="stats-list">
                            <div className="stats-item">
                                <span className="stats-item-label">Общая выручка</span>
                                <span className="stats-item-value highlight">{formatPrice(totalRevenue)}</span>
                            </div>
                            <div className="stats-item">
                                <span className="stats-item-label">Средний чек</span>
                                <span className="stats-item-value">{formatPrice(averageCheck)}</span>
                            </div>
                            <div className="stats-item">
                                <span className="stats-item-label">Всего заказов</span>
                                <span className="stats-item-value">{formatNumber(dashboardData?.totalOrders)}</span>
                            </div>
                            <div className="stats-item">
                                <span className="stats-item-label">Завершено</span>
                                <span className="stats-item-value">{formatNumber(dashboardData?.completedOrders)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="stats-card bestseller-card">
                        <h3 className="stats-card-title">Бестселлер</h3>
                        <div className="bestseller-content">
                            <div className="bestseller-book">
                                <div className="bestseller-cover">{topBook?.title?.charAt(0) || '?'}</div>
                                <div className="bestseller-info">
                                    <h4>{topBook?.title || 'Нет данных'}</h4>
                                    <p>{topBook?.author || '—'}</p>
                                </div>
                            </div>
                            <div className="bestseller-stats">
                                <div className="bestseller-stat">
                                    <span>Продано</span>
                                    <span className="bestseller-stat-value">{formatNumber(topBook?.totalSold)} шт.</span>
                                </div>
                                <div className="bestseller-stat">
                                    <span>Выручка</span>
                                    <span className="bestseller-stat-value">{formatPrice(topBook?.revenue)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-grid stats-grid-2col">
                    <div className="stats-card genre-card">
                        <h3 className="stats-card-title">Популярный жанр</h3>
                        <div className="genre-content">
                            <div className="genre-name">{genreData.name}</div>
                            <div className="genre-stats">
                                <span>В заказах: <strong>{formatNumber(genreData.salesCount)}</strong> шт.</span>
                            </div>
                        </div>
                    </div>

                    <div className="stats-card authors-card">
                        <h3 className="stats-card-title">Топовые авторы</h3>
                        <div className="authors-list">
                            {topAuthors.map((author) => (
                                <div key={author.rank} className="author-item">
                                    <div className="author-rank">
                                        <span className={`rank-badge rank-${author.rank}`}>{author.rank}</span>
                                    </div>
                                    <div className="author-info">
                                        <span className="author-name">{author.name}</span>
                                        <span className="author-sales">
                                            {formatNumber(author.sales)} книг • {formatPrice(author.revenue)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="stats-card chart-card">
                    <h3 className="stats-card-title">Выбор клиентов</h3>
                    <div className="top-books-chart">
                        {topBooksForChart.length > 0 ? (
                            topBooksForChart.map((book, index) => {
                                const maxSold = topBooksForChart[0]?.totalSold || 1
                                const percentage = (book.totalSold / maxSold) * 100
                                return (
                                    <div key={book.bookId || index} className="chart-row">
                                        <div className="book-rank">#{index + 1}</div>
                                        <div className="book-info">
                                            <div className="book-title">{book.title}</div>
                                            <div className="book-author">{book.author}</div>
                                        </div>
                                        <div className="bar-container">
                                            <div className="sales-bar" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <div className="sales-info">
                                            <span className="sales-count">{formatNumber(book.totalSold)}</span>
                                            <span className="sales-unit">шт.</span>
                                        </div>
                                        <div className="revenue-info">{formatPrice(book.revenue)}</div>
                                    </div>
                                )
                            })
                        ) : (
                            <p>Нет данных о продажах</p>
                        )}
                    </div>
                </div>

                <div className="stats-card report-card">
                    <h3 className="stats-card-title">
                        <span className="stats-card-icon"></span> Отчёт
                    </h3>
                    
                    <div className="report-grid">
                        <div className="report-section">
                            <h4>Статус заказов</h4>
                            <div className="status-stats">
                                <div className="status-item">
                                    <span>Завершено</span>
                                    <span className="status-value success">
                                        {formatNumber(dashboardData?.completedOrders)} ({completedPercent}%)
                                    </span>
                                </div>
                                <div className="status-item">
                                    <span>В </span>
                                    <span className="status-value warning">
                                        {formatNumber(dashboardData?.processingOrders)}
                                    </span>
                                </div>
                                <div className="status-item">
                                    <span>Отменено</span>
                                    <span className="status-value danger">
                                        {formatNumber(dashboardData?.cancelledOrders)} ({cancelledPercent}%)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="report-section">
                            <h4>Общая информация</h4>
                            <div className="report-info-grid">
                                <div>Клиентов в базе: <strong>{formatNumber(dashboardData?.totalClients)}</strong></div>
                                <div>Сотрудников: <strong>{formatNumber(dashboardData?.totalEmployees)}</strong></div>
                                <div>Книг в каталоге: <strong>{formatNumber(dashboardData?.totalBooks)}</strong></div>
                                <div>Средний чек: <strong>{formatPrice(averageCheck)}</strong></div>
                            </div>
                        </div>
                    </div>

                    <div className="report-total">
                        <strong>Итого выручка за всё время:</strong> 
                        <span className="total-revenue">{formatPrice(totalRevenue)}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Statistics