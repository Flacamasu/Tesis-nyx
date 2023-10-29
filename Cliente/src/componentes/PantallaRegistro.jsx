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
  const [carrera, setCarrera] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [genero, setGenero] = useState('');
  const [edad, setEdad] = useState('');
  const [intereses, setIntereses] = useState('');
  const [proyectos, setProyectos] = useState('');
  const [habilidades, setHabilidades] = useState('');
  const [conocimientos, setConocimientos] = useState('');
  const [estudios, setEstudios] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isEmpresa, setIsEmpresa] = useState(true);

  const handleEmpresaClick = () => {
    setIsEmpresa(true);
  };

  const handleEstudianteClick = () => {
    setIsEmpresa(false);
  };

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
      if(isEmpresa){
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
        
        const response = await fetch('http://localhost:5000/api/empresaRegistro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosUsuario),
        });
        
        if (!response.ok) {
          throw new Error('Error al registrar el usuario');
        }
      } else {
        const datosUsuario = {
          usuario,
          nombre,
          telefono,
          carrera,
          descripcion,
          direccion,
          correo,
          contraseña,
          especialidad,
          genero,
          edad,
          intereses,
          proyectos,
          habilidades,
          conocimientos,
          estudios
        };

        const response = await fetch('http://localhost:5000/api/estudianteRegistro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosUsuario),
        });
        
        if (!response.ok) {
          throw new Error('Error al registrar el usuario');
        }

      }
    
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sesion-todo">
      <div className="sesion-contenedor">
        <div className='sesion-eleccion'>
          <button onClick={handleEmpresaClick}>Empresa</button>
          <button onClick={handleEstudianteClick}>Estudiante</button>
        </div>
        <p className='sesion-titulo'>Registrarse {isEmpresa ? '(Empresa)' : '(Estudiante)'}</p>
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="number"
            placeholder="Rut"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Rut (sin puntos ni guion)</p>
          <input
            type="text"
            placeholder="Nombre"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Nombre</p>
          <input
            type="number"
            placeholder="Número"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Número de telefono</p>
          <input
            type="text"
            placeholder="logo"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Logo</p>
          <input
            type="text"
            placeholder="Descripcion"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Descripción</p>
          <input
            type="text"
            placeholder="Dirección"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Dirección</p>
          <input
            type="text"
            placeholder="Correo"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Correo</p>
          <input
            type="password"
            placeholder="Contraseña"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Contraseña</p>

          <input
            type="number"
            placeholder="Rut"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Rut (sin puntos ni guion)</p>
          <input
            type="text"
            placeholder="Nombre"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Nombre</p>
          <input
            type="number"
            placeholder="Número"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Número de telefono</p>
          <input
            type="text"
            placeholder="Carrera"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Carrera</p>
          <input
            type="text"
            placeholder="Descripcion"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Descripción</p>
          <input
            type="text"
            placeholder="Dirección"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Dirección</p>
          <input
            type="text"
            placeholder="Correo"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Correo</p>
          <input
            type="password"
            placeholder="Contraseña"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Contraseña</p>
          <input
            type="text"
            placeholder="Especialidad"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Especialidad</p>
          <input
            type="text"
            placeholder="Genero"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Genero</p>
          <input
            type="text"
            placeholder="Edad"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Edad</p>
          <input
            type="text"
            placeholder="Intereses"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={intereses}
            onChange={(e) => setIntereses(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Intereses</p>
          <input
            type="text"
            placeholder="Proyectos"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={proyectos}
            onChange={(e) => setProyectos(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Proyectos</p>
          <input
            type="text"
            placeholder="Habilidades"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={habilidades}
            onChange={(e) => setHabilidades(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Habilidades</p>
          <input
            type="text"
            placeholder="Conocimientos"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={conocimientos}
            onChange={(e) => setConocimientos(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Conocimientos</p>
          <input
            type="text"
            placeholder="Estudios"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={estudios}
            onChange={(e) => setEstudios(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Estudios</p>

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