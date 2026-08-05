import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    // Redireciona para o login caso tente acessar uma rota protegida sem estar logado
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}