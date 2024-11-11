import imagem from "./imagens/image.png";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-200">
      <div className="w-1/4 rounded-md shadow-xl bg-white">
        <div className="flex flex-col items-center justify-center">
          <img src={imagem} className="mt-5 w-2/3" />
        </div>
        <div className="flex flex-col m-10 text-2xl">
          <form method="POST">
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-bold mb-2">
                Usuário:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* User icon */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a5 5 0 100-10 5 5 0 000 10z" />
                    <path
                      fillRule="evenodd"
                      d="M2 19a8 8 0 1116 0H2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="username"
                  className="pl-10 w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Digite seu nome..."
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-bold mb-2">
                Senha:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* Lock icon */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 8a5 5 0 0110 0v1h1a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2h1V8zm2 1h6V8a3 3 0 10-6 0v1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  className="pl-10 w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Digite sua senha..."
                />
              </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
              <button
                type="submit"
                className="w-4/5 h-11 rounded-md flex items-center justify-center text-white bg-cor-footer cursor-pointer hover:bg-[#096066] mt-4"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}