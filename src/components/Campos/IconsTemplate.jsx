export default function IconsTemplate(props) {
    return (
        <>
            <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={props.funcao} className="flex flex-col justify-center items-center">
                                {/* Ícone e label */}
                                <svg xmlns="www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={props.icon} />
                                </svg>
                                <span>{props.nome}</span>
                            </button>
                    </div>
            </div>
        </>
    )

}