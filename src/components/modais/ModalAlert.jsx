import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

// Define diferentes tipos de modais com seus respectivos títulos e textos padrões para os botões
const modalTypes = {
  APAGAR: {
    title: 'Confirmar Exclusão', // Título para o modal de confirmação de exclusão
    defaultConfirmText: 'Confirmar', // Texto padrão do botão de confirmação
    cancelText: 'Cancelar', // Texto padrão do botão de cancelamento
  },
  ALERTA: {
    title: 'Atenção', // Título para o modal de alerta
    defaultConfirmText: 'Confirmar',
    cancelText: null, // Não há botão de cancelamento
  },
  SUCESSO: {
    title: 'Sucesso', // Título para o modal de sucesso
    defaultConfirmText: 'Confirmar',
    cancelText: null, // Não há botão de cancelamento
  },
  CONFIRMAR: {
    title: 'Confirmação', // Título para o modal de confirmação
    defaultConfirmText: 'Confirmar',
    cancelText: 'Cancelar',
  },
  ERRO: {
    title: 'MODAL NÃO CONFIGURADO CORRETAMENTE', // Título exibido caso o modalType não seja reconhecido
    defaultConfirmText: 'Confirmar',
    cancelText: null,
  },
};

// Componente funcional para o modal
const ModalAlert = ({
  isOpen,      // Controla se o modal está visível ou não
  onClose,     // Função chamada ao fechar o modal
  onConfirm,   // Função chamada ao confirmar a ação
  message,     // Mensagem a ser exibida no corpo do modal
  modalType,   // Tipo do modal (APAGAR, ALERTA, SUCESSO, etc.)
  confirmText, // Texto personalizado para o botão de confirmação
  children,    // Conteúdo extra que pode ser passado para o modal
}) => {
  // Efeito para fechar o modal ao pressionar a tecla "Escape"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose(); // Fecha o modal se a tecla pressionada for "Escape"
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown); // Adiciona o listener quando o modal está aberto
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown); // Remove o listener quando o modal é fechado
    };
  }, [isOpen, onClose]);

  // Função que é chamada quando o botão de confirmação é clicado
  const handleConfirm = useCallback(() => {
    onConfirm(); // Executa a função de confirmação
    onClose(); // Fecha o modal
  }, [onConfirm, onClose]);

  // Se o modal não estiver aberto, retorna null (não renderiza nada)
  if (!isOpen) return null;

  // Desestrutura os valores do modalTypes baseado no tipo do modal, ou usa o modal de erro caso o tipo seja inválido
  const { title, defaultConfirmText, cancelText } = modalTypes[modalType] || modalTypes.ERRO;

  // Usa o texto de confirmação personalizado ou o padrão
  const finalConfirmText = confirmText || defaultConfirmText;

  // Renderiza o modal dentro do portal, garantindo que ele seja exibido no elemento com o id 'modal-root'
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[440px] h-auto max-w-full">
        {/* Cabeçalho do modal com título */}
        <div className="flex justify-between items-center border-b border-custom-azul-escuro pb-3 mb-4">
          <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
        </div>

        {/* Corpo do modal com a mensagem e conteúdo opcional */}
        <div className="mb-4">
          <p className="text-gray-700 font-bold">{message}</p>
          {children} {/* Renderiza o conteúdo extra passado como children */}
        </div>

        {/* Rodapé do modal com os botões de ação */}
        <div className="flex justify-end space-x-2">
          {cancelText && (
            <button
              className="text-white font-semibold py-2 px-4 rounded-lg bg-gray-500 hover:bg-gray-600 focus:ring-gray-500"
              onClick={onClose}
            >
              {cancelText} {/* Renderiza o botão de cancelar, se houver */}
            </button>
          )}
          <button
            className={`text-white font-semibold py-2 px-4 rounded-lg ${modalType === 'ALERTA' || modalType === 'CONFIRMAR' || modalType === 'SUCESSO'
              ? 'bg-custom-azul-escuro hover:bg-custom-azul focus:ring-custom-azul-escuro'
              : 'bg-custom-vermelho hover:bg-custom-vermelho-escuro focus:ring-custom-vermelho'
              }`}
            onClick={handleConfirm}
          >
            {finalConfirmText} {/* Renderiza o botão de confirmação */}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') // Garante que o modal seja montado no local apropriado no DOM
  );
};

// Define os tipos de propriedades esperados para o componente
ModalAlert.propTypes = {
  isOpen: PropTypes.bool, // Define se o modal está visível
  onClose: PropTypes.func, // Função chamada ao fechar o modal
  onConfirm: PropTypes.func, // Função chamada ao confirmar
  message: PropTypes.string, // Mensagem a ser exibida no modal
  modalType: PropTypes.oneOf(['APAGAR', 'ALERTA', 'SUCESSO']), // Define os tipos permitidos para o modal
  confirmText: PropTypes.string, // Texto do botão de confirmação
  children: PropTypes.node, // Conteúdo opcional a ser exibido no modal
};

export default ModalAlert;