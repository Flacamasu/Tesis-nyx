import '../styles/Postulaciones.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { AiFillStar,AiFillLock,AiFillUnlock,AiFillCloseSquare,AiOutlineSearch, AiFillHeart } from 'react-icons/ai';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import { FaHeart } from "react-icons/fa";
import { BsShareFill, BsThreeDots } from "react-icons/bs";

function Postulaciones() {
  const { user } = useUser();
  const [empresas, setEmpresas] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [postulacionSeleccionada, setPostulacionSeleccionada] = useState(null);
  const [puntuacionEmpresa, setPuntuacionEmpresa] = useState(0);
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [abierto, setAbierto] = useState(false);
  const yaPostulo = postulaciones.some(p => p.id_oferta === postulacionSeleccionada?.id_oferta);
  const [rating, setRating] = useState(0); 
  const cambioEstrellas = (i) => {
    setRating(i + 1);
  };
  const fecha = new Date(postulacionSeleccionada?.fecha);
  const dia = fecha.getDate();
  const mes = fecha.getMonth();
  const ano = fecha.getFullYear();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const nombreMes = meses[mes];
  const fechaFormateada = `Publicado el ${dia} de ${nombreMes} de ${ano}`;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datosEstudiante = { 
          id_estudiante: user.id_estudiante
        };
        console.log(datosEstudiante);
        // Haciendo petición POST
        const response = await fetch('http://localhost:5000/api/postulacion/estudiante', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosEstudiante),
        });
  
        if (!response.ok) {
          throw new Error("Error al hacer la petición POST");
        }
  
        const postulacionesResultantes = await response.json();
        console.log(postulacionesResultantes);
        setPostulaciones(postulacionesResultantes);
        console.log(postulaciones[0].id_estudiante);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [user]);

  useEffect(() => {
    fetch('http://localhost:5000/api/ofertas')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        return response.json();
      })
      .then((ofertas) => {
        setOfertas(ofertas);
      })
      .catch((error) => console.log(error));
  }, []);


  useEffect(() => {
    if (postulacionSeleccionada) {
      const empresaEncontrada = empresas.find(
        (empresa) => empresa.id_empresa === postulacionSeleccionada.id_empresa
      );
      if (empresaEncontrada) {
        setPuntuacionEmpresa(empresaEncontrada.puntuacion_total);
        setNombreEmpresa(empresaEncontrada.nombre);
      }
    }
  }, [postulacionSeleccionada, empresas]);

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
  const clickOferta = (postulacion) => {
    setAbierto(!abierto);
    if(abierto === false) setPostulacionSeleccionada(postulacion);
  }
  return (
    <div className="postulaciones-todo">
      <p className='postulaciones-titulo'>Postulaciones: </p>
      <div className="postulaciones-ofertas">
        {postulaciones.map(postulacionActual => (
          ofertas
            .filter(oferta => oferta.id_oferta === postulacionActual.id_oferta)
            .map((postulacionFiltrada, i) => (
              <p 
                className='empresa-ofertas-departamento-oferta' 
                key={i} 
                onClick={() => clickOferta(postulacionFiltrada)}
              >
                {postulacionFiltrada.titulo}
              </p>
            ))
        ))}
      </div>
      <Modal isOpen={abierto} className='modal-practicas'>
        <div className='modal-volver'>
          <Button onClick={clickOferta}>Volver</Button>
          <img src={require(`../imagenes/nyxbich2.png`)} alt='' className='img-bichnx'></img>
        </div>
        <ModalBody>
          <div className='modal-contenido'>
            <div className='modal-titulo'>
              <h1>{postulacionSeleccionada ? postulacionSeleccionada.titulo : ''}</h1>
              <div>
                {[...Array(5)].map((star, i) => {
                  return (
                    <AiFillStar 
                      key={i} 
                      size={40} 
                      onClick={() => cambioEstrellas(i)} 
                      color={i < getPuntuacionEmpresa(postulacionSeleccionada?.id_empresa) ? "#024e69" : "grey"} 
                    />
                  )
                })}
                
              </div>
            </div>
            <span class="modal-titulo-linea"></span>
            <div className='modal-empresa'>
              <h2>Para {postulacionSeleccionada ? getNombreEmpresa(postulacionSeleccionada?.id_empresa) : ''}</h2>
              <div >
                {[...Array(5)].map((star, i) => {
                  return (
                    <AiFillStar 
                      key={i} 
                      size={25} 
                      onClick={() => cambioEstrellas(i)} 
                      color={i < getPuntuacionEmpresa(postulacionSeleccionada?.id_empresa) ? "#024e69" : "grey"} 
                    />
                  )
                })}
              </div>
            </div>
            <div className='modal-tags'>
            {postulacionSeleccionada && postulacionSeleccionada.tags.split(',').map((tag, index) => (
              <div className='figura' key={index}>
                <p>{tag}</p>
              </div>
              
            ))}
            </div>
            <div className='modal-descripcion'>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore aspernatur, 
                dolorum dicta libero praesentium modi quidem dolorem quas soluta vel excepturi ut 
                est ex? Aliquid provident placeat architecto optio. Sint!
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel delectus beatae, ex quo error ipsum, 
                corrupti pariatur tempore modi cumque officiis temporibus eveniet et! Culpa blanditiis rem in commodi harum?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, quia cumque aperiam ipsum ipsa tempore 
                recusandae corporis hic aliquid deserunt commodi asperiores atque placeat! Quisquam dolores dolorum 
                recusandae veniam tempore?
              </p>
              <br/>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore aspernatur, 
                dolorum dicta libero praesentium modi quidem dolorem quas soluta vel excepturi ut 
                est ex? Aliquid provident placeat architecto optio. Sint!
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel delectus beatae, ex quo error ipsum, 
                corrupti pariatur tempore modi cumque officiis temporibus eveniet et! Culpa blanditiis rem in commodi harum?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, quia cumque aperiam ipsum ipsa tempore 
                recusandae corporis hic aliquid deserunt commodi asperiores atque placeat! Quisquam dolores dolorum 
                recusandae veniam tempore?
              </p>
              <br/>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore aspernatur, 
                dolorum dicta libero praesentium modi quidem dolorem quas soluta vel excepturi ut.
              
                
              </p>
            </div>
            
            <div className='modal-publicacion'>
              <div>
                <p className='modal-publicacion-rem1'>Remuneración:{0 == postulacionSeleccionada?.remuneracion ? " No posee": " $"+postulacionSeleccionada?.remuneracion}</p>
                <p className='modal-publicacion-rem'>Ubicación: { 0 == postulacionSeleccionada?.modalidad ? " Online":
                                                                postulacionSeleccionada?.calle_numero + ", "} 
                                                                {0 == postulacionSeleccionada?.modalidad ? "" : postulacionSeleccionada?.comuna + ", "}
                                                                {0 == postulacionSeleccionada?.modalidad ? "" : "Región " + postulacionSeleccionada?.region} 
                                                                {(0 == postulacionSeleccionada?.modalidad ? "": " (15km)")}</p>
                <p className='modal-publicacion-ubi'>Horario: {postulacionSeleccionada?.horario}</p>
                <p>{fechaFormateada}</p>                           
              </div>
              
              <div className='modal-publicacion-postulacion'>

                <Button>{yaPostulo ? "Estas postulando✓" : "Postular a esta vacante"}</Button>
                <div className='modal-publicacion-postulacion-anexos'>
                  <BsThreeDots size={35} color="#074154" className='icon-postulacion'/>
                  <FaHeart size={35} color="#074154" className='icon-postulacion'/>
                  <BsShareFill size={35} color="#074154" className='icon-postulacion'/>
                </div>
              </div>
            </div>
          </div>
          
        </ModalBody>
        </Modal>
    </div>
  );
}

export default Postulaciones;
