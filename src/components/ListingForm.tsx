import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "./Input.tsx";
import { categories } from "./pages/Listings.tsx";
import { useAuth } from "../auth/AuthContext.tsx";
import ErrorCard from './ErrorCard.tsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ListingData {
  id?: string | number;
  title: string;
  price: number;
  imgURL?: string;
  isDonation: boolean;
  category: string;
  description?: string;
}

interface ListingFormProps {
  method?: 'POST' | 'PUT';
  initialData?: ListingData;
}

interface NewListing {
  title: string;
  price: number;
  imgURL: string;
  isDonation: boolean;
  category: string;
  description: string;
  userId: number;
}

function ListingForm(props: ListingFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { method?: 'POST' | 'PUT'; initialData?: ListingData } | null;
  const method = props.method || locationState?.method || 'POST';
  const initialData = props.initialData || locationState?.initialData;

  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [imgURL, setImgURL] = useState<string>(initialData?.imgURL || '');
  const [price, setPrice] = useState<string>(initialData?.price ? String(initialData.price) : '');
  const [isDonation, setIsDonation] = useState<boolean>(initialData?.isDonation || false);
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [category, setCategory] = useState<string>(initialData?.category || '');

  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    const listingPayload: NewListing = {
      title,
      imgURL,
      price: isDonation ? 0 : Number(price) || 0,
      isDonation,
      category,
      description,
      userId: user.id
    };

    const url = method === 'PUT' && initialData?.id
      ? `${API_URL}/api/anuncios/${initialData.id}`
      : `${API_URL}/api/anuncios`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingPayload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao Salvar');
      }

      navigate('/profile');
    } catch (error) {
      setShowError(true);
      if (error instanceof Error) {
        setErrorMessage(`Erro na requisição: ${error.message}`);
      } else {
        setErrorMessage('Erro desconhecido ao salvar.');
      }

      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center my-8 px-4">
      {showError && (
        <ErrorCard msg={String(errorMessage)}/>
      )}
      <form 
        className="w-80 md:w-130 sm:w-120 bg-white flex flex-col border-t-4 border-t-blue-600 border-x border-b border-gray-200 p-8 rounded-b-2xl shadow-md gap-2" 
        onSubmit={submit}
      >
        <h2 className="text-xl font-bold text-gray-800 tracking-wide uppercase mb-2">
          {method === 'PUT' ? 'Edite seu anúncio' : 'Novo Anúncio'}
        </h2>

        <Input 
          text='Título' 
          name='titulo'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input 
          text='URL da Imagem' 
          name='image'
          value={imgURL}
          onChange={(e) => setImgURL(e.target.value)}
        />
        <Input
          options={categories}
          text='Categoria'
          name='categoria'
          type='select'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        {!isDonation && (
          <Input 
            text='Preço' 
            name='price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        )}
        <Input 
          text='É uma doação?' 
          type='checkbox'
          name='isDonation'
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setIsDonation(target.checked);
          }}
        />
        <Input 
          text='Descrição'
          name='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <button 
          className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium cursor-pointer my-4 py-3 px-4 rounded-lg transition-colors duration-200 text-sm tracking-wide uppercase" 
          type="submit"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default ListingForm;