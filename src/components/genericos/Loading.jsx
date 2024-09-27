// Importa o React para criar o componente funcional
import React from 'react';
// Importa o logo da Systextil da pasta de imagens
import logo from '../../imagens/logo-systextil-cinza.png';

const Loading = () => {
    return (
      <div className="loading-animation">
          {/* Exibe o logo da Systextil */}
          <img src={logo} alt="Logo Systextil" className="loading-logo" />
          
          {/* Exibe um círculo de carregamento animado */}
          <div className="loading-circle"></div>
          
          {/* Estilos CSS embutidos para a animação de carregamento */}
          <style>{`
              /* Container da animação de carregamento */
              .loading-animation {
                position: fixed; /* Fixa o elemento na tela */
                top: 0;
                left: 0;
                width: 100%; /* Ocupa toda a largura da tela */
                height: 100%; /* Ocupa toda a altura da tela */
                display: flex;
                flex-direction: column;
                justify-content: center; /* Centraliza verticalmente */
                align-items: center; /* Centraliza horizontalmente */
                background: rgba(0, 0, 0, 0.7); /* Fundo escuro com opacidade */
                z-index: 1000; /* Garante que fique sobre outros elementos */
              }

              /* Estilo para o logo da Systextil */
              .loading-logo {
                width: 300px; /* Define a largura do logo */
                height: auto; /* Mantém a proporção original da imagem */
              }

              /* Estilo do círculo de carregamento */
              .loading-circle {
                width: 20px; /* Define a largura do círculo */
                padding: 3px; /* Espaço interno ao redor do círculo */
                aspect-ratio: 1; /* Mantém o círculo com proporção 1:1 */
                border-radius: 50%; /* Deixa o círculo completamente redondo */
                background: #00AAB5; /* Define a cor de fundo do círculo */
                
                /* Máscara e efeito de corte para criar o efeito de rotação */
                --_m: 
                  conic-gradient(#0000 10%,#000), /* Gradiente cônico para criar o efeito de rotação */
                  linear-gradient(#000 0 0) content-box;
                -webkit-mask: var(--_m); /* Máscara no Webkit (Chrome/Safari) */
                mask: var(--_m); /* Máscara nos navegadores que suportam */
                -webkit-mask-composite: source-out; /* Combinação de máscaras no Webkit */
                mask-composite: subtract; /* Combinação de máscaras em outros navegadores */
                
                /* Animação contínua de rotação */
                animation: spin 1s infinite linear; /* Roda continuamente a cada 1 segundo */
              }

              /* Definição da animação de rotação */
              @keyframes spin {
                0% {
                  transform: rotate(0deg); /* Ponto inicial da rotação */
                }
                100% {
                  transform: rotate(360deg); /* Completa uma volta de 360 graus */
                }
              }
          `}</style>
      </div>
    );
};

export default Loading;