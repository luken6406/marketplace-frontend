import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"; // Ajuste o caminho conforme a estrutura da sua pasta

export const firstListingMessage = 'Crie sua conta para fazer sua primeira venda!'

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goToRegisterScreen = (message: string) => {
    navigate('/register', {
      state:{
        message: message
      }
    })
  }

  // Alterado apenas aqui: fonte mais elegante (font-medium), tamanho ajustado e leve espaçamento (tracking-wide)
  const liClassName: string =
    "text-base md:text-lg text-white font-medium tracking-wide hover:text-[#749adb] transition-colors cursor-pointer antialiased";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="relative z-50 bg-[#0d59db] p-4 sm:p-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 shadow-lg shadow-black/25">
      <h1 className="text-2xl sm:text-3xl text-white font-bold text-center md:text-left">
        <Link to="/" className="text-white hover:text-white">
          <div className="bg-white p-2 px-7 border border-0 rounded-2xl">
              <span className=" font-extrabold text-blue-900 tracking-tight">Desapego</span>
              <span className=" font-bold text-blue-600 ml-1">Unifor</span>
            </div>
        </Link>
      </h1>

      <ul className="flex items-center gap-4 sm:gap-6 md:gap-10 list-none m-0 p-0 justify-center md:justify-end flex-wrap">
        {!user ? (
        <li>
          <button
            onClick={() => {goToRegisterScreen(firstListingMessage)}}
            className="bg-blue-800 hover:bg-blue-500 text-white text-sm font-semibold tracking-wide px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg antialiased"
          >
            Criar Anúncio Grátis
          </button>
        </li>
        ) : (<></>)}
        

        <li>
          <Link to="/listings" className={liClassName}>
            Anúncios
          </Link>
        </li>
        

        {user ? (
          // Opções para usuário LOGADO
          <>
            <li>
              <Link to="/list" className={liClassName}>
                Criar Anúncio
              </Link>
            </li>
            <li>
              <Link to="/profile" className={liClassName}>
                Meu Perfil
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-base md:text-lg text-red-200 hover:text-red-400 font-medium tracking-wide transition-colors bg-transparent border-none p-0 cursor-pointer antialiased"
              >
                Sair
              </button>
            </li>
          </>
        ) : (
          // Opções para usuário NÃO LOGADO
          <li>
            <Link to="/login" className={liClassName}>
              Entrar
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;