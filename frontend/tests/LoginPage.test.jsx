import { render, screen } from '@testing-library/react';
import LoginPage from '../src/pages/LoginPage';
import { AuthProvider } from '../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('LoginPage', () => {
  it('muestra el texto "Iniciar Sesión"', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
  });
});
