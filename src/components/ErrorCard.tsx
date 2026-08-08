function ErrorCard({msg}: string ){
    return(
        <div className="w-fit max-w-lg mb-4 p-3 bg-red-100/80 border-l-4 border-red-500 rounded-r-md text-red-700 text-sm font-medium">
            <span>{msg}</span>
        </div>
    )
}

export default ErrorCard;