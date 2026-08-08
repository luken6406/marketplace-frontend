import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';// Ajuste o caminho se necessário

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function Login() {
  const navigate = useNavigate();
  const {user} = useAuth();
  useEffect(() => {
    if(user){
        navigate('/profile')
    }
  }, [user, navigate])

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para tratamento de erro e carregamento
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  const { login } = useAuth(); // Importa a função do AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar login.');
      }

      // 1. Salva os dados do usuário no contexto/localStorage
      login(data.user);

      // 2. Redireciona para a rota "/" (Home / Listings)
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Falha ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        
        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Acesse sua conta</h2>
          <p className="text-sm text-gray-500 mt-1">Entre com seu e-mail e senha para continuar</p>
        </div>

        {/* Mensagem de Erro do Backend */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Divisor */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">Ou</span>
          </div>
        </div>

        {/* Botão para Criar Conta */}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 transition-colors text-sm"
        >
          Criar nova conta
        </button>

      </div>
    </div>
  );
}

export default Login;