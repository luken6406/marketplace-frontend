

function Footer(){
    return(
        <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-300">Desapego Unifor — Marketplace Universitário</p>
            <p className="text-xs text-slate-500 mt-1">Projeto desenvolvido para a comunidade acadêmica.</p>
          </div>
          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Desapego Unifor. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    )
}

export default Footer