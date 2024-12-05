import React, { useState, useRef, useEffect, useCallback } from "react";
import ModalModal from '../modais/ModalAlert';
import PropTypes from 'prop-types';

function DragDropFile({ onFileUpload, image }) {
  const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });

  // Estado para indicar se o usuário está arrastando um arquivo sobre a área
  const [dragActive, setDragActive] = useState(false);

  // Estado para armazenar a URL da pré-visualização da imagem
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAlertImagem, setModalAlertImagem] = useState(false);

  // useEffect para gerar e limpar a pré-visualização da imagem quando a prop "image" muda
  useEffect(() => {
    if (image) {
      // Gera a URL da imagem para pré-visualização
      const previewUrl = URL.createObjectURL(image);
      setPreview(previewUrl);

      // Limpa a URL da imagem ao desmontar ou quando a imagem muda
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleModalAlertImagem = () => {
    setModalMessage('Por favor, envie um arquivo de imagem.');
    setModalAlertImagem(true);
  };

  // Função para tratar o arquivo enviado, validando se é uma imagem
  const handleFile = useCallback((file) => {
    if (file.type.startsWith('image/')) {
      // Se o arquivo é uma imagem, chama a função onFileUpload
      onFileUpload(file);
      // Libera a URL da imagem anterior, se houver
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      // Gera uma nova URL de pré-visualização para a nova imagem
      setPreview(URL.createObjectURL(file));
    } else {
      // Caso contrário, exibe o modal de alerta
      handleModalAlertImagem();
    }
  }, [onFileUpload, preview]);

  // Função para gerenciar os eventos de arrastar e soltar
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Define dragActive como true se o arquivo estiver sendo arrastado
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Função para tratar o drop (soltar) do arquivo na área de upload
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false); // Remove o estado de arrastar
    // Verifica se há um arquivo e chama handleFile
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  // Função para lidar com a seleção de arquivos via input
  const handleChange = useCallback((e) => {
    e.preventDefault();
    // Verifica se um arquivo foi selecionado e chama handleFile
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  // Função para simular o clique no input de arquivo
  const onButtonClick = () => {
    inputRef.current.click();
  };

  // useEffect para limpar a URL de pré-visualização ao desmontar o componente
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleConfirmar = () => {
    setModal({ isOpen: false, type: '', message: '' }); 
  };

  return (
    <form
      className="relative w-full max-w-[28rem] h-72 text-center"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
      <label
        htmlFor="input-file-upload"
        className={`flex items-center justify-center h-20 border-2 border-dashed rounded-xl ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-slate-50'}`}
      >
        <div>
          <p className="text-tiny">Arraste e solte sua imagem aqui</p>
          <button
            className="cursor-pointer p-1 text-base bg-transparent hover:underline text-tiny"
            onClick={onButtonClick}
            type="button"
          >
            Carregar arquivo
          </button>
        </div>
      </label>

      {/* Modal de alerta para arquivos inválidos */}
      <ModalModal
        modalType="ALERTA"
        isOpen={modalAlertImagem}
        onClose={() => setModalAlertImagem(false)}
        onConfirm={handleConfirmar}
        confirmText="Fechar"
        message={modalMessage}
      />

      {/* Área que detecta o drag-and-drop e aplica a ação ao soltar */}
      {dragActive && (
        <div
          className="absolute inset-0 w-full h-full rounded-xl"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}

      {/* Pré-visualização da imagem, se houver */}
      {preview && (
        <div className="mt-4">
          <h3>Visualização da Imagem:</h3>
          <img
            src={preview} // Exibe a URL da imagem gerada
            alt="Pré-visualização"
            style={{ maxWidth: "100%", height: "auto" }} // Ajusta o tamanho da imagem
          />
        </div>
      )}
    </form>
  );
}

DragDropFile.propTypes = {
  onFileUpload: PropTypes.func.isRequired, // A função de callback para quando o arquivo é enviado
};

export default DragDropFile;