//DragDrop do modal criar para seleção e visualização da imagem.

import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';

function DragDropFile({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

//tratamento de tipo de arquivo enviado, setado como alert possivel mudança para modal:
  const handleFile = useCallback((file) => {
    if (file.type.startsWith('image/')) {
      onFileUpload(file);
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(file));
    } else {
      alert('Por favor, envie um arquivo de imagem.');
    }
  }, [onFileUpload, preview]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const onButtonClick = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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
      {dragActive && (
        <div
          className="absolute inset-0 w-full h-full rounded-xl"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
      {preview && (
        <div className="mt-4">
          <h3>Visualização da Imagem:</h3>
          <img
            src={preview}
            alt="Pré-visualização"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}
    </form>
  );
}

DragDropFile.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
};

export default DragDropFile;
