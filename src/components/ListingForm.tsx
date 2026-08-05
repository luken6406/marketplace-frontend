import React, { useState } from "react"
import Input from "./Input.tsx"

interface NewListing {
    title: string;
    price: number | string;
    isDonation: boolean;
    category: string;
    description: string;
}

function ListingForm() {
    const categories: string[] = ['Livros', 'Bolsas'];

    const [title, setTitle] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [isDonation, setIsDonation] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const newListing: NewListing = {
            title,
            price: isDonation ? 0 : price,
            isDonation,
            category,
            description
        };

        try {
            const response = await fetch('http://localhost:3001/api/anuncios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newListing)
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar');
            }

            alert("Anúncio Cadastrado");

        } catch (error) {
            if (error instanceof Error) {
                console.log('Erro na requisição:', error.message);
            } else {
                console.log('Erro desconhecido:', error);
            }
        }
    }

    return (
        <form className='w-75 sm:w-md md:w-lg flex flex-col border border-black/25 p-5 rounded-lg' onSubmit={submit}>
            <Input 
                text='Título' 
                name='titulo'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                    setIsDonation(target.checked)
                }}
            />
            <Input 
                text='Descrição'
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            
            <button className='bg-[#0d59db] hover:bg-[#2c6ddb] transition-colors text-white cursor-pointer my-5 p-2.5 rounded-lg' type="submit">
                Enviar
            </button>
        </form>
    );
}

export default ListingForm;