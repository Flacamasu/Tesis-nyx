import '../styles/PerfilEstudiante.css'
import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
function PerfilEstudiante() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idEstudiante = Number(queryParams.get('id'));
  const [estudiantes, setEstudiantes] = useState([]);
  const [distancia, setDistancia] = useState(null);
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    // Carga la API de Google Maps si aún no está cargada
    if (!window.google) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCtD52oDPKnKhLFx-SZApvdIgDIerAiwYE`;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', () => {
            setIsGoogleApiLoaded(true); // Establece a true una vez cargada
        });
        document.body.appendChild(script);
    } else {
        setIsGoogleApiLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/estudiantes')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        return response.json();
      })
      .then((estudiantes) => {
        setEstudiantes(estudiantes);
      })
      .catch((error) => console.log(error));
  }, []); 
  const getEstudiantePorId = (id) => {
    const estudiante = estudiantes.find((empresa) => empresa.id_estudiante === id);
    return estudiante;
  };
  const estudiante = getEstudiantePorId(idEstudiante);

  const calcularDistancia = async (origen, destino) => {
    const service = new window.google.maps.DistanceMatrixService();
    
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [origen],
          destinations: [destino],
          travelMode: 'DRIVING'
        },
        (response, status) => {
          if (status !== "OK") {
            reject("Error con el servicio de Google Maps");
            return;
          }

          const distancia = response.rows[0].elements[0].distance.text;
          resolve(distancia);
        }
      );
    });
  };
  const mostrarDistancia = async () => {
    const direccionUsuario = "lo cruzat 0106"; // La dirección que el usuario ingresó
    const otraDireccion = "lo cruzat 190"; // Otra dirección en base de datos
    try {
      const resultado = await calcularDistancia(direccionUsuario, otraDireccion);
      setDistancia(resultado);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // Llama a mostrarDistancia si la API de Google Maps está cargada
    if (isGoogleApiLoaded) {
        mostrarDistancia();
    }
  }, [isGoogleApiLoaded]);
  return(
    <div className='estudiante-todo'>
      <div className='estudiante-perfil1'>
        <div className='estudiante-perfil1-datos'>
          <div className='estudiante-perfil-datos-letra'>
            <p className='estudiante-perfil-datos-letra-nombre'>{estudiante?.nombre}</p>
            
            <p className='estudiante-perfil-datos-letra-carrera'>{estudiante?.carrera}</p>
            <div className='estudiante-perfil-datos-letra-linea'></div>
            <p className='estudiante-perfil-datos-letra-mail'>{estudiante?.correo}</p>
            <div className='estudiante-perfil-datos-letra-linea'></div>
            <p className='estudiante-perfil-datos-letra-numero'>{estudiante?.telefono}</p>
           
          </div>
          <div className='estudiante-perfil-datos-imagen'>
            <img src="" alt="" />
            <p>Rut: {estudiante?.usuario}</p>
          </div>
        </div>
        <div className='estudiante-perfil1-descripcion'>
          <p className='estudiante-perfil1-descripcion-titulo'>Descripción:</p>
            <p className='estudiante-perfil1-descripcion-subtitulo'>{estudiante?.descripcion}
            </p>
          <p className='estudiante-perfil1-descripcion-titulo'>Info: </p>
            <p className='estudiante-perfil1-descripcion-subtitulo'>Genero: {estudiante?.genero}</p>
            <p className='estudiante-perfil1-descripcion-subtitulo'>Edad: {estudiante?.edad}</p>
            <p className='estudiante-perfil1-descripcion-subtitulo'>Ciudad: {estudiante?.direccion}</p>
          <p className='estudiante-perfil1-descripcion-titulo'>Interes:</p>
            <p className='estudiante-perfil1-descripcion-subtitulo'>{estudiante?.intereses}</p>
        </div>
      </div>
      <div>
        <p className='estudiante-perfil1-descripcion-titulo'>Proyectos: </p>
          <p className='estudiante-perfil1-descripcion-subtitulo'>{estudiante?.proyectos}</p>
        <p className='estudiante-perfil1-descripcion-titulo'>Habilidades: </p>
          <p className='estudiante-perfil1-descripcion-subtitulo'>{estudiante?.habilidades}</p>
        <p className='estudiante-perfil1-descripcion-titulo'>Conocimientos: </p>
          <p className='estudiante-perfil1-descripcion-subtitulo'>{estudiante?.conocimientos}</p>
        <p className='estudiante-perfil1-descripcion-titulo'>Estudios: </p>
          <p className='estudiante-perfil1-descripcion-subtitulo'>{estudiante?.estudios}</p>

      </div>
    </div>
   
  );
}

export default PerfilEstudiante;