import React, { useState, useEffect, useRef } from "react";
import "../genericos/DragDrop.jsx";
import DragDropFile from "../genericos/DragDrop.jsx";

function ModalPersonalizar({ isOpen, onClose, handleTitlePdf, handleImgPdf }) {
    const [isHoveredButtonX, setIsHoveredButtonX] = useState(false);
    const [isHoveredButtonExcluir, setIsHoveredButtonExcluir] = useState(false);
    const [isHoveredButtonCancelar, setIsHoveredButtonCancelar] = useState(false);
    const [isHoveredButtonCarregar, setIsHoveredButtonCarregar] = useState(false);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);

    const handleImageUpload = (file) => {
        setImage(file);
    };

    const resetHoverStates = () => {
        setIsHoveredButtonX(false);
    };

    const handleClose = () => {
        resetHoverStates();
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "0px",
                    borderRadius: "5px",
                    position: "relative",
                    width: "500px",
                    height: "550px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div className="w-full bg-custom-azul-escuro flex flex-row justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">PERSONALIZAR</h5>
                    <button
                        className="font-bold mx-2"
                        onClick={handleClose}
                        style={{
                            borderRadius: "50px",
                            cursor: "pointer",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "16px",
                            transition: "background-color 0.3s ease",
                            backgroundColor: isHoveredButtonX ? "#00AAB5" : "#0A7F8E",
                        }}
                        onMouseEnter={() => setIsHoveredButtonX(true)}
                        onMouseLeave={() => setIsHoveredButtonX(false)}
                    >
                        X
                    </button>
                </div>
                <div style={{ flex: 1, width: '100%', padding: '10px' }}>
                    <h5 className="font-medium mb-1 mt-4 ml-1">Título:</h5>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Digite..."
                        className="border border-custom-azul-escuro focus:ring-1 focus:ring-custom-azul-escuro rounded p-2 focus:outline-none w-full mb-2 mt-1"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.target.blur();
                            }
                        }}
                    />
                    <h5 className="font-medium mb-1 mt-4 ml-1">Logotipo:</h5>
                    <div className="flex-1 w-full p-2 flex justify-center items-center overflow-auto">
                        <DragDropFile onFileUpload={handleImageUpload} />
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "10px",
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        boxSizing: "border-box",
                        backgroundColor: "#fff",
                        width: '100%',
                    }}
                >
                    <button
                        style={{
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "5px",
                            color: "#fff",
                            width: "80px",
                            height: "40px",
                            fontSize: "13px",
                            cursor: "pointer",
                            marginRight: "230px",
                            transition: "background-color 0.3s ease",
                            backgroundColor: isHoveredButtonExcluir ? "#B11236" : "#ED1846",
                        }}
                        onMouseEnter={() => setIsHoveredButtonExcluir(true)}
                        onMouseLeave={() => setIsHoveredButtonExcluir(false)}
                    >
                        Excluir
                    </button>
                    <button
                        style={{
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "5px",
                            color: "#fff",
                            width: "80px",
                            height: "40px",
                            padding: "0",
                            fontSize: "13px",
                            cursor: "pointer",
                            marginRight: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background-color 0.3s ease",
                            backgroundColor: isHoveredButtonCancelar ? "#5a6268" : "#6c757d",
                        }}
                        onMouseEnter={() => setIsHoveredButtonCancelar(true)}
                        onMouseLeave={() => setIsHoveredButtonCancelar(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        style={{
                            fontWeight: "bold",
                            border: "none",
                            color: "#fff",
                            borderRadius: "5px",
                            width: "80px",
                            height: "40px",
                            padding: "0",
                            fontSize: "13px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background-color 0.3s ease",
                            backgroundColor: isHoveredButtonCarregar ? "#00AAB5" : "#0A7F8E",
                        }}
                        onMouseEnter={() => setIsHoveredButtonCarregar(true)}
                        onMouseLeave={() => setIsHoveredButtonCarregar(false)}
                        onClick={() => {
                            handleTitlePdf(title);
                            handleImgPdf(image);
                            handleClose();
                        }
                        }
                    >
                        Carregar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalPersonalizar;
