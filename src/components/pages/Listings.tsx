import React, { useEffect, useState } from 'react';
import Input from '../Input';

// Interface para definir a estrutura de cada produto/anúncio
import { CardProps } from '../ListingCard';
import ListingCard from '../ListingCard';


// Dados mockados para exibição inicial
const MOCK_LISTINGS: CardProps[] = [
  {
    id: 1,
    title: 'Livro de Cálculo 1 - Guidorizzi',
    price: 45.0,
    category: 'Livros',
    isDonation: false,
    description: 'Livro em ótimo estado de conservação, sem rasuras.',
  },
  {
    id: 2,
    title: 'Bolsa de Notebook Unifor',
    price: 0,
    category: 'Bolsas',
    isDonation: true,
    description: 'Bolsa acolchoada para notebook de até 15.6 polegadas.',
  },
  {
    id: 3,
    title: 'Calculadora Científica Casio',
    price: 80.0,
    category: 'Eletrônicos',
    isDonation: false,
    description: 'Funcionando perfeitamente, acompanha capa de proteção.',
  },
];


    

function Listings() {

  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const categories: string[] = ['Livros', 'Bolsas', 'Eletrônicos', 'Outros'];

  const [fetchedListings, setFetchedListings] = useState<CardProps[]>([])

    useEffect(() => {
    fetch("http://localhost:3001/api/anuncios", {
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
        console.log(error);
        });
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Barra de Pesquisa Superior */}
      <div className="max-w-7xl mx-auto mb-6">
        <Input
          text=""
          name="search"
          placeholder="Pesquisar por produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Painel Lateral de Filtros */}
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

        {/* Grade de Produtos */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetchedListings.map((props: CardProps) => (
                <ListingCard key={props.id} {...props} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Listings;