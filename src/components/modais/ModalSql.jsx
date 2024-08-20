import React from "react";

function ModalSql({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="w-full h-full  absolute top-0 flex flex-col justify-center items-center ">
            <div className="w-1/3 h-2/4 bg-white border-2 border-black z-20 transition-opacity duration-300 ease-in-out opacity-0 animate-fadeIn">
                <div className="w-full bg-neutral-500 flex flex-row justify-between text-white p-2">
                    <h5 className="font-bold mx-2">SQL</h5>
                    <button className="font-bold mx-2 " onClick={onClose}>X</button>
                </div>
                <div className="w-full h-full flex flex-row justify-center items-start mt-2">
                    <div className="w-11/12 h-5/6 bg-neutral-300">
                        <h5 className="m-6">Select * FROM Clientes</h5>
                   </div>
                </div>
            </div>
            <div className="w-full h-full bg-black absolute top-0 z-10 opacity-70">

            </div>
        </div>
    )
}

export default ModalSql;