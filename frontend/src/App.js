import './App.css';
import {Route, BrowserRouter, Routes} from 'react-router-dom';
import Welcome from './pages/welcome';
import Login from './pages/login';
import Register from './pages/register';
import Cart from './pages/cart';
import Dashboard from './admin/Dashboard';
import Orders from './pages/Orders';
import AddToCart from './pages/addToCart';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Welcome/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/admin/dashboard' element={<ProtectedAdminRoute> <Dashboard/> </ProtectedAdminRoute>}/>
          <Route path='/orders' element={<Orders/>}/>
          <Route path='/addToCart'element={<AddToCart/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
