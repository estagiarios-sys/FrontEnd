import React, { useState, useRef } from "react";

function DragDropFile({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null); // Para armazenar a visualização da imagem
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onFileUpload(file);
      setPreview(URL.createObjectURL(file)); // Atualiza a visualização da imagem
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileUpload(file);
      setPreview(URL.createObjectURL(file)); // Atualiza a visualização da imagem
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
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
        className={`flex items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded-xl bg-slate-50 ${dragActive ? 'bg-white' : ''}`}
      >
        <div>
          <p className="text-tiny">Arraste e solte sua imagem aqui</p>
          <button
            className="cursor-pointer p-1 text-base bg-transparent hover:underline text-tiny"
            onClick={onButtonClick}
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

export default DragDropFile;
