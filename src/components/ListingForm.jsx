import { useState } from "react"
import Input from "./Input"

function ListingForm(){

    const categories = ['Livros', 'Bolsas']

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [isDonation, setIsDonation] = useState(false);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    const submit = async (e) => {
        e.preventDefault()
        
        const newListing = {
            title,
            preco: isDonation ? 0 : price,
            isDonation,
            category,
            description
        }

        try{
            const response = await fetch('http://localhost:3001/api/anuncios', {
                    method: 'POST',
                    headers: { 'Content-Type' : 'application/json' },
                    body: JSON.stringify(newListing)
            })

            if(!response){throw new Error('Erro ao salvar')}

            alert("Anuncio Cadastrado")

        }catch (error){
            console.log('Erro na requisição', error)
        }
        
    }



    return(
        <form className='w-75 sm:w-md md:w-lg flex flex-col border border-black/25 p-5 rounded-lg' onSubmit={submit}>
            <Input 
                text='Titulo' 
                name='titulo'
                onChange={(e) => {setTitle(e.target.value)}}
            />
            <Input
                options={categories}
                text='Categoria'
                name='categoria'
                type='select'
                onChange={(e) => {setCategory(e.target.value)}}
            />
            {isDonation ? <></> : 
            <Input 
                text='Preço' 
                name='price'
                onChange={(e) => {setPrice(e.target.value)}}
            />
            }
            <Input 
                text='É uma doação?' 
                type='checkbox'
                name='isDonation'
                checked={isDonation}
                onChange={(e) => {setIsDonation(e.target.checked)}}
            />
            <Input 
                text='Descrição'
                name='description'
                onChange={(e) => {setDescription(e.target.value)}}
            />
            
            <button className='bg-[#0d59db] hover:bg-[#2c6ddb] transition-colors text-white cursor-pointer my-5 p-2.5  rounded-lg' type="submit" >Enviar</button>
        </form>
    )
}

export default ListingForm