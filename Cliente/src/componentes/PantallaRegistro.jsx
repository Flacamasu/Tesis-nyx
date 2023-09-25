import '../styles/PantallaRegistro.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';

function PantallaRegistro() {
  const { setUser } = useUser();
  const [empresas, setEmpresas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [logo, setLogo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [numero, setNumero] = useState('');
  
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
    try {
      // Crear un objeto con los datos del formulario
      const datosUsuario = {
        nombre,
        usuario, // Este es el valor del campo "Rut"
        contraseña,
        logo,
        descripcion,
        direccion,
        correo,
        numero,
      };
      
      const response = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
      });
      
      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }
      
    
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sesion-todo">
      <div className="sesion-contenedor">
        <p className='sesion-titulo'>Registrarse (Empresa)</p>
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="number"
            placeholder="Rut"
            className="form-usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <p className='form-usuario-abajo'>Rut (sin puntos ni guion)</p>
          <input
            type="text"
            placeholder="Nombre"
            className="form-usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <p className='form-usuario-abajo'>Nombre</p>
          <input
            type="number"
            placeholder="Número"
            className="form-usuario"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <p className='form-usuario-abajo'>Número de telefono</p>
          <input
            type="text"
            placeholder="logo"
            className="form-usuario"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />
          <p className='form-usuario-abajo'>Logo</p>
          <input
            type="text"
            placeholder="Descripcion"
            className="form-usuario"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <p className='form-usuario-abajo'>Descripción</p>
          <input
            type="text"
            placeholder="Dirección"
            className="form-usuario"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <p className='form-usuario-abajo'>Dirección</p>
          <input
            type="text"
            placeholder="Correo"
            className="form-usuario"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <p className='form-usuario-abajo'>Correo</p>
          <input
            type="password"
            placeholder="Contraseña"
            className="form-usuario"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
          <p className='form-usuario-abajo'>Contraseña</p>
          <div className='form-usuario-abajo-abajo'>
            <button type="submit" className="form-boton">
              Registrarse
            </button>
            <div className='form-usuario-abajo-cosas'>
              
              <p>¿Ya tienes una cuenta? <a href='/sesion'>Inicia sesión aquí</a></p>
            </div>
          </div>
        
        </form>
      </div>
    </div>
  );
}

export default PantallaRegistro;