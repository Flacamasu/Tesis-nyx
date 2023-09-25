import '../styles/PerfilEmpresa.css'
import React, { useState,useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import { BsShareFill, BsThreeDots } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

function PerfilEmpresa() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idEmpresa = Number(queryParams.get('id'));
  
  const [empresas, setEmpresas] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [abierto, setAbierto] = useState(false);

  const clickOferta = (postulacion) => {
    setAbierto(!abierto);
    if(abierto == false) setPostulacionSeleccionada(postulacion);
  }
  const [postulacionSeleccionada, setPostulacionSeleccionada] = useState(null);

  const fecha = new Date(postulacionSeleccionada?.fecha);
  const dia = fecha.getDate();
  const mes = fecha.getMonth();
  const ano = fecha.getFullYear();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const nombreMes = meses[mes];
  const fechaFormateada = `Publicado el ${dia} de ${nombreMes} de ${ano}`;

  const [rating, setRating] = useState(0); 
  const cambioEstrellas = (i) => {
    setRating(i + 1);
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/empresas')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        return response.json();
      })
      .then((empresas) => {
        setEmpresas(empresas);
      })
      .catch((error) => console.log(error));
  }, []); 

  useEffect(() => {
    fetch('http://localhost:5000/api/postulaciones')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        return response.json();
      })
      .then((postulaciones) => {
        setPostulaciones(postulaciones);
      })
      .catch((error) => console.log(error));
  }, []); 

  useEffect(() => {
    fetch('http://localhost:5000/api/departamentos')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        return response.json();
      })
      .then((departamentos) => {
        setDepartamentos(departamentos);
      })
      .catch((error) => console.log(error));
  }, []); 

  const getEmpresaPorId = (id) => {
    const empresa = empresas.find((empresa) => empresa.id_empresa === id);
    return empresa;
  };
  const getDepartamentosPorEmpresa = (id) => {
    const departamento = departamentos.filter((departamento) => departamento.id_empresa === id);
    return departamento;
  };
  const getPostulaciones = (id) => {
    const postulacion = postulaciones.filter((postulacion) => postulacion.id_empresa === id);
    return postulacion;
  };
  const empresa = getEmpresaPorId(idEmpresa);
    console.log(empresa);

  const departamento =  getDepartamentosPorEmpresa(idEmpresa);
    console.log(departamento);
  
  const postulacion =  getPostulaciones(idEmpresa);
    console.log(postulacion);

  const binaryData = new Uint8Array(empresa?.logo.data);
  function uint8ArrayToBase64(array) {
    let binaryString = '';
    array.forEach((byte) => {
        binaryString += String.fromCharCode(byte);
    });
    return btoa(binaryString);
}
const base64Image = uint8ArrayToBase64(binaryData);
const imageUrl = "data:image/png;base64," + base64Image;
const [departamentoActivo, setDepartamentoActivo] = useState(null);

const toggleDepartamento = (nombreDepartamento) => {
  setDepartamentoActivo(departamentoActivo !== nombreDepartamento ? nombreDepartamento : null);
};

  return(
    <div className='empresa-todo'>
      <div className="empresa-barra">
        <div className='empresa-barra-nombre'>
          <p>{empresa?.nombre}</p>
          <div className='empresa-barra-nombre-img'>
            <img src= {imageUrl} alt="Logo de la empresa"/>
          </div>
          
        </div>
        <div className='empresa-barra-info'>
          <div className='empresa-barra-info-direcciones'>
            <p>Dirección: {empresa?.direccion}</p>
            <p>Número: {empresa?.numero}</p>
            <p>Correo: {empresa?.correo}</p>
          </div>
          <div className='empresa-barra-info-puntuacion'>
            {[...Array(5)].map((star, i) => {
              return (
                <AiFillStar 
                  key={i} 
                  size={50} 
                  
                  color={i < empresa?.puntuacion_total ? "#024e69" : "grey"}
                />
              )
            })}
          </div>
        </div>
      </div>
      <div className='empresa-descripcion'>
        <p>{empresa?.descripcion}</p>
      </div>
      <div className='empresa-ofertas'>
        {departamentos
          .filter(departamento => departamento.id_empresa === idEmpresa)
          .map((departamento, index) => (
          <div className='empresa-ofertas-departamento' key={index} > 
            <div className="titulo" onClick={() => toggleDepartamento(departamento.nombre)}>
              {departamento.nombre} 
              <p className="icono">
                {departamentoActivo === departamento.nombre ? '-' : '+'}
              </p>
            </div>
            {departamentoActivo === departamento.nombre && (
              <div className="ofertas">               
                {postulaciones
                  .filter((postulacion) => postulacion.departamento === departamento.nombre)
                  .map((postulacionFiltrada, i) => (
                    <p className='empresa-ofertas-departamento-oferta' key={i} onClick={() => clickOferta(postulacionFiltrada)}>
                      {postulacionFiltrada.titulo} 
                    </p>
                  ))
                }
              </div>
            )}
          </div>
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
                  color={i < postulacionSeleccionada?.puntuacion ? "#edc400" : "grey"} 
                />
              )
            })}
          </div>
        </div>
        <span class="modal-titulo-linea"></span>
        <div className='modal-empresa'>
          <h2>Para {postulacionSeleccionada ? postulacionSeleccionada.empresa : ''}</h2>
          <div >
            {[...Array(5)].map((star, i) => {
              return (
                <AiFillStar 
                  key={i} 
                  size={25} 
                  onClick={() => cambioEstrellas(i)} 
                  color={i < postulacionSeleccionada?.puntuacion ? "#edc400" : "grey"} 
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
          <p>{fechaFormateada}</p>
          <div className='modal-publicacion-postulacion'>
            <Button>Postular a esta vacante</Button>
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

export default PerfilEmpresa;