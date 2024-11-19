export default function IconsTemplate({ funcao, icon, nome, children }) {
    return (
        <div className="mx-2">
            <div className="flex flex-col justify-center items-center">
                <button onClick={funcao} className="flex flex-col justify-center items-center relative">
                    {/* Elementos aninhados (children) */}
                    {children}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-10"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                    <span>{nome}</span>
                </button>
            </div>
        </div>
    );
}
