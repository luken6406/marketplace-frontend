import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateListing from './components/pages/CreateListing';
import Listings from './components/pages/Listings';
import Profile from './components/pages/Profile';
import Login from './components/pages/LoginScreen';
import Register from './components/pages/RegisterScreen';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/pages/LandingPage';
import ListingPage from './components/pages/ListingPage';

// Importação dos componentes de autenticação
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import Footer from './components/layout/Footer';

export default function App() {
  return (
    // 1. O AuthProvider envelopa toda a aplicação para compartilhar o estado do usuário
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<LandingPage />} />

          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas Protegidas (Exigem Login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/list" element={<CreateListing />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Rota Padrão (Redireciona URLs inválidas para a Home) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  );
}