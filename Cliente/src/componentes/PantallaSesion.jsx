import '../styles/PantallaSesion.css';
import React, { useState, useEffect } from 'react';

function PantallaSesion() {
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
      console.log("Usuario valido")
    } else {
      console.log("Usuario invalido")
    }
  };

  return (
    <div className="sesion-todo">
      <div className="sesion-contenedor">
        <p className='sesion-titulo'>Iniciar Sesión</p>
        <img src={require(`../imagenes/usuariogen.png`)} alt='' className='sesion-imagen'></img>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
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
          <button type="submit" className="form-boton">
            Aceptar
          </button>
          <p>¿Olvidaste tu contraseña?</p>
          <p>¿No tienes una cuenta? <span>Registrate Aquí</span></p>
        </form>
      </div>
    </div>
  );
}

export default PantallaSesion;
