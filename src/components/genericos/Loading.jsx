import React from 'react';
import logo from '../../assets/imagens/logo-systextil-cinza.png';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-[1000]">
      {/* Exibe o logo da Systextil */}
      <img src={logo} alt="Logo Systextil" className="w-[300px] h-auto" />

      {/* Exibe um círculo de carregamento animado */}
      <div className="loading-circle w-[20px] p-[3px] aspect-[1] rounded-full bg-[#00AAB5] mt-4"></div>

      {/* Estilos CSS embutidos para a animação de carregamento que não podem ser substituídos por Tailwind */}
      <style>{`
              .loading-circle {
                --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
                -webkit-mask: var(--_m);
                mask: var(--_m);
                -webkit-mask-composite: source-out;
                mask-composite: subtract;
                animation: spin 1s infinite linear;
              }

              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
          `}</style>
    </div>
  );
};

export default Loading;