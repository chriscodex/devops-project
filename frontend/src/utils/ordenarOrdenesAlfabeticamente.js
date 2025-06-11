export function ordenarAlfabeticamente(array) {
  const combinedArray = array.map((obj) => {
    if (obj.cliente.dni) {
      obj = {
        ...obj,
        orden: obj.cliente.personaResponsable,
      };
      return obj;
    }
    if (obj.cliente.ruc) {
      obj = {
        ...obj,
        orden: obj.cliente.razonSocial,
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