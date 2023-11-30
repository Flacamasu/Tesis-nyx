import '../styles/BuscarPractica.css'
import '../styles/BuscarEmpresas.css'
import { useLocation } from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import {Button, Modal,ModalBody} from 'reactstrap';
import { AiFillStar,AiFillCloseSquare,AiOutlineSearch } from 'react-icons/ai';

import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function BuscarPractica() {

  const { user } = useUser();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const estudiante = params.get('estudiante');



  
  const [inputEstudiante, setInputEstudiante] = useState(estudiante);
  const navigate = useNavigate();

  const [estudiantes, setEstudiantes] = useState([]);


  const handleInputChange = (e) => {
    setInputEstudiante(e.target.value);
  }

  function handleClick(e) {
    e.preventDefault();
    let url = '/buscar/estudiantes?';
    const params = [];

    params.push(`estudiante=${inputEstudiante}`);

  
    url += params.join('&');
  
    navigate(url);
    window.location.reload();
  }

  function redirigir(e, id_estudiante) {
    e.preventDefault();
    let url = '/estudiantes?';
    const params = [];
    params.push(`id=${id_estudiante}`);
    url += params.join('&');
    navigate(url);
    window.location.reload();
  }
 
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        let url = `http://localhost:5000/api/buscarEstudiantes?estudiante=${estudiante}`;
        console.log(estudiante);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error al realizar la búsqueda');
        }
        const estudiantes = await response.json();
        setEstudiantes(estudiantes);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchEstudiantes();
  }, [estudiante]);
  
  return(
    <div className='buscar-todo buscar-empresa-todo'>
        <div className='buscar-cuadro buscar-empresa-cuadro'>


            <div className='buscar-resultados'>
              <div className='buscar-resultados-barra'>
                <input 
                  className='buscar-resultados-barra-inputBusqueda' 
                  type="text" 
                  placeholder='Busca el nombre o palabras clave de la empresa aquí:'
                  value={inputEstudiante}
                  onChange={handleInputChange}
                />
     
                <button className='buscar-resultados-barra-enviar' onClick={handleClick}>Buscar<AiOutlineSearch size={40}/></button>
              </div>
              <div className='buscar-resultados-contenido'>
              
                {estudiantes.map((estudiante) => (
                  <div key={estudiante.id_estudiante} 
                      className={`buscar-resultados-contenido-cuadro`}
                      onClick={(e) => redirigir(e, estudiante.id_estudiante)}
                  >
                    
                    <div className='buscar-resultados-contenido-cuadro-titulo'>
                    
                      <h1>{estudiante.nombre} <span className='guion-nombre'>|</span> <span className='despues-nombre'>{estudiante.carrera}</span></h1>
   
                    </div>
                    <p className='buscar-resultados-contenido-cuadro-descripcion'>
                      {estudiante.descripcion}
                    </p>

                  </div>
                ))}

               
            </div>
          </div>
        </div>
    </div>
  );
}

export default BuscarPractica;