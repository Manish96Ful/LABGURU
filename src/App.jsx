import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Alloy from './pages/Master/Alloy';

const ProtectedRoute = ({ children }) => {
  const userData = localStorage.getItem('userData');
  if (!userData) {
    return <Navigate to="/" replace />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/work_area/alloy-master/:id"
            element={
              <ProtectedRoute>
                <Alloy />
              </ProtectedRoute>
            }
          />
          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
