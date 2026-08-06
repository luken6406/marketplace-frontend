import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface ListingDetail {
  id: number;
  title: string;
  category: string;
  price: number;
  isDonation: boolean;
  description: string;
  userId: number;
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string; // Opcional, para quando tiver avatar no backend
}

export function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cep, setCep] = useState<string>('');
  const [freteResult, setFreteResult] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState<boolean>(false);

  useEffect(() => {
    async function fetchListingDetail() {
      try {
        const response = await fetch(`http://localhost:3001/api/anuncios/${id}`);
        if (!response.ok) {
          throw new Error('Anúncio não encontrado');
        }
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do anúncio:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchListingDetail();
  }, [id]);

  const handleCalculateFrete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep) return;
    setFreteResult('Entrega Grátis no Campus Unifor (Ponto de Encontro)');
  };

  const handleBuy = async () => {
    setIsBuying(true);
    // Simulação do fluxo de compra online
    setTimeout(() => {
      setIsBuying(false);
      alert('Pedido realizado com sucesso! O anunciante entrará em contato para alinhar os detalhes.');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Carregando anúncio...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Anúncio não encontrado</h2>
        <button
          onClick={() => navigate('/listings')}
          className="text-blue-600 hover:underline text-sm font-semibold"
        >
          Voltar para a lista de anúncios
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Botão de Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-gray-600 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors"
        >
          ← Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coluna Esquerda: Imagem do Produto */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center h-96 md:h-[450px]">
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <span className="text-base font-medium">Imagem do Produto</span>
            </div>
          </div>

          {/* Coluna Direita: Informações e Ações */}
          <div className="flex flex-col justify-between space-y-6">
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-[#0d59db] rounded-full uppercase tracking-wider">
                {listing.category}
              </span>

              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
                {listing.title}
              </h1>

              {/* Preço ou Badge de Doação */}
              <div className="pt-2">
                {listing.isDonation ? (
                  <span className="text-2xl md:text-3xl font-extrabold text-green-600">
                    Doação Gratuita
                  </span>
                ) : (
                  <span className="text-3xl md:text-4xl font-black text-gray-900">
                    R$ {Number(listing.price).toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              {/* Botão de Compra Online / Solicitação */}
              <button
                onClick={handleBuy}
                disabled={isBuying}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300 text-white font-black text-lg py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer mt-2"
              >
                {isBuying
                  ? 'Processando...'
                  : listing.isDonation
                  ? 'Solicitar Doação'
                  : 'Comprar Agora'}
              </button>

              {/* Descrição */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Descrição</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {listing.description || 'Sem descrição informada.'}
                </p>
              </div>
            </div>

            {/* Seção de Frete / Entrega */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Simular Entrega</h3>
              <form onSubmit={handleCalculateFrete} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Calcular
                </button>
              </form>
              {freteResult && (
                <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  {freteResult}
                </p>
              )}
            </div>

            {/* Informações do Vendedor (Com Avatar Clicável) & Contato Direto */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Círculo clicável com foto/inicial do anunciante */}
                <button
                  type="button"
                  onClick={() => {}} // Reservado para futura função
                  className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity focus:outline-none shrink-0"
                >
                  {listing.userAvatarUrl ? (
                    <img
                      src={listing.userAvatarUrl}
                      alt={listing.userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 font-bold text-lg">
                      {listing.userName ? listing.userName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </button>

                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase block">Anunciante</span>
                  <p className="text-base font-bold text-gray-800">
                    {listing.userName || `Usuário #${listing.userId}`}
                  </p>
                </div>
              </div>

              <a
                href={`mailto:${listing.userEmail || ''}?subject=Interesse no anúncio: ${listing.title}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2.5 rounded-xl border border-gray-300 transition-colors text-sm text-center"
              >
                Mensagem
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ListingPage;