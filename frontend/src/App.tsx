import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Singup/SignupPage';
import Home from './pages/Home/Home';
import { Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import ProfilePage from './pages/Profile/ProfilePage';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<ProtectedRoute component={Home} />} />
        <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
      </Routes>
    </Router>
  </Suspense>

  );
}


export default App;

