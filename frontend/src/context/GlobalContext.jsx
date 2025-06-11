import { createContext, useContext, useEffect, useState } from 'react';

const GlobalAppContext = createContext();

export const useGlobalApp = () => {
  const context = useContext(GlobalAppContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const GlobalAppProvider = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <GlobalAppContext.Provider
      value={{ menuOpen, setMenuOpen }}
    >
      {children}
    </GlobalAppContext.Provider>
  );
};