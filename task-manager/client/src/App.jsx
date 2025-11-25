import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

// A wrapper to protect the Dashboard
// If no session exists, it bounces the user back to Login
function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route: Login i.e Anyone can visit this*/}
        <Route path="/" element={<LoginPage />} />
        
        {/* Protected Route: Dashboard, Accessible only after entering credentials */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;