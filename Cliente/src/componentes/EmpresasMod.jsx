import '../styles/PantallaRegistro.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';

function EmpresasMod() {
  const { user } = useUser();
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
        id: user.id_empresa,
        nombre,
        usuario, // Este es el valor del campo "Rut"
        contraseña,
        logo,
        descripcion,
        direccion,
        correo,
        numero,
      };
      
      const response = await fetch('http://localhost:5000/api/usuarios/modificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
      });
      
      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }
      const data = await response.json();
      const usuarioActualizado = data.usuario;

      // Actualizar el localStorage con los datos actualizados
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sesion-todo">
      <div className="sesion-contenedor">
        <p className='sesion-titulo'>Modificar perfil ({user?.nombre})</p>
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="number"
            placeholder={user?.usuario}
            className="form-usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <p className='form-usuario-abajo'>Rut (sin puntos ni guion)</p>
          <input
            type="text"
            placeholder={user?.nombre}
            className="form-usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <p className='form-usuario-abajo'>Nombre</p>
          <input
            type="number"
            placeholder={user?.numero}
            className="form-usuario"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <p className='form-usuario-abajo'>Número de telefono</p>
          <input
            type="text"
            placeholder={user?.descripcion}
            className="form-usuario"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <p className='form-usuario-abajo'>Descripción</p>
          <input
            type="text"
            placeholder={user?.direccion}
            className="form-usuario"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <p className='form-usuario-abajo'>Dirección</p>
          <input
            type="text"
            placeholder={user?.correo}
            className="form-usuario"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <p className='form-usuario-abajo'>Correo</p>
          
          <div className='form-usuario-abajo-abajo'>
            <button type="submit" className="form-boton">
              Confirmar
            </button>
            <div className='form-usuario-abajo-cosas'>
              
            </div>
          </div>
        
        </form>
      </div>
    </div>
  );
}

export default EmpresasMod;