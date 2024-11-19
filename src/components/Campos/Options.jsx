export const ordenacaoOptions = [
    { value: 'ASC', label: 'ASC' },
    { value: 'DESC', label: 'DESC' },
  ];
  
  export const TotalizerOptions = [
    { value: 'COUNT', label: 'CONTAGEM' },
    { value: 'SUM', label: 'SOMA' },
    { value: 'AVG', label: 'MÉDIA' },
    { value: 'MIN', label: 'MÍNIMO' },
    { value: 'MAX', label: 'MÁXIMO' },
  ];
  
  export const getFilteredTotalizerOptions = (type) => {
    switch (type) {
      case 'NUMBER':
      case 'FLOAT':
      case 'DOUBLE':
      case 'BINARY_FLOAT':
      case 'BINARY_DOUBLE':
        return TotalizerOptions;
      case 'DATE':
      case 'VARCHAR2':
      case 'CLOB':
      case 'CHAR':
        return TotalizerOptions.filter(option => option.value === 'COUNT');
      default:
        return [];
    }
  };
  