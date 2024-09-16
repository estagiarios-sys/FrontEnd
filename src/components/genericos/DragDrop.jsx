import React, { useState, useRef } from "react";

function handleFile(files) {
    alert("Número de arquivos: " + files.length);
}

function DragDropFile() {
    const [dragActive, setDragActive] = useState(false);
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
            handleFile(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    return (
        <form
            className="relative w-full max-w-[28rem] h-64 text-center"
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
                className={`flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-xl bg-slate-50 ${dragActive ? 'bg-white' : ''}`}
            >
                <div>
                    <p>Arraste e solte sua imagem aqui</p>
                    <button
                        className="cursor-pointer p-1 text-base bg-transparent hover:underline"
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
        </form>
    );
}

export default DragDropFile;
