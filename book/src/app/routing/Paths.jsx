import { Routes, Route, Link } from 'react-router-dom'
import Catalog from '../../pages/Catalog/Catalog'
import Auth from '../../pages/Auth/Auth'
import Registr from '../../pages/Registr/Registr'
import Basket from '../../pages/Basket/Basket'
import About from '../../pages/About/About'
import User from '../../pages/User/User'
import ProtectedRoute from './ProtectedRoute'
import Orders from '../../pages/Orders/Orders'
import OrderDetail from '../../pages/OrderDetail/OrderDetail'
import Statistics from '../../pages/Statistics/Statistics'
import OrdersAdmin from '../../pages/OrdersAdmin/OrdersAdmin'
import Books from '../../pages/Books/Books'
import Employees from '../../pages/Employees/Employees'
import Buyers from '../../pages/Buyers/Buyers'

const Paths = () => {
    return (
        <Routes>
            <Route path='/auth' element={<Auth/>} />
            <Route path='/registr' element={<Registr/>} />

            <Route 
                path='/user' 
                element={
                    <ProtectedRoute allowedRoles={['client']}>
                        <User/>
                    </ProtectedRoute>
                } 
            />

            <Route
                path='/basket' 
                element={
                    <ProtectedRoute allowedRoles={['client']}>
                        <Basket/>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path='/about/:id' 
                element={
                    <ProtectedRoute allowedRoles={['client']}>
                        <About/>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path='/' 
                element={
                    <ProtectedRoute allowedRoles={['client']}>
                        <Catalog/>
                    </ProtectedRoute>
                } 
            />

            <Route 
                path='/manager/orders' 
                element={
                    <ProtectedRoute allowedRoles={['manager']}>
                        <Orders/>
                    </ProtectedRoute>
                } 
            />

            <Route 
                path='/manager/orders/:id' 
                element={
                    <ProtectedRoute allowedRoles={['manager']}>
                        <OrderDetail/>
                    </ProtectedRoute>
                } 
            />

            <Route 
                path='/admin/statistics' 
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Statistics/>
                    </ProtectedRoute>
                } 
            />

            <Route 
                path='/admin/orders' 
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <OrdersAdmin/>
                    </ProtectedRoute>
                } 
            />

            <Route 
                path='/admin/books' 
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Books/>
                    </ProtectedRoute>
                } 
            />

            <Route 
                path='/admin/employees' 
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Employees/>
                    </ProtectedRoute>
                } 
            />

            <Route 
                path='/admin/buyers' 
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Buyers/>
                    </ProtectedRoute>
                } 
            />
        </Routes>
    )
}

export default Paths