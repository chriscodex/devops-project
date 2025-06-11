import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotFoundPage } from '../src/pages/NotFoundPage/NotFoundPage.jsx';
import '@testing-library/jest-dom';

describe('NotFoundPage', () => {
  test('debería renderizar el código 404', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  test('debería mostrar el mensaje de página no encontrada', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
    expect(screen.getByText(/la página que estás buscando no existe/i)).toBeInTheDocument();
  });

  test('debería tener un enlace para regresar a la página de inicio', () => {
    render(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /regresar a la página de inicio/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
