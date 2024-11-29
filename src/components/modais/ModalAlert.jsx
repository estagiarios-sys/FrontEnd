import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { RemoveScroll } from "react-remove-scroll";

const modalTypes = {
  APAGAR: {
    title: 'Confirmar Exclusão', // Título para o modal de confirmação de exclusão
    defaultConfirmText: 'Confirmar', // Texto padrão do botão de confirmação
    cancelText: 'Cancelar', // Texto padrão do botão de cancelamento
  },
  ALERTA: {
    title: 'Atenção', 
    defaultConfirmText: 'Confirmar',
    cancelText: null, 
  },
  SUCESSO: {
    title: 'Sucesso', 
    defaultConfirmText: 'Confirmar',
    cancelText: null, 
  },
  CONFIRMAR: {
    title: 'Confirmação', 
    defaultConfirmText: 'Confirmar',
    cancelText: 'Cancelar',
  },
  ERRO: {
    title: 'MODAL NÃO CONFIGURADO CORRETAMENTE',
    defaultConfirmText: 'Confirmar',
    cancelText: null,
  },
};

const ModalAlert = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  modalType,
  confirmText,
  children,
}) => {

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]
);
 if (isOpen) {
   window.addEventListener('keydown', handleKeyDown);
 } else {
   window.removeEventListener('keydown', handleKeyDown);
 } 

  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  if (!isOpen) return null;

  // Desestrutura os valores do modalTypes baseado no tipo do modal, ou usa o modal de erro caso o tipo seja inválido
  const { title, defaultConfirmText, cancelText } = modalTypes[modalType] || modalTypes.ERRO;

  // Usa o texto de confirmação personalizado ou o padrão
  const finalConfirmText = confirmText || defaultConfirmText;

  // Renderiza o modal dentro do portal, garantindo que ele seja exibido no elemento com o id 'modal-root'
  return ReactDOM.createPortal(
    <RemoveScroll enabled={isOpen}> {/* Wrap the modal content with RemoveScroll */}
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
      </div>
      </RemoveScroll>,
      document.getElementById('modal-root') // Garante que o modal seja montado no local apropriado no DOM
  );
};

ModalAlert.propTypes = {
  isOpen: PropTypes.bool, // Define se o modal está visível
  onClose: PropTypes.func, // Função chamada ao fechar o modal
  onConfirm: PropTypes.func, // Função chamada ao confirmar
  message: PropTypes.string, // Mensagem a ser exibida no modal
  modalType: PropTypes.oneOf(['APAGAR', 'ALERTA', 'SUCESSO', 'CONFIRMAR']), // Define os tipos permitidos para o modal
  confirmText: PropTypes.string, // Texto do botão de confirmação
  children: PropTypes.node, // Conteúdo opcional a ser exibido no modal
};

export default ModalAlert;