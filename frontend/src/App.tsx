import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Singup/SignupPage';
import Home from './pages/Home/Home';

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<Home />} />

        </Routes>
      </Router>
  );
}


export default App;

