import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [matricula, setMatricula] = useState('');

  // Estados para feedback visual de erro e carregamento
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { state } = useLocation();

  const message = state?.message

  const [showMessage, setShowMessage] = useState(Boolean(message))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Requisição POST para a rota de cadastro no backend
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, cpf, matricula }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se o backend retornar status de erro (ex: 400), lança a mensagem enviada
        throw new Error(data.error || 'Erro ao realizar cadastro.');
      }

      alert('Conta criada com sucesso!');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    const timer = setTimeout(() => {
        setShowMessage(false);
        console.log("setting timer false")
    }, 3000);

    return () => clearTimeout(timer)

  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">


        {showMessage && <div className='bg-green-100 py-2 px-4 border border-green-300 rounded-lg m-5 text-green-700'>
            {state.message}
        </div>}
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        
        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Crie sua conta</h2>
          <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo para se cadastrar</p>
        </div>

        {/* Mensagem de Erro do Backend */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {/* Formulário de Cadastro */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              CPF
            </label>
            <input
              type="text"
              required
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Matrícula
            </label>
            <input
              type="text"
              required
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="00000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

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
              placeholder="Sua Senha"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        {/* Divisor */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">Já tem uma conta?</span>
          </div>
        </div>

        {/* Botão para Voltar ao Login */}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 transition-colors text-sm"
        >
          Voltar para o login
        </button>

      </div>
    </div>
  );
}

export default Register;