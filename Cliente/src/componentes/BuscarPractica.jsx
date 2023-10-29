import '../styles/BuscarPractica.css'
import { useLocation } from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import {Button, Modal,ModalBody} from 'reactstrap';
import { AiFillStar,AiFillCloseSquare,AiOutlineSearch } from 'react-icons/ai';

import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function BuscarPractica() {
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const practica = params.get('practica');
  const locacion = params.get('locacion');
  const puntuacion = params.get('puntuacion');
  const remuneracion_int = params.get('remuneracion');
  const horario = params.get('horario');
  const modalidad_int = params.get('modalidad');
  const [inputPractica, setInputPractica] = useState(practica);
  const navigate = useNavigate();
  const [inputLocacion, setInputLocacion] = useState(locacion);
  const [inputPuntuacion, setInputPuntuacion] = useState(puntuacion);
  const [inputRemuneracion, setInputRemuneracion] = useState(remuneracion_int);
  const [inputHorario, setInputHorario] = useState(horario);
  const [inputModalidad, setInputModalidad] = useState(modalidad_int);

  //Aqui cambia el estado de las X para cada area
  const [x2Remuneracion, setX2Remuneracion] = useState(localStorage.getItem('remuneracionDisabled') === 'true');
  const [x2Puntuacion, setX2Puntuacion] = useState(localStorage.getItem('puntuacionDisabled') === 'true');
  const [x2Horario, setX2Horario] = useState(localStorage.getItem('horarioDisabled') === 'true');
  const [x2Modalidad, setX2Modalidad] = useState(localStorage.getItem('modalidadDisabled') === 'true');
  
  const [abierto, setAbierto] = useState(false);
  const [distancia, setDistancia] = useState(null);
  const [disabledRemuneracion, setDisabledRemuneracion] = useState(localStorage.getItem('remuneracionDisabled') === 'true');
  const [disabledPuntuacion, setDisabledPuntuacion] = useState(localStorage.getItem('puntuacionDisabled') === 'true');
  const [disabledHorario, setDisabledHorario] = useState(localStorage.getItem('horarioDisabled') === 'true');
  const [disabledModalidad, setDisabledModalidad] = useState(localStorage.getItem('modalidadDisabled') === 'true');
  
  const cambioXRemuneracion = () => {
    setX2Remuneracion(!x2Remuneracion);
    const newDisabledRemuneracion = !disabledRemuneracion;
    setDisabledRemuneracion(newDisabledRemuneracion);
    localStorage.setItem('remuneracionDisabled', newDisabledRemuneracion.toString());
  };
  
  const cambioXPuntuacion = () => {
    setX2Puntuacion(!x2Puntuacion);
    const newDisabledPuntuacion = !disabledPuntuacion;
    setDisabledPuntuacion(newDisabledPuntuacion);
    localStorage.setItem('puntuacionDisabled', newDisabledPuntuacion.toString());
  };
  
  const cambioXHorario = () => {
    setX2Horario(!x2Horario);
    const newDisabledHorario = !disabledHorario;
    setDisabledHorario(newDisabledHorario);
    localStorage.setItem('horarioDisabled', newDisabledHorario.toString());
  };
  
  const cambioXModalidad = () => {
    setX2Modalidad(!x2Modalidad);
    const newDisabledModalidad = !disabledModalidad;
    setDisabledModalidad(newDisabledModalidad);
    localStorage.setItem('modalidadDisabled', newDisabledModalidad.toString());
  };
  
  //cambio en el valor de la remuneracion
  const [remuneracion, setRemuneracion] = useState(remuneracion_int ? inputRemuneracion : 0);
  const cambioRemuneracion = (e) => {
    setRemuneracion(e.target.value)
  };

  //Aqui cambia el valor de rating estrellas
  const [rating, setRating] = useState(puntuacion ? inputPuntuacion : 0); 
  const cambioEstrellas = (i) => {
    setRating(i + 1);
  };
  const [selectedWorkType, setSelectedWorkType] = useState(horario ? inputHorario : '');
  const [seleccionModalidad, setSeleccionModalidad] = useState(modalidad_int ? inputModalidad : '');
  //Aqui estan las checkbox de horario y modalidad
  const [checkedItems, setCheckedItems] = useState({
    parttime: false,
    fulltime: false,
    flexible: false
});

  const handleChange = (event) => {
    const { name, checked } = event.target;

    // Resetear todos a falso
    let newCheckedItems = {
        parttime: false,
        fulltime: false,
        flexible: false
    };

    // Solo establecer el seleccionado a verdadero
    if (checked) {
        newCheckedItems[name] = true;
    }

    setCheckedItems(newCheckedItems);
  };

  const clickOferta = (oferta) => {
    setAbierto(!abierto);
    if(abierto === false) setOfertaSeleccionada(oferta);
  }

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



  useEffect(() => {
    fetch('http://localhost:5000/api/empresas')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        return response.json();
      })
      .then((empresas) => {
        console.log(empresas);
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
        console.log(postulaciones);
        setPostulaciones(postulaciones);
      })
      .catch((error) => console.log(error));
  }, []); 

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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const direccionUsuario = user.calle_numero + ', ' + user.comuna + ', ' + user.region;
        const datoBusqueda = {
          termino: practica,
          puntuacion: puntuacion,
          remuneracion: remuneracion,
          horario: horario,
          modalidad: modalidad_int,
          direccionUsuario
        };
  
        // Haciendo petición POST
        const response = await fetch('http://localhost:5000/api/busqueda', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datoBusqueda),
        });
  
        if (!response.ok) {
          throw new Error("Error al hacer la petición POST");
        }
  
        const ofertasResultantes = await response.json();
        console.log(ofertasResultantes);
        setOfertas(ofertasResultantes);
      
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  
  }, [user]);
  


  const postularOferta = async (e) => {
    e.preventDefault();
    try {
      const checkResponse = await fetch(`http://localhost:5000/api/postulacion/check/${ofertaSeleccionada.id_oferta}/${user.id_estudiante}`);
      const exists = await checkResponse.json();
  
      if (exists.alreadyApplied) {
        const deleteResponse = await fetch(`http://localhost:5000/api/postulacion/delete/${ofertaSeleccionada.id_oferta}/${user.id_estudiante}`, {
          method: 'DELETE',
        });
        if (deleteResponse.ok) {
          swal({
            title: "Dejaste de postular",
            icon: "error",
            className: "swal-custom-bg",
            buttons: {
              confirm: {
                text: "Aceptar",
                value: true,
                visible: true,
                className: "btn-aceptar",
                closeModal: true
              }
            },
          });
          setYaPostulo(false);
        }
      } else {
        const datosOferta = {
          id_oferta: ofertaSeleccionada.id_oferta,
          id_estudiante: user.id_estudiante
        };
        const response = await fetch('http://localhost:5000/api/postulacion/agregar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosOferta),
        });
        swal({
          title: "Has postulado",
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
        });
        setYaPostulo(true);
      }
    } catch (error) {
      console.error("error");
    }
  }
  

  const handleInputChange = (e) => {
    setInputPractica(e.target.value);
  }
  const handleInputLocacionChange = (e) => {
    setInputLocacion(e.target.value);
  }
  function handleClick(e) {
    e.preventDefault();
    let url = '/buscar?';
    const params = [];

    params.push(`practica=${inputPractica}`);
    
  
    if (!disabledRemuneracion && remuneracion) {
      params.push(`remuneracion=${remuneracion}`);
    }
  
    if (!disabledPuntuacion && rating) {
      params.push(`puntuacion=${rating}`);
    }
  
    if (!disabledHorario && selectedWorkType) {
      params.push(`horario=${selectedWorkType}`);
    }
  
    if (!disabledModalidad && seleccionModalidad) {
      params.push(`modalidad=${seleccionModalidad}`);
    }
  
    url += params.join('&');
  
    navigate(url);
    window.location.reload();
  }
  // Filtrar postulaciones basadas en el id_estudiante
  const postulacionesDelEstudiante = postulaciones?.filter(p => p.id_estudiante === user.id_estudiante);

  // Verificar si alguna de las postulaciones filtradas coincide con el id_oferta de la oferta seleccionada
  const [yaPostulo, setYaPostulo] = useState(false);

  useEffect(() => {
    const isPostulado = postulacionesDelEstudiante?.some(p => p.id_oferta === ofertaSeleccionada?.id_oferta);
    setYaPostulo(isPostulado);
    }, [ofertaSeleccionada]);


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
          if (distancia) {
            resolve(distancia);
          } else {
            reject("No se pudo obtener la distancia");
          }
        }
      );
    });
  };
  const mostrarDistancia = async () => {
    if (!user || !ofertaSeleccionada) {
      console.error('User o ofertaSeleccionada no están definidos');
      return;
    }
  
    const direccionUsuario = user.calle_numero + ', ' + user.comuna + ', ' + user.region;
    const otraDireccion = ofertaSeleccionada.calle_numero + ', ' + ofertaSeleccionada.comuna + ', ' + ofertaSeleccionada.region;
  
    if (!direccionUsuario || !otraDireccion) {
      console.error('DireccionUsuario o otraDireccion no están definidos');
      return;
    }
  
    console.log(direccionUsuario);
    try {
      const resultado = await calcularDistancia(direccionUsuario, otraDireccion);
      setDistancia(resultado);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (ofertaSeleccionada?.modalidad !== 'Remoto') {
      mostrarDistancia();
    }
  }, [user, ofertaSeleccionada]);
  return(
    <div className='buscar-todo'>
        <h1 className='buscar-practica'>Prácticas encontradas con la busqueda "{practica}":</h1>
        <div className='buscar-cuadro'>
          <div className='buscar-filtros'>
            <div className='buscar-filtros-titulo'>
              <p>Preferencias</p>
              <button onClick={handleClick} className='buscar-filtros-tick'>
                ✔
              </button>
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
                      color={i < rating ? "#024e69" : "grey"} 
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
                      type="radio" 
                      name="workType"
                      value="Part-time"
                      checked={selectedWorkType === "Part-time"} 
                      onChange={e => setSelectedWorkType(e.target.value)} 
                  />
                  Part-time
              </label>
              <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                      type="radio" 
                      name="workType"
                      value="Full-time"
                      checked={selectedWorkType === "Full-time"} 
                      onChange={e => setSelectedWorkType(e.target.value)} 
                  />
                  Full-time
              </label>
              <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                      type="radio" 
                      name="workType"
                      value="Flexible"
                      checked={selectedWorkType === "Flexible"} 
                      onChange={e => setSelectedWorkType(e.target.value)} 
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
                    type="radio" 
                    name="Remoto"
                    value="Remoto"
                    checked={seleccionModalidad === 'Remoto'} 
                    onChange={e => setSeleccionModalidad(e.target.value)} 
                  />
                  Remoto
                </label>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="radio" 
                    name="Presencial"
                    value="Presencial"
                    checked={seleccionModalidad === 'Presencial'} 
                    onChange={e => setSeleccionModalidad(e.target.value)} 
                  />
                  Presencial
                </label> 
                <label className='buscar-filtros-checkboxes-texto'> 
                  <input 
                    type="radio" 
                    name="Hibrido"
                    value="Hibrido"
                    checked={seleccionModalidad === 'Hibrido'} 
                    onChange={e => setSeleccionModalidad(e.target.value)} 
                  />
                  Hibrido
                </label>
              </div>
            </div>
          </div>

            <div className='buscar-resultados'>
              <div className='buscar-resultados-barra'>
                <input 
                  className='buscar-resultados-barra-inputBusqueda' 
                  type="text" 
                  value={inputPractica}
                  onChange={handleInputChange}
                />
                <select name="select" className='buscar-resultados-barra-inputOrdenar' defaultValue="">
                  <option value="" disabled>Ordenar por:</option>
                  <option value="value1">Mejor evaluado</option>
                  <option value="value2">Más recientes</option>
                  <option value="value3">Más cercanos</option>
                </select>
                <button className='buscar-resultados-barra-enviar' onClick={handleClick}>Buscar<AiOutlineSearch size={40}/></button>
              </div>
              <div className='buscar-resultados-contenido'>
              
                {ofertas.map(oferta => (
                  <div key={oferta.id_oferta} className='buscar-resultados-contenido-cuadro' onClick={() => clickOferta(oferta)}>
                    <div className='buscar-resultados-contenido-cuadro-titulo'>
                    
                      <h1>{oferta.titulo} | {getNombreEmpresa(oferta.id_empresa)}</h1>
                      <h1>{[...Array(5)].map((star, i) => {
                              return (
                                <AiFillStar 
                                  key={i} 
                                  size={40} 
                                  onClick={() => cambioEstrellas(i)} 
                                  color={i < getPuntuacionEmpresa(oferta.id_empresa) ? "#024e69" : "grey"} 
                                />
                              )
                            })}</h1>
                    </div>
                    <p className='buscar-resultados-contenido-cuadro-descripcion'>
                      {oferta.descripcion}
                    </p>
                    <div className='buscar-resultados-contenido-cuadro-etiqueta'>

                      {oferta.tags.split(',').map((tag, index) => (
                        <div className='figura-antes' key={index}>
                          <p>{tag}</p>
                        </div>
                          
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
                          <h1>{ofertaSeleccionada ? ofertaSeleccionada.titulo : ''}</h1>
                          <div>
                            {[...Array(5)].map((star, i) => {
                              return (
                                <AiFillStar 
                                  key={i} 
                                  size={40} 
                                  onClick={() => cambioEstrellas(i)} 
                                  color={i < getPuntuacionEmpresa(ofertaSeleccionada?.id_empresa) ? "#024e69" : "grey"} 
                                />
                              )
                            })}
                            
                          </div>
                          
                        </div>
                        <span className="modal-titulo-linea"></span>
                        <div className='modal-empresa'>
                          <h2>Para {ofertaSeleccionada ? <a href={`/empresas?id=${ofertaSeleccionada?.id_empresa}`}>{getNombreEmpresa(ofertaSeleccionada?.id_empresa)}</a> : ''}</h2>
                          <div >
                            {[...Array(5)].map((star, i) => {
                              return (
                                <AiFillStar 
                                  key={i} 
                                  size={25} 
                                  onClick={() => cambioEstrellas(i)} 
                                  color={i < getPuntuacionEmpresa(ofertaSeleccionada?.id_empresa) ? "#024e69" : "grey"} 
                                />
                              )
                            })}
                          </div>
                        </div>
                        <div className='modal-tags'>
                        {ofertaSeleccionada && ofertaSeleccionada.tags.split(',').map((tag, index) => (
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
                            <p className='modal-publicacion-rem1'>Remuneración:{0 === ofertaSeleccionada?.remuneracion ? " No posee": " $"+ofertaSeleccionada?.remuneracion}</p>
                            <p className='modal-publicacion-rem'>Ubicación: { "Remoto" === ofertaSeleccionada?.modalidad ? " Online":
                                                                            ofertaSeleccionada?.calle_numero + ", "} 
                                                                            {"Remoto" === ofertaSeleccionada?.modalidad ? "" : ofertaSeleccionada?.comuna + ", "}
                                                                            {"Remoto" === ofertaSeleccionada?.modalidad ? "" : "Región " + ofertaSeleccionada?.region} 
                                                                            {("Remoto" === ofertaSeleccionada?.modalidad ? "": " ("+distancia+")")}</p>
                            <p className='modal-publicacion-ubi'>Horario: {ofertaSeleccionada?.horario}</p>
                            <p className='modal-fecha'>{fechaFormateada}</p>                           
                          </div>
                          
                          <div className='modal-publicacion-oferta'>
                    
                            <Button onClick={postularOferta}>{yaPostulo ? "Estás postulando ✓" : "Postular a esta vacante"}</Button>
                            
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