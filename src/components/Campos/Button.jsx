export default function Button(props){
    return (
        <>
            <button
            className="p-2 px-5 text-white bg-custom-azul hover:bg-custom-azul-escuro active:bg-custom-azul rounded-lg mr-2"
            onClick={props.function}
            >
                {props.text}
            </button>
        </>
    )
}