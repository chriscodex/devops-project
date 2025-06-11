export function formatearNombres(inputString) {
  // Dividir el string en palabras
  const palabras = inputString.toLowerCase().split(' ');

  // Capitalizar la primera letra de cada palabra
  const palabrasFormateadas = palabras.map(
    (palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1)
  );

  // Unir las palabras formateadas en un solo string
  const resultado = palabrasFormateadas.join(' ');

  return resultado;
}

export function formatDate(fecha) {
  const date = new Date(fecha);
  const year = date.toLocaleString('default', { year: 'numeric' });
  const month = date.toLocaleString('default', {
    month: '2-digit',
  });
  const day = date.toLocaleString('default', { day: '2-digit' });

  return [day, month, year].join('-');
}

export function obtenerPrimeraPalabra(frase) {
  // Dividir la frase en palabras
  var palabras = frase.split(' ');

  // Retornar la primera palabra
  return palabras[0];
}
