let exportedSelectedCampos = [];
let totalizers = {};

export const removeSelectedTotalizers = (camposParaRemover) => {
  camposParaRemover.forEach((campo) => {
    delete totalizers[campo];
  });
};

export const resetTotalizers = () => {
  totalizers = {};
};

export const getTotalizers = () => {
  return totalizers;
};

export const getSelectedCampos = () => {
  return exportedSelectedCampos;
};

export const setExportedSelectedCampos = (campos) => {
  exportedSelectedCampos = campos;
};

export const setTotalizers = (newTotalizers) => {
  totalizers = newTotalizers;
};
