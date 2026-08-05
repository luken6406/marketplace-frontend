import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"; // Ajuste o caminho conforme a estrutura da sua pasta

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const liClassName: string =
    "text-base sm:text-lg md:text-2xl text-white font-semibold hover:text-[#749adb] transition-colors cursor-pointer";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#0d59db] p-4 sm:p-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 shadow-lg shadow-black/25">
      <h1 className="text-2xl sm:text-3xl text-white font-bold text-center md:text-left">
        <Link to="/" className="text-white hover:text-white">
          Desapego Unifor
        </Link>
      </h1>

      <ul className="flex items-center gap-4 sm:gap-6 md:gap-10 list-none m-0 p-0 justify-center md:justify-end flex-wrap">
        <li>
          <Link to="/" className={liClassName}>
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
                className="text-base sm:text-lg md:text-2xl text-red-200 hover:text-red-400 font-semibold transition-colors bg-transparent border-none p-0 cursor-pointer"
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