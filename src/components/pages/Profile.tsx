import { useEffect, useState } from 'react';
import ListingCard, { CardProps } from '../ListingCard';
import { useAuth } from '../../auth/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiResponse {
  listings: CardProps[];
  totalPages: number;
}

function Profile() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<CardProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleDeleteSuccess = (deletedId: string | number) => {
    setMyListings((prevListings) =>
      prevListings.filter((item) => item.id !== deletedId)
    );
  };

  useEffect(() => {
    async function fetchMyListings() {
      if (!user?.id) return;

      try {
        const response = await fetch(`${API_URL}/api/anuncios?userId=${user.id}`);
        if (response.ok) {
          const data: ApiResponse | CardProps[] = await response.json();
          
          // Trata tanto o formato novo paginado quanto um array direto por segurança
          const items = Array.isArray(data) ? data : data?.listings;
          
          setMyListings(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        console.error("Erro ao buscar anúncios do usuário:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyListings();
  }, [user]);

  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Painel Lateral - Informações Reais do Usuário */}
        <aside className="w-full md:w-80 bg-white p-6 rounded-lg border border-gray-200 h-fit shadow-sm flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-blue-100 mb-4 border-2 border-blue-500 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-3xl">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <span className="text-xs text-gray-500 mb-6">Usuário Verificado</span>

          <div className="w-full flex flex-col gap-4 text-left border-t border-gray-100 pt-4 text-sm text-gray-700">
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase">E-mail</span>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase">CPF</span>
              <p className="font-medium">{user.cpf}</p>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase">CEP</span>
              <p className="font-medium">{user.cep}</p>
            </div>
          </div>
        </aside>

        {/* Seção Principal - Meus Anúncios */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Meus Anúncios</h1>
            <span className="text-sm font-medium text-gray-500">
              Total: {myListings.length}
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Carregando seus anúncios...</div>
          ) : myListings.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center text-gray-500">
              Você ainda não publicou nenhum anúncio.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((listing) => (
                <ListingCard 
                  key={listing.id} 
                  {...listing} 
                  showOptions={true}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default Profile;