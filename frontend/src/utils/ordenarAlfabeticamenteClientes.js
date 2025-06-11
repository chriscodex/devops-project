export function ordenarAlfabeticamenteClientes(array) {
  const combinedArray = array.map((obj) => {
    if (obj.dni) {
      obj = {
        ...obj,
        orden: obj.personaResponsable,
      };
      return obj;
    }
    if (obj.ruc) {
      obj = {
        ...obj,
        orden: obj.razonSocial,
      };
      return obj;
    }
  });
  

  const objetosOrdenados = combinedArray.slice().sort((a, b) => {
    const propiedadA = a.orden.toLowerCase();
    const propiedadB = b.orden.toLowerCase();

    return propiedadA.localeCompare(propiedadB);
  });

  objetosOrdenados.forEach((obj) => delete obj.orden);
  return objetosOrdenados;
}