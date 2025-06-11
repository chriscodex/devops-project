function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl text-red-600 font-bold mb-4">404</h1>
        <p className="text-lg text-gray-700">Página no encontrada</p>
        <p className="text-gray-500">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        <a href="/" className="mt-4 text-blue-500 hover:underline">
          Regresar a la página de inicio
        </a>
      </div>
    </div>
  );
}

export { NotFoundPage };
