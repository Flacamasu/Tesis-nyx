import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioAlmacenado = localStorage.getItem('usuario');
    const tipoUsuario = localStorage.getItem('usuario');
    
    if (token && usuarioAlmacenado) {
      const usuario = JSON.parse(usuarioAlmacenado);
      setUser(usuario);
    }
  }, []);
  const value = {
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};