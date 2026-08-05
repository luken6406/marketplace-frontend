import { useState } from "react"

export interface CardProps{
    id: string | number,
    title: string,
    imageUrl?: string,
    category: string,
    description?: string,
    isDonation: boolean,
    price: number
}



function ListingCard({id, title, imageUrl, category, description, isDonation, price}: CardProps){
    return(
        <div
            key={id}
            onClick={() => alert(`Clicou no produto: ${title}`)}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col justify-between"
            >
            {/* Imagem Placeholder */}
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                {imageUrl ? (
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                <span className="text-sm font-medium">Sem Imagem</span>
                )}
            </div>

            {/* Conteúdo do Card */}
            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-[#0d59db] rounded-full">
                    {category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-1">{title}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                {isDonation ? (
                    <span className="text-green-600 font-bold text-lg">Doação</span>
                ) : (
                    <span className="text-gray-900 font-bold text-lg">
                    R$ {price.toFixed(2).replace('.', ',')}
                    </span>
                )}
                </div>
            </div>
        </div>
    )
}

export default ListingCard