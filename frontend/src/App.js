import './App.css';
import {Route, BrowserRouter, Routes} from 'react-router-dom';
import Welcome from './pages/welcome';
import Login from './pages/login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Welcome/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
