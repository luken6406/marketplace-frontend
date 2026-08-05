import React from 'react';


interface InputProps {
    text?: string;
    value?: string | number | boolean;
    name?: string;
    placeholder?: string;
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: string[];
}


function Input({ text, value, name, placeholder, type, onChange, options = [] }: InputProps) {
    if (type === 'checkbox') {
        return (
            <div className='flex items-center py-1 gap-3.5'>
                <label htmlFor={name}>{text}</label>
                <input 
                    name={name} 
                    placeholder={placeholder} 
                    type={type}
                    onChange={onChange}
                />
            </div>
        );
    }

    if (type === 'select') {
        return (
            <div className='flex flex-col gap-1.5'>
                <div>
                    <label htmlFor={name}>{text}</label>
                </div>
                <div>
                    <select 
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                        name={name}
                        value={value as string | number | undefined}
                        onChange={onChange}
                    >
                        <option value="">Selecione...</option>
                        {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-1.5'>
            <div>
                <label htmlFor={name}>
                    {text}
                </label>
            </div>
            <div>
                <input 
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                    name={name} 
                    value={value as string | number | undefined}
                    placeholder={placeholder} 
                    type={type}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

export default Input;