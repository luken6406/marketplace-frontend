import React, { useEffect, useState } from 'react';
import Input from '../Input';
import ListingCard, { CardProps } from '../ListingCard';
import { useLocation } from 'react-router-dom';

export const categories: string[] = ['Livros', 'Bolsas', 'Eletrônicos', 'Outros'];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ListingsProps {
  limit?: number;
  showFilters?: boolean;
}

// Interface para a resposta da API (ajuste conforme seu backend)
interface ApiResponse {
  listings: CardProps[];
  totalPages: number;
}

function Listings({ limit, showFilters = true }: ListingsProps) {
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [fetchedListings, setFetchedListings] = useState<CardProps[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1); 
  const [loading, setLoading] = useState<boolean>(true);

  const { state } = useLocation();
  const passedCategories = state?.message;

  const fetchListings = (
    filterSearch = search,
    filterCategory = selectedCategory,
    filterPrice = maxPrice,
    page = currentPage
  ) => {
    setLoading(true);

    const params = new URLSearchParams();
    if (filterSearch) params.append('title', filterSearch);
    if (filterCategory) params.append('category', filterCategory);
    if (filterPrice) params.append('price', filterPrice);
    params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString()); // Opcional: enviar limite se houver

    fetch(`${API_URL}/api/anuncios?${params.toString()}`, {
      method: 'GET',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao buscar anúncios');
        }
        return res.json();
      })
      .then((data: ApiResponse | CardProps[]) => {
        // Compatibilidade caso a API retorne apenas o array ou o objeto paginado
        if (Array.isArray(data)) {
          setFetchedListings(data);
          setTotalPages(1);
        } else {
          setFetchedListings(data.listings);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let initialCategory = selectedCategory;
    if (state && passedCategories) {
      setSelectedCategory(passedCategories);
      initialCategory = passedCategories;
    }
    fetchListings(search, initialCategory, maxPrice, 1);
  }, [state]);

  return (
    <div className={showFilters ? 'min-h-screen bg-gray-50 p-4 md:p-8' : 'w-full'}>
      {/* Barra de Pesquisa */}
      {showFilters && (
        <div className="max-w-7xl mx-auto mb-6 flex gap-2 items-end">
          <div className="flex-1">
            <Input
              text=""
              name="search"
              placeholder="Pesquisar por produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchListings(search, selectedCategory, maxPrice, 1);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium rounded-lg text-sm h-fit"
          >
            Buscar
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Painel Lateral de Filtros */}
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
                  setCurrentPage(1);
                  fetchListings('', '', '', 1);
                }}
                className="mt-2 w-full py-2 bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-medium rounded-lg text-sm"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => {
                  setCurrentPage(1);
                  fetchListings(search, selectedCategory, maxPrice, 1);
                }}
                className="mt-2 w-full py-2 bg-blue-200 hover:bg-gray-300 transition-colors text-gray-700 font-medium rounded-lg text-sm"
              >
                Aplicar Filtros
              </button>
            </div>
          </aside>
        )}

        {/* Grade de Produtos */}
        <main className="flex-1 flex flex-col justify-between">
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                <p className="text-gray-500">Carregando anúncios...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {fetchedListings.length > 0 ? (
                  fetchedListings.map((props: CardProps) => (
                    <ListingCard key={props.id} {...props} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-8">
                    Nenhum produto encontrado.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Paginação Dinâmica */}
          {showFilters && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      fetchListings(search, selectedCategory, maxPrice, pageNumber);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Listings;