import '../styles/PantallaSesion.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';

function PantallaSesion() {
  const { setUser } = useUser();
  const [empresas, setEmpresas] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/empresas')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        return response.json();
      })
      .then((empresas) => {
        setEmpresas(empresas);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
      
    // Aquí puedes hacer una solicitud HTTP para autenticar al usuario.
    const response = await fetch('http://localhost:5000/api/autenticar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, contraseña }),
    });

    const data = await response.json();
  

    if (data.autenticado) {
      console.log("Usuario valido");
      setUser(data.usuario);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      setUser(data.usuario);
      console.log("Data recibida:", data);
    } else {
      console.log("Usuario invalido")
    }
  };

  return (
    <div className="sesion-todo">
      <div className="sesion-contenedor">
        <p className='sesion-titulo1'>Iniciar Sesión</p>
        <img src={require(`../imagenes/nyxbich3.png`)} alt='' className='sesion-imagen1'></img>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="number"
            placeholder="Usuario"
            className="form-usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <p className='form-usuario-abajo'>Correo electronico</p>
          <input
            type="password"
            placeholder="Contraseña"
            className="form-usuario"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
          <p className='form-usuario-abajo'>Contraseña</p>
          <div className='form-usuario-abajo-abajo'>
            <button type="submit" className="form-boton1">
              Aceptar
            </button>
            <div className='form-usuario-abajo-cosas'>
              <p>¿Olvidaste tu contraseña?</p>
              <p>¿No tienes una cuenta? <a href='/sesion/registro'>Registrate Aquí</a></p>
            </div>
          </div>
        
        </form>
      </div>
    </div>
  );
}

export default PantallaSesion;
