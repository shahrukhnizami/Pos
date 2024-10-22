import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import Signin from './pages/Auth/Signin';
import Users from './pages/Admin/Users';
import Products from './pages/Admin/Products';
import { useContext } from 'react';
import { AuthContext } from './context/Auth';
import Reports from './pages/Admin/Reports';
import Purchases from './pages/Admin/Purchases';
import UserDashboard from './pages/POS/UserDashboard';
import UserAddCategory from './pages/POS/UserAddCategory';
import Category from './pages/Admin/Category';
import { UserAddProducts } from './pages/POS/UserAddProducts';
import Web from './pages/POS/Web';
import ProductDetail from './components/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Admin/Orders';
import Stocks from './pages/Admin/Stocks';
// import Categories from './pages/Categories';

function App() {
  const { user } = useContext(AuthContext);

  const getInitialRoute = () => {
    if (user?.isLogin && user?.role === 'admin') {
      return <Navigate to="/admin" />;
    } else if (user?.isLogin) {
      return <Navigate to="/userdashboard" />;
    } else {
      return <Signin />;
    }
  };

  const AdminRoute = ({ element }) =>
    user?.isLogin && user?.role === 'admin' ? element : <Navigate to="/" />;

  const PrivateRoute = ({ element }) =>
    user?.isLogin ? element : <Navigate to="/" />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="web" element={<Web />} />
        <Route path="cart" element={<Cart />} />
        {/* <Route path=":categoryname" element={<Categories />} /> */}
       
        

        
        <Route path=":id" element={<ProductDetail />} />
        <Route path="/" element={getInitialRoute()} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={<AdminRoute element={<Dashboard />} />}
        >
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="category" element={<Category />} />
          <Route path="orders" element={<Orders />} />
          <Route path="Stocks" element={<Stocks />} />
        </Route>

        {/* POS routes */}
        <Route
          path="/userdashboard/"
          element={<PrivateRoute element={<UserDashboard />} />}
        >
          <Route path="useraddproducts" element={<UserAddProducts />} />
          <Route path="useraddcategory" element={<UserAddCategory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
