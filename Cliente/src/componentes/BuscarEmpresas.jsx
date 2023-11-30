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
  const empresa = params.get('empresa');
  const ordenar = params.get('ordenar');


  
  const [inputEmpresa, setInputEmpresa] = useState(empresa);
  const navigate = useNavigate();

  const [ordenSeleccionado, setOrdenSeleccionado] = useState(ordenar);

  const handleOrdenChange = (e) => {
    setOrdenSeleccionado(e.target.value);
  };

  const [ofertas, setOfertas] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);




  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);

  const fecha = new Date(ofertaSeleccionada?.fecha);
  const dia = fecha.getDate();
  const mes = fecha.getMonth();
  const ano = fecha.getFullYear();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const nombreMes = meses[mes];
  const fechaFormateada = `Publicado el ${dia} de ${nombreMes} de ${ano}`;

  const [empresas, setEmpresas] = useState([]);



  const [puntuacionEmpresa, setPuntuacionEmpresa] = useState(0);
  const [nombreEmpresa, setNombreEmpresa] = useState('');

  useEffect(() => {
    if (ofertaSeleccionada) {
      const empresaEncontrada = empresas.find(
        (empresa) => empresa.id_empresa === ofertaSeleccionada.id_empresa
      );
      if (empresaEncontrada) {
        setPuntuacionEmpresa(empresaEncontrada.puntuacion_total);
        setNombreEmpresa(empresaEncontrada.nombre);
      }
    }
  }, [ofertaSeleccionada, empresas]);

  const getPuntuacionEmpresa = (id_empresa) => {
    const empresaEncontrada = empresas.find(
      (empresa) => empresa.id_empresa === id_empresa
    );
  
    return empresaEncontrada ? empresaEncontrada.puntuacion_total : 0;
  };
  
  const getNombreEmpresa = (id_empresa) => {
    const empresaEncontrada = empresas.find(
      (empresa) => empresa.id_empresa === id_empresa
    );
    return empresaEncontrada ? empresaEncontrada.nombre : 0;
  };
  
  


  const handleInputChange = (e) => {
    setInputEmpresa(e.target.value);
  }

  function handleClick(e) {
    e.preventDefault();
    let url = '/buscar/empresas?';
    const params = [];

    params.push(`empresa=${inputEmpresa}`);
    params.push(`ordenar=${ordenSeleccionado}`);
  
    url += params.join('&');
  
    navigate(url);
    window.location.reload();
  }

  function redirigir(e, id_empresa) {
    e.preventDefault();
    let url = '/empresas?';
    const params = [];
    params.push(`id=${id_empresa}`);
    url += params.join('&');
    navigate(url);
    window.location.reload();
  }
 

  
  const tUsuario = localStorage.getItem('tUsuario');
  
 
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        let url = `http://localhost:5000/api/buscarEmpresas?empresa=${empresa}`;
        if (ordenar) {
          url += `&ordenar=${ordenar}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error al realizar la búsqueda');
        }
        const empresas = await response.json();
        setEmpresas(empresas);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchDepartamentos();
  }, [empresa, ordenar]);
  
  return(
    <div className='buscar-todo buscar-empresa-todo'>
        <div className='buscar-cuadro buscar-empresa-cuadro'>


            <div className='buscar-resultados'>
              <div className='buscar-resultados-barra'>
                <input 
                  className='buscar-resultados-barra-inputBusqueda' 
                  type="text" 
                  placeholder='Busca el nombre o palabras clave de la empresa aquí:'
                  value={inputEmpresa}
                  onChange={handleInputChange}
                />
                <select
                    className='buscar-resultados-barra-orden'
                    value={ordenSeleccionado}
                    onChange={handleOrdenChange}
                  >
                    <option value="">Ordenar por</option>
                    <option value="popularidad">Por popularidad</option>
                    <option value="valoracion">Por valoración</option>
                    <option value="ofertas">Cantidad ofertas</option>
                  </select>
                <button className='buscar-resultados-barra-enviar' onClick={handleClick}>Buscar<AiOutlineSearch size={40}/></button>
              </div>
              <div className='buscar-resultados-contenido'>
              
                {empresas.map((empresa) => (
                  <div key={empresa.id_empresa} 
                      className={`buscar-resultados-contenido-cuadro`}
                      onClick={(e) => redirigir(e, empresa.id_empresa)}
                  >
                    
                    <div className='buscar-resultados-contenido-cuadro-titulo'>
                    
                      <h1>{empresa.nombre}</h1>
                      <h1>{[...Array(5)].map((star, i) => {
                              return (
                                <AiFillStar 
                                  key={i} 
                                  size={40} 
                                  
                                  color={i < empresa.puntuacion_total ? "#024e69" : "grey"} 
                                />
                              )
                            })}</h1>
                    </div>
                    <p className='buscar-resultados-contenido-cuadro-descripcion'>
                      {empresa.descripcion}
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