import '../styles/PantallaRegistro.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import swal from 'sweetalert';
import validator from "validator";

function PantallaRegistro() {
  const { setUser } = useUser();
  const [empresas, setEmpresas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [logo, setLogo] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [calle_numero, setCalleNumero] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [imagen, setImagen] = useState('');
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
  const [selectedButton, setSelectedButton] = useState('empresa');

  const handleEmpresaClick = () => {
    setIsEmpresa(true);
    setSelectedButton('empresa');
  };

  const handleEstudianteClick = () => {
    setIsEmpresa(false);
    setSelectedButton('estudiante');
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

  const validarEmail = (email) => {
    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i; // Expresión regular básica
    return re.test(email.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
    const formData = new FormData();
    if (isEmpresa) {

    
        if (!validator.isEmail(correo)) {
          swal({
            title: "¡Error al registrar!",
            text: "El correo ingresado no es válido",
            icon: "error",
            buttons: {
              confirm: {
                text: "Aceptar",
                value: true,
                visible: true,
                className: "btn-aceptar",
                closeModal: true
              }
            },
            className: "swal-custom-bg"
          });
          return;
        }
   
      formData.append('nombre', nombre);
      formData.append('usuario', usuario);
      formData.append('contrasena', contrasena);
      formData.append('logo', logo);  // Archivo añadido aquí
      formData.append('descripcion', descripcion);
      formData.append('correo', correo);
      formData.append('numero', numero);
      formData.append('calle_numero', calle_numero);
      formData.append('region', region);
      formData.append('comuna', comuna);
      const response = await fetch('http://localhost:5000/api/empresaRegistro', {
        method: 'POST',
        body: formData,  // Modificado aquí
      });
        
        if (!response.ok) {
          throw new Error('Error al registrar el usuario');
        }
        swal({
          title: "¡Te has registrado con exito!",
          text: "El correo ingresado no es válido",
          icon: "success",
          buttons: {
            confirm: {
              text: "Aceptar",
              value: true,
              visible: true,
              className: "btn-aceptar",
              closeModal: true
            }
          },
          className: "swal-custom-bg"
        })
        .then(() => {
          window.location.href = 'http://localhost:3000/sesion'; // Reemplaza con la URL a la que deseas redirigir al usuario
        });
      } else {
        if (!validator.isEmail(correo)) {
          swal({
            title: "¡Error al registrar!",
            text: "El correo ingresado no es válido",
            icon: "error",
            buttons: {
              confirm: {
                text: "Aceptar",
                value: true,
                visible: true,
                className: "btn-aceptar",
                closeModal: true
              }
            },
            className: "swal-custom-bg"
          });
          return;
        }
        const formData2 = new FormData();
        
          formData2.append('usuario', usuario);
          formData2.append('nombre', nombre);
          formData2.append('telefono', telefono);
          formData2.append('imagen', imagen);  // Asumiendo que 'imagen' es un archivo
          formData2.append('carrera', carrera);
          formData2.append('descripcion', descripcion);
          formData2.append('correo', correo);
          formData2.append('contrasena', contrasena);
          formData2.append('especialidad', especialidad);
          formData2.append('genero', genero);
          formData2.append('edad', edad);
          formData2.append('intereses', intereses);
          formData2.append('proyectos', proyectos);
          formData2.append('habilidades', habilidades);
          formData2.append('conocimientos', conocimientos);
          formData2.append('estudios', estudios);
          formData2.append('calle_numero', calle_numero);
          formData2.append('region', region);
          formData2.append('comuna', comuna);
          
          const response = await fetch('http://localhost:5000/api/estudianteRegistro', {
            method: 'POST',
            body: formData2,  // Modificado aquí
          });
        if (!response.ok) {
          throw new Error('Error al registrar el usuario');
        }
        
        swal({
          title: "¡Te has registrado con exito!",
          icon: "success",
          buttons: {
            confirm: {
              text: "Aceptar",
              value: true,
              visible: true,
              className: "btn-aceptar",
              closeModal: true
            }
          },
          className: "swal-custom-bg"
        })
        .then(() => {
          window.location.href = 'http://localhost:3000/sesion'; // Reemplaza con la URL a la que deseas redirigir al usuario
        });
        }
      
    } catch (error) {
      console.error(error);
    }
  };

  function formatUsuario(value) {
    // Verificar si el último carácter es una 'k' o 'K'
    let endsWithK = value.toLowerCase().endsWith('k');

    // Si el valor termina con 'k' o 'K', eliminar este carácter
    let cleanedValue = endsWithK ? value.slice(0, -1) : value;

    // Limpiar el valor de entrada de cualquier caracter no numérico
 
    cleanedValue = cleanedValue.replace(/\D+/g, '');
    
    if (endsWithK){
      cleanedValue = cleanedValue+'K'
    } 

    // Si la longitud del valor limpio es 1 o 2, simplemente devolver el valor limpio
    if (cleanedValue.length <= 2) {
      return cleanedValue + (endsWithK ? '-K' : '');
    }

    // Separar el último dígito para el guion
    let lastDigit = cleanedValue.slice(-1);
    let restOfDigits = cleanedValue.slice(0, -1);

    // Formatear el resto de los dígitos con puntos
    let formattedRest = restOfDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Combinar el formato
    let formattedValue = `${formattedRest}-${lastDigit}`;

    return formattedValue;
  }

  const handleChange = (event) => {
    let inputValue = event.target.value;
    setUsuario(formatUsuario(inputValue));
  };
  return (
    
    <div className="sesion-todo">
      <div className="sesion-contenedor">
        <div className='sesion-eleccion'>
          <button onClick={handleEmpresaClick} className={selectedButton === 'empresa' ? 'boton-seleccionado boton-seleccion' : 'boton-no-seleccionado boton-seleccion'}>Empresa</button>
          <button onClick={handleEstudianteClick} className={selectedButton === 'estudiante' ? 'boton-seleccionado boton-seleccion' : 'boton-no-seleccionado boton-seleccion'}>Estudiante</button>
        </div>
        <p className='sesion-titulo'>Registrarse {isEmpresa ? '(Empresa)' : '(Estudiante)'}</p>
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Rut"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={usuario}
            onChange={handleChange}
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
            type="file"
            accept="image/*" 
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            onChange={(e) => setLogo(e.target.files[0])} 
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Logo</p>
          <textarea
            placeholder="Descripción"
            
            className= {`form-usuario form-textarea form-textarea-empresa ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            onChange={(e) => setDescripcion(e.target.value)}
            value={descripcion}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Descripción</p>

          <input
            type="email"
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
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Contraseña</p>
          <input
            type="text"
            placeholder="Calle y número"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={calle_numero}
            onChange={(e) => setCalleNumero(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Calle y número</p>
          <input
            type="text"
            placeholder="Región"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Región</p>
          <input
            type="text"
            placeholder="Comuna"
            className={`form-usuario ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? '' : 'form-usuario--desaparecer'}`}>Comuna</p>

          <input
            type="text"
            placeholder="Rut"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={usuario}
            onChange={handleChange}
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
            type="file"
            accept="image/*" 
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            onChange={(e) => setImagen(e.target.files[0])} 
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Foto perfil</p>
          <input
            type="text"
            placeholder="Carrera"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Carrera</p>
          <textarea
            placeholder="Descripción"
            
            className= {`form-usuario form-textarea form-textarea-empresa ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            onChange={(e) => setDescripcion(e.target.value)}
            value={descripcion}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Descripción</p>

          <input
            type="email"
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
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
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
          <textarea
            placeholder="Intereses"
            
            className= {`form-usuario form-textarea form-textarea-empresa ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            onChange={(e) => setIntereses(e.target.value)}
            value={intereses}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Intereses</p>
          <textarea
            placeholder="Proyectos"
            
            className= {`form-usuario form-textarea form-textarea-empresa ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            onChange={(e) => setProyectos(e.target.value)}
            value={proyectos}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Proyectos</p>
          <textarea
            placeholder="Habilidades"
            
            className= {`form-usuario form-textarea form-textarea-empresa ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            onChange={(e) => setHabilidades(e.target.value)}
            value={habilidades}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Habilidades</p>
          <textarea
            placeholder="Conocimientos"
            
            className= {`form-usuario form-textarea form-textarea-empresa ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            onChange={(e) => setConocimientos(e.target.value)}
            value={conocimientos}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Conocimientos</p>
          <input
            type="text"
            placeholder="¿Donde estudiaste o estudias?"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={estudios}
            onChange={(e) => setEstudios(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Estudios</p>
          <input
            type="text"
            placeholder="Calle y número"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={calle_numero}
            onChange={(e) => setCalleNumero(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Calle y número</p>
          <input
            type="text"
            placeholder="Región"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Región</p>
          <input
            type="text"
            placeholder="Comuna"
            className={`form-usuario ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
          />
          <p className={`form-usuario-abajo ${isEmpresa ? 'form-usuario--desaparecer' : ''}`}>Comuna</p>
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