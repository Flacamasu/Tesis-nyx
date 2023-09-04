import '../styles/BuscarPractica.css'
import { useLocation } from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label} from 'reactstrap';
import { AiFillStar,AiFillLock,AiFillUnlock,AiFillCloseSquare,AiOutlineSearch, AiFillHeart } from 'react-icons/ai';
import { BsShareFill, BsThreeDots } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";


function BuscarPractica() {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const practica = params.get('practica');

  // eslint-disable-next-line
  const locacion = params.get('locacion');

  //Aqui cambia el estado del candado
  const [isLocked, setIsLocked] = useState(false);
  const cambioCandado = () => {
    setIsLocked(!isLocked);
  };

  //Aqui cambia el estado de las X para cada area
  const [x2Ubicacion, setX2Ubicacion] = useState(false);
  const [x2Remuneracion, setX2Remuneracion] = useState(false);
  const [x2Puntuacion, setX2Puntuacion] = useState(false);
  const [x2Horario, setX2Horario] = useState(false);
  const [x2Modalidad, setX2Modalidad] = useState(false);
  
  const [abierto, setAbierto] = useState(false);

  const cambioXUbicacion = () => {
    setX2Ubicacion(!x2Ubicacion);
  };
  const cambioXRemuneracion = () => {
    setX2Remuneracion(!x2Remuneracion);
  };
  const cambioXPuntuacion = () => {
    setX2Puntuacion(!x2Puntuacion);
  };
  const cambioXHorario = () => {
    setX2Horario(!x2Horario);
  };
  const cambioXModalidad = () => {
    setX2Modalidad(!x2Modalidad);
  };

  //cambio en el valor de la remuneracion
  const [remuneracion, setRemuneracion] = useState(200000);
  const cambioRemuneracion = (e) => {
    setRemuneracion(e.target.value)
  };

  //Aqui cambia el valor de rating estrellas
  const [rating, setRating] = useState(0); 
  const cambioEstrellas = (i) => {
    setRating(i + 1);
  };

  //Aqui estan las checkbox de horario y modalidad
  const [checkedItems, setCheckedItems] = useState({
    parttime: false,
    fulltime: false,
    rotativo: false,
    remoto: false,
    presencial: false
  });
  const handleChange = (e) => {
    setCheckedItems({
      ...checkedItems,
      [e.target.name]: e.target.checked
    });
  };

  const clickOferta = (postulacion) => {
    setAbierto(!abierto);
    if(abierto == false) setPostulacionSeleccionada(postulacion);
  }

  const [postulaciones, setPostulaciones] = useState([]);
  

  useEffect(() => {
    fetch('http://localhost:5000/api/postulaciones')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        return response.json();
      })
      .then((postulaciones) => {
        console.log(postulaciones);
        setPostulaciones(postulaciones);
      })
      .catch((error) => console.log(error));
  }, []); 

  const [postulacionSeleccionada, setPostulacionSeleccionada] = useState(null);

  const fecha = new Date(postulacionSeleccionada?.fecha);
  const dia = fecha.getDate();
  const mes = fecha.getMonth();
  const ano = fecha.getFullYear();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const nombreMes = meses[mes];
  const fechaFormateada = `Publicado el ${dia} de ${nombreMes} de ${ano}`;

  return(
    <div className='buscar-todo'>
        <h1 className='buscar-practica'>Prácticas encontradas con la busqueda "{practica}"</h1>
        <div className='buscar-cuadro'>
          <div className='buscar-filtros'>
            <div className='buscar-filtros-titulo'>
              <p>Filtros</p>
              <button onClick={cambioCandado} className='buscar-filtros-candado'>
                {isLocked ? <AiFillLock size={40} color='white' /> : <AiFillUnlock size={40} color='white' />}
              </button>
            </div>
            <div className={`buscar-filtros-componentes buscar-filtros-ubicacion ${x2Ubicacion ? 'buscar-filtros--disabled' : 'buscar-filtros--normal'}`}>
              <button onClick={cambioXUbicacion} className='buscar-filtros-boton-x'>
                <AiFillCloseSquare className='buscar-filtros-boton-x-provisional' size={25}/>
              </button>
              <p className='buscar-filtros-subtitulo'>Ubicación</p>
              <input type="text" />
            </div>
            <div className={`buscar-filtros-componentes buscar-filtros-remuneracion ${x2Remuneracion ? 'buscar-filtros--disabled' : 'buscar-filtros--normal'}`}>
              <button onClick={cambioXRemuneracion} className='buscar-filtros-boton-x'>
                <AiFillCloseSquare className='buscar-filtros-boton-x-provisional' size={25}/>
              </button>
              
              <p className='buscar-filtros-subtitulo'>¿Remuneración?</p>
              <input
                className='buscar-filtros-remuneracion-rango'
                type="range"
                min="1"
                max="1000000"
                value={remuneracion}
                id="myRange"
                onChange={cambioRemuneracion}
                disabled={cambioXRemuneracion} 
              />
              <div className='buscar-filtros-remuneracion-rango-numeros'>
                <p>0</p>
                <p>1.000.000</p>
              </div>
              <div className='buscar-filtros-remuneracion-valor'>
                <p className='aaaa'>$</p>
                <input 
                  type="number" 
                  placeholder={`...`} 
                  value={remuneracion} 
                  min="1"
                  max="1000000"
                  onChange={cambioRemuneracion} 
                  readOnly={cambioXRemuneracion}
                  className={`buscar-filtros-remuneracion-dinero`}
                />
              </div>
              
            </div>
            <div className={`buscar-filtros-componentes buscar-filtros-puntuacion ${x2Puntuacion ? 'buscar-filtros--disabled' : 'buscar-filtros--normal'}`}>
              <button onClick={cambioXPuntuacion} className='buscar-filtros-boton-x'>
                <AiFillCloseSquare className='buscar-filtros-boton-x-provisional' size={25}/>
              </button>
              <p className='buscar-filtros-subtitulo'>Puntuación</p>
              <div>
                {[...Array(5)].map((star, i) => {
                  return (
                    <AiFillStar 
                      key={i} 
                      size={30} 
                      onClick={() => cambioEstrellas(i)} 
                      color={i < rating ? "#edc400" : "grey"} 
                    />
                  )
                })}
              </div>
            </div>
            <div className={`buscar-filtros-componentes buscar-filtros-horario ${x2Horario ? 'buscar-filtros--disabled' : 'buscar-filtros--normal'}`}>
              <button onClick={cambioXHorario } className='buscar-filtros-boton-x'>
                <AiFillCloseSquare className='buscar-filtros-boton-x-provisional' size={25}/>
              </button>
              <p className='buscar-filtros-subtitulo'>Horario</p>
              <div className='buscar-filtros-checkboxes'>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="checkbox" 
                    name="parttime"
                    checked={checkedItems.parttime} 
                    onChange={handleChange} 
                  />
                  Part-time
                </label>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="checkbox" 
                    name="fulltime"
                    checked={checkedItems.fulltime} 
                    onChange={handleChange} 
                  />
                  Full-time
                </label>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="checkbox" 
                    name="rotativo"
                    checked={checkedItems.flexible} 
                    onChange={handleChange} 
                  />
                  Flexible
                </label>
              </div>
            </div>
            <div className={`buscar-filtros-componentes buscar-filtros-modalidad ${x2Modalidad ? 'buscar-filtros--disabled' : 'buscar-filtros--normal'}`}>
              <button onClick={cambioXModalidad} className='buscar-filtros-boton-x'>
                <AiFillCloseSquare className='buscar-filtros-boton-x-provisional' size={25}/>
              </button>
              <p className='buscar-filtros-subtitulo'>Modalidad</p>
              <div className='buscar-filtros-checkboxes'>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="checkbox" 
                    name="remoto"
                    checked={checkedItems.remoto} 
                    onChange={handleChange} 
                  />
                  Remoto
                </label>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="checkbox" 
                    name="presencial"
                    checked={checkedItems.presencial} 
                    onChange={handleChange} 
                  />
                  Presencial
                </label>
              </div>
            </div>
          </div>

            <div className='buscar-resultados'>
              <div className='buscar-resultados-barra'>
                <input className='buscar-resultados-barra-inputBusqueda' type="text" />
                <select name="select" className='buscar-resultados-barra-inputOrdenar' defaultValue="">
                  <option value="" disabled>Ordenar por:</option>
                  <option value="value1">Mejor evaluado</option>
                  <option value="value2">Más recientes</option>
                  <option value="value3">Más cercanos</option>
                </select>
                <button className='buscar-resultados-barra-enviar'>Buscar<AiOutlineSearch size={40}/></button>
              </div>
              <div className='buscar-resultados-contenido'>
              
                {postulaciones.map(postulacion => (
                  <div key={postulacion.id_postulacion} className='buscar-resultados-contenido-cuadro' onClick={() => clickOferta(postulacion)}>
                    <div className='buscar-resultados-contenido-cuadro-titulo'>
                    
                      <h1>{postulacion.titulo} | {postulacion.empresa}</h1>
                      <h1>{postulacion.puntuacion}</h1>
                    </div>
                    <p className='buscar-resultados-contenido-cuadro-descripcion'>
                      {postulacion.descripcion}
                    </p>
                    <div className='buscar-resultados-contenido-cuadro-etiqueta'>

                      {postulacion.tags.split(',').map((tag, index) => (
                          <p key={index}>{tag}</p>
                      ))}
                  
                    </div>
                  </div>
                ))}

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
          </div>
        </div>
    </div>
  );
}

export default BuscarPractica;