import '../styles/Postulaciones.css';
import '../styles/Ofertas.css';
import '../styles/PantallaRegistro.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { AiFillStar,AiFillLock,AiFillUnlock,AiFillCloseSquare,AiOutlineSearch, AiFillHeart } from 'react-icons/ai';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import { FaHeart } from "react-icons/fa";
import { BsShareFill, BsThreeDots } from "react-icons/bs";

function Postulaciones() {
  const { user } = useUser();
  const [departamento, setDepartamento] = useState([])

  const [postulacionSeleccionada, setPostulacionSeleccionada] = useState(null);
  const [titulo, setTitulo] = useState(postulacionSeleccionada?.titulo);
  const [departamentoBack, setDepartamentoBack] = useState(postulacionSeleccionada?.departamento);
  const [tags, setTags] = useState(postulacionSeleccionada?.tags);
  const [descripcion, setDescripcion] = useState(postulacionSeleccionada?.descripcion);
  const [remuneracion, setRemuneracion] = useState(postulacionSeleccionada?.remuneracion);
  const [modalidad, setModalidad] = useState(postulacionSeleccionada?.modalidad);
  const [ofertas, setOfertas] = useState([]);
  

  const [abierto, setAbierto] = useState(false);

  const fecha = new Date(postulacionSeleccionada?.fecha);
  const dia = fecha.getDate();
  const mes = fecha.getMonth();
  const ano = fecha.getFullYear();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const nombreMes = meses[mes];
  const fechaFormateada = `Publicado el ${dia} de ${nombreMes} de ${ano}`;
  useEffect(() => {
    fetch('http://localhost:5000/api/departamentos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        return response.json();
      })
      .then((departamento) => {
        setDepartamento(departamento);
      })
      .catch((error) => console.log(error));
  }, []);


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

  const clickOferta = (postulacion) => {
    setAbierto(!abierto);
    if(abierto === false) setPostulacionSeleccionada(postulacion);
  }
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      console.log(departamentoBack);
      // Crear un objeto con los datos del formulario
      const datosOferta = {
        id: postulacionSeleccionada?.id_oferta,
        titulo,
        departamentoBack,
        tags,
        descripcion,
        remuneracion,
        modalidad
      };
      
      const response = await fetch('http://localhost:5000/api/ofertas/modificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosOferta),
      });
      
      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }
      
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setTitulo(postulacionSeleccionada?.titulo);
    setDescripcion(postulacionSeleccionada?.descripcion);
    setTags(postulacionSeleccionada?.tags);
    setRemuneracion(postulacionSeleccionada?.remuneracion);
  }, [postulacionSeleccionada]);
  return (
    <div className="postulaciones-todo">
      <p className='postulaciones-titulo'>Ofertas: </p>
      <div className="postulaciones-ofertas">
      {ofertas
        .filter(oferta => oferta.id_empresa === user.id_empresa)
        .map((ofertaFiltrada, i) => (
          <p 
            className='empresa-ofertas-departamento-oferta' 
            key={i} 
            onClick={() => clickOferta(ofertaFiltrada)}
          >
            {ofertaFiltrada.titulo}
          </p>
      ))}
      </div>
      <Modal isOpen={abierto} className='modal-practicas'>
        <div className='modal-volver'>
          <Button onClick={clickOferta}>Volver</Button>
          <img src={require(`../imagenes/nyxbich2.png`)} alt='' className='img-bichnx'></img>
        </div>
        <ModalBody>
          <div className='modal-contenido modal-ofertas'>
            <h1>Modificar oferta ({postulacionSeleccionada ? postulacionSeleccionada.titulo : ''})</h1>
            
            <form className="form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={postulacionSeleccionada?.titulo}
                  className="form-usuario"
                  onChange={(e) => setTitulo(e.target.value)}
                  value={titulo}
                />
                <p className='form-usuario-abajo'>Titulo</p>
                <select 
                    id="departamento"
                    onChange={(e) => setDepartamentoBack(e.target.value)}
                >
                    <option value="">{postulacionSeleccionada?.departamento}</option>
                    {departamento
                        .filter(departamento => departamento.id_empresa === user.id_empresa && departamento.nombre !== postulacionSeleccionada?.departamento)
                        .map((departamento, index) => (
                            <option key={index} value={departamento.nombre}>
                                {departamento.nombre}
                            </option>
                    ))}
                </select>
                <p className='form-usuario-abajo'>Departamento</p>
                <input
                  type="text"
                  placeholder={postulacionSeleccionada?.tags}
                  className="form-usuario"
                  onChange={(e) => setTags(e.target.value)}
                  value={tags}
                />
                <p className='form-usuario-abajo'>Tags</p>
                <textarea
                  
                  placeholder={postulacionSeleccionada?.descripcion}
                  className="form-usuario form-textarea"
                  onChange={(e) => setDescripcion(e.target.value)}
                  value={descripcion}
                />
                <p className='form-usuario-abajo'>Descripción</p>
                <input
                  type="number"
                  placeholder={postulacionSeleccionada?.remuneracion}
                  className="form-usuario"
                  onChange={(e) => setRemuneracion(e.target.value)}
                  value={remuneracion}
                />
                <p className='form-usuario-abajo'>Remuneración</p>
                <select id="departamento"  onChange={(e) => setModalidad(e.target.value)}>
                  <option>{postulacionSeleccionada?.modalidad}</option>
                  {postulacionSeleccionada?.modalidad === 'Presencial' ? <option>Remoto</option> : <option>Presencial</option>}
                  {console.log(modalidad)}
                </select>
                <p className='form-usuario-abajo'>Modalidad</p>
                {modalidad === 'Presencial' && (
                  <>
                    <input
                      type="text"
                      placeholder={postulacionSeleccionada?.calle_numero}
                      className="form-usuario"
                      // ... otros props aquí
                    />
                    <p className='form-usuario-abajo'>Calle y número</p>

                    <input
                      type="text"
                      placeholder={postulacionSeleccionada?.region}
                      className="form-usuario"
                      // ... otros props aquí
                    />
                    <p className='form-usuario-abajo'>Región</p>

                    <input
                      type="text"
                      placeholder={postulacionSeleccionada?.comuna}
                      className="form-usuario"
                      // ... otros props aquí
                    />
                    <p className='form-usuario-abajo'>Comuna</p>
                  </>
                )}
                <div className='form-usuario-abajo-abajo'>
                  <button type="submit" className="form-boton">
                    Confirmar
                  </button>
                  <div className='form-usuario-abajo-cosas'>
                    
                  </div>
                </div>
              
              </form>
          </div>
          
        </ModalBody>
        </Modal>
        
    </div>
    
  );
}

export default Postulaciones;
