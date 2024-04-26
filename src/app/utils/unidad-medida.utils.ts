
export const getAbrebiaturaUnidadMedida = (unidadMedida: string): string => {
  switch(unidadMedida.toLowerCase()) {
    case 'gramos':
      return 'g';
    case 'kilos':
    case 'kilogramos':
      return 'kg'
    case 'mililitros':
      return 'ml';
    case 'litros':
      return 'l';
    case 'unidad':
    case 'unidades':
      return 'u';
    default:
      return unidadMedida;
  }
}
