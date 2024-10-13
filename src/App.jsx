
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import Signin from './pages/Auth/Signin'
import Users from './pages/Admin/Users'
import Products from './pages/Admin/Products'
import { useContext } from 'react'
import { AuthContext } from './context/Auth'
import Reports from './pages/Admin/Reports'
import Purchases from './pages/Admin/Purchases'
import UserDashboard from './pages/POS/UserDashboard'
import UserAddCategory from './pages/POS/UserAddCategory'
import Category from './pages/Admin/Category'
import { UserAddProducts } from './pages/POS/UserAddProducts'
import Web from './pages/POS/Web'
import ProductDetail from './components/ProductDetail'

function App() {
  
  const  user  = useContext(AuthContext);
 
  
  const getInitialRoute = () => {
    if (user?.user?.isLogin && user?.user?.role === "admin") {
      return <Navigate to="/admin/users" />;
    } else if (user?.user?.isLogin) {
      return <Navigate to="/userdashboard" />;
    } else {
      return <Signin />;
    }
  };

  return (
    <>
  
    
    <BrowserRouter>
    
      <Routes>
       
        <Route path='web' element={<Web/>}/>
        <Route path=':id' element={<ProductDetail />} />
        {/* <Route path=':id' element={<ProductDetail />} /> */}

        <Route path="/" element={getInitialRoute()} />

        {/* Admin routes, protected */}
        <Route
          path="/admin"
          element={
            user?.user?.isLogin && user?.user?.role === "admin" ? (
              <Dashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="category" element={<Category />} />
        </Route>

        {/* POS route */}
        <Route
          path="/userdashboard"
          element={user?.user?.isLogin ? <UserDashboard /> : <Navigate to="/" />}
        >
          <Route path="useraddproducts" element={< UserAddProducts/>} />
          <Route path="useraddcategory" element={<UserAddCategory />} />
        </Route>
   
      </Routes>
    </BrowserRouter>
    

    </>
  )
}

export default App
