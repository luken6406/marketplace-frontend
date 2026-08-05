function Input({text, value, name, placeholder, type, onChange, options = []}){
    if(type === 'checkbox'){
        return(
            <div className='flex items-center py-1 gap-3.5'>
                <label htmlFor={name}>{text}</label>
                <input 
                    name={name} 
                    placeholder={placeholder} 
                    type={type}
                    onChange={onChange}
                >
                </input>
            </div>
        )
    }

    if(type === 'select'){
        return(
            <div className='flex flex-col gap-1.5'>
                <div>
                    <label htmlFor={name}>{text}</label>
                </div>
                <div>
                    <select 
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                        name={name}
                        value={value}
                        onChange={onChange}
                    >
                        <option value="">Selecione...</option>
                        {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            </div>
        )
    }

    return(
        <div className='flex flex-col gap-1.5'>
            <div>
                <label 
                    htmlFor={name}>
                        {text}
                </label>
            </div>
            <div>
                <input className="w-full p-2.5 border border-gray-300 rounded-lg "
                    name={name} 
                    value={value}
                    placeholder={placeholder} 
                    type={type}
                    onChange={onChange}>
                </input>
            </div>
        </div>
    )
}

export default Input