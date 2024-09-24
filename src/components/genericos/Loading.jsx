import React from 'react';
import logo from '../../imagens/logo-systextil-cinza.png';

const Loading = () => {
    return (
        <div className="loading-animation">
            <img src={logo} alt="Logo Systextil" className="loading-logo" />
            <div className="loading-circle"></div>
            <style>{`
        .loading-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          z-index: 1000;
        }

        .loading-logo {
          width: 300px;
          height: auto;
        }

        .loading-circle {
          width: 20px;
          padding: 3px;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #00AAB5;
          --_m: 
            conic-gradient(#0000 10%,#000),
            linear-gradient(#000 0 0) content-box;
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