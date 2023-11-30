import '../styles/PantallaSesion.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import swal from 'sweetalert';

function PantallaSesion() {
  const { setUser } = useUser();
  const [empresas, setEmpresas] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [isEmpresa, setIsEmpresa] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isEmpresa){
      const response = await fetch('http://localhost:5000/api/autenticarEmpresa', {
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
        localStorage.setItem('tUsuario', data.tUsuario);
        setUser(data.usuario);
        console.log("Data recibida:", data);
        swal("Bienvenido!", "Has iniciado sesión correctamente", "success")
        .then(() => {
          window.location.href = 'http://localhost:3000'; // Reemplaza con la URL a la que deseas redirigir al usuario
        });
      } else {
        console.log("Usuario invalido")
        swal("Error!", "Usuario o contraseña incorrectos", "error");
      }
    } else {
      const response = await fetch('http://localhost:5000/api/autenticarEstudiante', {
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
        localStorage.setItem('tUsuario', data.tUsuario);
        setUser(data.usuario);
        console.log("Data recibida:", data);
        swal("Bienvenido!", "Has iniciado sesión correctamente", "success")
          .then(() => {
            window.location.href = 'http://localhost:3000'; // Reemplaza con la URL a la que deseas redirigir al usuario
          });
      } else {
        console.log("Usuario invalido")
        swal("Error!", "Usuario o contraseña incorrectos", "error");
      }
    }
    // Aquí puedes hacer una solicitud HTTP para autenticar al usuario.
  

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
        <div className='sesion-elecciones'>
        <button onClick={handleEmpresaClick} className={selectedButton === 'empresa' ? 'boton-seleccionado boton-seleccion' : 'boton-no-seleccionado boton-seleccion'}>Empresa</button>
          <button onClick={handleEstudianteClick} className={selectedButton === 'estudiante' ? 'boton-seleccionado boton-seleccion' : 'boton-no-seleccionado boton-seleccion'}>Estudiante</button>
        </div>
        
        <p className='sesion-titulo1'>Iniciar Sesión</p>
        <img src={require(`../imagenes/nyxbich3.png`)} alt='' className='sesion-imagen1'></img>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Usuario"
            className="form-usuario"
            value={usuario}
            onChange={handleChange}
          />
          <p className='form-usuario-abajo'>RUT</p>
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
