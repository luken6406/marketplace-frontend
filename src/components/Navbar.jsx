import { Link } from "react-router-dom"

function Navbar() {
  // Ajustamos o tamanho da fonte para ser menor no mobile e '2xl' em telas médias/grandes
  const liClassName = 'text-base sm:text-lg md:text-2xl text-white font-semibold hover:text-[#749adb] transition-colors'

  return (
    <nav className='bg-[#0d59db] p-4 sm:p-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 shadow-lg shadow-black/25'>
        
      <h1 className='text-2xl sm:text-3xl text-white font-bold text-center md:text-left'>
        Desapego Unifor
      </h1>

      <ul className='flex items-center gap-4 sm:gap-6 md:gap-10 list-none m-0 p-0 justify-center md:justify-end flex-wrap'>
        <li> 
          <Link to='/home' className={liClassName}>Anúncios</Link>
        </li>
        <li> 
          <Link to='/list' className={liClassName}>Criar Anúncio</Link>
        </li>
        <li> 
          <Link to='/profile' className={liClassName}>Meu Perfil</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar