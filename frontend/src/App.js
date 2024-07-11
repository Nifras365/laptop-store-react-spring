import './App.css';
import {Route, BrowserRouter, Routes} from 'react-router-dom';
import Welcome from './pages/welcome';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Welcome/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
