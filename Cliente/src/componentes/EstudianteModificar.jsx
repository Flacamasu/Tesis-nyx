import '../styles/PantallaRegistro.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';

function EstudiantesMod() {
  const { user } = useUser();
  const { setUser } = useUser();
  const [genero, setGenero] = useState('');
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [carrera, setCarrera] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [edad, setEdad] = useState('');
  const [intereses, setIntereses] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [proyectos, setProyectos] = useState('');
  const [estudios, setEstudios] = useState('');
  const [conocimientos, setconocimientos] = useState('');
  const [calleNumero, setCalleNumero] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [habilidades, setHabilidades] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // Crear un objeto con los datos del formulario
      const datosUsuario = {
        id: user.id_estudiante,
        usuario,
        contraseña,
        correo,
        telefono,
        nombre,
        carrera,
        especialidad,
        descripcion,
        genero,
        edad,
        intereses,
        proyectos,
        habilidades,
        conocimientos,
        estudios,
        calleNumero,
        region,
        comuna
      };
      
      const response = await fetch('http://localhost:5000/api/estudiantes/modificar', {
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
            placeholder={user?.telefono}
            className="form-usuario"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <p className='form-usuario-abajo'>Número de telefono</p>
          <input
            type="text"
            placeholder={user?.correo}
            className="form-usuario"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <p className='form-usuario-abajo'>Correo</p>
          <input
            type="text"
            placeholder={user?.carrera}
            className="form-usuario"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
          />
          <p className='form-usuario-abajo'>Carrera</p>
          <input
            type="text"
            placeholder={user?.especialidad}
            className="form-usuario"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
          />
          <p className='form-usuario-abajo'>Especialidad</p>
          <textarea
            placeholder={user?.descripcion}
            className="form-usuario form-textarea"
            onChange={(e) => setDescripcion(e.target.value)}
            value={descripcion}
          />
          <p className='form-usuario-abajo'>Descripción</p>
          <input
            type="text"
            placeholder={user?.genero}
            className="form-usuario"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          />
          <p className='form-usuario-abajo'>Genero</p>
          <input
            type="number"
            placeholder={user?.edad}
            className="form-usuario"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
          />
          <p className='form-usuario-abajo'>Edad</p>
          <textarea
            placeholder={user?.intereses}
            className="form-usuario form-textarea"
            onChange={(e) => setIntereses(e.target.value)}
            value={intereses}
          />
          <p className='form-usuario-abajo'>Intereses</p>
          <textarea
            placeholder={user?.proyectos}
            className="form-usuario form-textarea"
            onChange={(e) => setProyectos(e.target.value)}
            value={proyectos}
          />
          <p className='form-usuario-abajo'>Proyectos</p>
          <textarea
            placeholder={user?.habilidades}
            className="form-usuario form-textarea"
            onChange={(e) => setHabilidades(e.target.value)}
            value={habilidades}
          />
          <p className='form-usuario-abajo'>Habilidades</p>
          <textarea
            placeholder={user?.conocimientos}
            className="form-usuario form-textarea"
            onChange={(e) => setconocimientos(e.target.value)}
            value={conocimientos}
          />
          <p className='form-usuario-abajo'>Conocimientos</p>
          <input
            type="text"
            placeholder={user?.estudios}
            className="form-usuario"
            value={estudios}
            onChange={(e) => setEstudios(e.target.value)}
          />
          <p className='form-usuario-abajo'>Estudios</p>
          <input
            type="text"
            placeholder={user?.calle_numero}
            className="form-usuario"
            value={calleNumero}
            onChange={(e) => setCalleNumero(e.target.value)}
          />
          <p className='form-usuario-abajo'>Calle y número</p>
          <input
            type="text"
            placeholder={user?.region}
            className="form-usuario"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
          <p className='form-usuario-abajo'>Región</p>
          <input
            type="text"
            placeholder={user?.comuna}
            className="form-usuario"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
          />
          <p className='form-usuario-abajo'>Comuna</p>

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

export default EstudiantesMod;