import { useState } from "react"
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface CardProps {
    id: string | number,
    title: string,
    imgURL?: string,
    category: string,
    description?: string,
    isDonation: boolean,
    price: number,
    showOptions?: boolean,
    onDeleteSuccess?: (id: string | number) => void
}

function ListingCard({
    id, 
    title, 
    imgURL, 
    category, 
    description, 
    isDonation, 
    price, 
    showOptions = false, 
    onDeleteSuccess 
}: CardProps) {
    const navigate = useNavigate();

    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(true);

        try {
            const response = await fetch(`${API_URL}/api/anuncios/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao remover o anúncio.');
            }

            if (onDeleteSuccess) {
                onDeleteSuccess(id);
            }
        } catch (error) {
            console.error(error);
            alert('Não foi possível remover o anúncio.');
        } finally {
            setIsDeleting(false);
            setIsConfirming(false);
        }
    };

    return (
        <div
            key={id}
            onClick={() => navigate(`/listings/${id}`)}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col justify-between relative"
        >
            {/* Imagem Placeholder */}
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                {imgURL ? (
                    <img src={imgURL} alt={title} className="w-full h-full object-contain" />
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

                    {/* Ações do Card */}
                    <div className="flex items-center gap-2">
                        {showOptions && (
                            <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/list', {
                                    state: {
                                        initialData: { id, title, imgURL, category, description, isDonation, price },
                                        method: 'PUT'
                                    }
                                });
                            }}
                            className="text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
                        >
                            Editar
                        </button>
                        )}

                        {/* Área de Remoção */}
                        {showOptions && (
                            <div>
                                {!isConfirming ? (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsConfirming(true);
                                        }}
                                        className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-md transition-colors"
                                    >
                                        Remover
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                        <span className="text-xs text-gray-500 font-medium mr-1">Certeza?</span>
                                        <button
                                            type="button"
                                            disabled={isDeleting}
                                            onClick={handleDelete}
                                            className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition-colors disabled:opacity-50"
                                        >
                                            {isDeleting ? '...' : 'Sim'}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isDeleting}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsConfirming(false);
                                            }}
                                            className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                                        >
                                            Não
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingCard