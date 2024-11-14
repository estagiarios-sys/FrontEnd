import React, { useState } from "react";
import axios from "axios";
import imagem from "../imagens/image.png";
import { linkFinal } from "../config";
import Select from 'react-select';
import Loading from '../components/genericos/Loading';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nome_empresa, setNome_empresa] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [focusField, setFocusField] = useState(null); 

  const getEmpresas = async () => {
    try {
      const response = await axios.get(`${linkFinal}/companies`);
      setEmpresas(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    getEmpresas();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${linkFinal}/login`, {
        login: username,
        senha: password,
        codigoEmpresa: nome_empresa,
      });

      console.log(response.data);
      localStorage.setItem("token", response.data);
      window.location.href = "/reports";
    } catch (error) {
      setErrorMessage("Usuário ou senha incorretos.");
    }
  };

  const empresasMapeamento = Object.keys(empresas).map((key) => ({
    value: empresas[key].codigo,
    label: `${empresas[key].codigo} - ${empresas[key].nome}`,
  }));

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-200">
      {isLoading && <Loading />}
      <div className="w-1/4 rounded-md shadow-xl bg-white w-2/5">
        <div className="flex flex-col items-center justify-center">
          <img src={imagem} className="mt-5 w-2/3" alt="Login" />
        </div>
        <div className="flex flex-col m-10 text-xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-5 w-full flex flex-col ">
              <Select
                name="nome_empresa"
                className="w-full"
                value={empresasMapeamento.find((option) => option.value === nome_empresa)}

                placeholder="Selecione a empresa"
                options={empresasMapeamento}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? '#fdba74' : provided.backgroundColor,
                    boxShadow: state.isFocused ? '0 0 0 0px #fdba74' : provided.boxShadow,
                    '&:hover': {
                      backgroundColor: state.isFocused ? '#fdba74' : provided['&:hover'].backgroundColor,
                    },
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: state.isFocused || state.hasValue ? 'black' : provided.color,

                  })
                }}
                onChange={(selectedOption) => setNome_empresa(selectedOption.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-bold mb-2">
                Usuário:
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusField === "username" ? "text-black" : "text-gray-400"}`}>
                  <svg
                    className="h-5 w-5"
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
                  value={username}
                  onFocus={() => setFocusField("username")}
                  onBlur={() => setFocusField(null)}
                  onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  className="pl-10 w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-orange-300 focus:text-black"
                  placeholder="USUÁRIO"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-bold mb-2">
                Senha:
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusField === "password" ? "text-black" : "text-gray-400"}`}>
                  <svg
                    className="h-5 w-5"
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
                  value={password}
                  onFocus={() => setFocusField("password")}
                  onBlur={() => setFocusField(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-orange-300 focus:text-black"
                  placeholder="SENHA"
                  required
                />
              </div>
            </div>
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
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
