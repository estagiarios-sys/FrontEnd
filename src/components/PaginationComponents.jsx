import React from "react";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

function Pagination({ currentPage, totalPages, changePage }) {
  return (
    <div className="flex justify-center mt-4 mb-4 items-center">
      <button
        onClick={() => changePage("first")}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-2 bg-custom-azul hover:bg-custom-azul-escuro focus:ring-custom-azul text-white rounded"
        title="Ir para a primeira página"
      >
        <FaAngleDoubleLeft />
      </button>
      <button
        onClick={() => changePage("prev")}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-2 bg-custom-azul hover:bg-custom-azul-escuro focus:ring-custom-azul text-white rounded"
        title="Ir para a página anterior"
      >
        <FaAngleLeft />
      </button>
      <span className="flex items-center mx-2">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => changePage("next")}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-2 bg-custom-azul hover:bg-custom-azul-escuro focus:ring-custom-azul text-white rounded"
        title="Ir para a página seguinte"
      >
        <FaAngleRight />
      </button>
      <button
        onClick={() => changePage("last")}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-2 bg-custom-azul hover:bg-custom-azul-escuro focus:ring-custom-azul text-white rounded"
        title="Ir para a última página"
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  );
}

export default Pagination;
