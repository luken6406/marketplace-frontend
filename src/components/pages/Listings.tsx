import React, { useEffect, useState } from 'react';
import Input from '../Input';
import ListingCard, { CardProps } from '../ListingCard';
import { useLocation } from 'react-router-dom';

export const categories: string[] = ['Livros', 'Bolsas', 'Eletrônicos', 'Outros'];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ListingsProps {
  /** Quantidade máxima de anúncios a serem exibidos (útil para a Landing Page) */
  limit?: number;
  /** Exibir ou ocultar a barra de busca e o painel lateral de filtros (padrão: true) */
  showFilters?: boolean;
}

function Listings({ limit, showFilters = true }: ListingsProps) {
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const [fetchedListings, setFetchedListings] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { state } = useLocation();
  const passedCategories = state?.message;

  const handlePassedCategories = (cat: string) => {
    setSelectedCategory(cat);
  }

  useEffect(() => {
    
    if(state){
        handlePassedCategories(passedCategories);
    }

    setLoading(true);
    fetch(`${API_URL}/api/anuncios`, {
      method: 'GET',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao buscar anúncios');
        }
        return res.json();
      })
      .then((data: CardProps[]) => {
        setFetchedListings(data);
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Lógica de filtragem
  const filteredListings = fetchedListings.filter((item) => {
    const matchesSearch =
      search === '' || item.title.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === '' || item.category === selectedCategory;

    const matchesPrice =
      maxPrice === '' || item.price <= Number(maxPrice);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Limita a quantidade de itens exibidos se a prop 'limit' for informada
  const displayedListings = limit
    ? filteredListings.slice(0, limit)
    : filteredListings;

  return (
    <div className={showFilters ? 'min-h-screen bg-gray-50 p-4 md:p-8' : 'w-full'}>
      {/* Barra de Pesquisa Superior (só aparece se showFilters = true) */}
      {showFilters && (
        <div className="max-w-7xl mx-auto mb-6">
          <Input
            text=""
            name="search"
            placeholder="Pesquisar por produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Painel Lateral de Filtros (só aparece se showFilters = true) */}
        {showFilters && (
          <aside className="w-full md:w-64 bg-white p-5 rounded-lg border border-gray-200 h-fit shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Filtros</h2>

            <div className="flex flex-col gap-4">
              <Input
                text="Categoria"
                type="select"
                name="categoryFilter"
                options={categories}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />

              <Input
                text="Preço Máximo (R$)"
                type="text"
                name="priceFilter"
                placeholder="Ex: 50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />

              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                  setMaxPrice('');
                }}
                className="mt-2 w-full py-2 bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-medium rounded-lg text-sm"
              >
                Limpar Filtros
              </button>
            </div>
          </aside>
        )}

        {/* Grade de Produtos */}
        <main className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
              <p className="text-gray-500">Carregando anúncios...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedListings.length > 0 ? (
                displayedListings.map((props: CardProps) => (
                  <ListingCard key={props.id} {...props} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-8">
                  Nenhum produto encontrado.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Listings;