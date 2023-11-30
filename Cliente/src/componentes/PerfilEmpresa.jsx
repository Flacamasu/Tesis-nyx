import '../styles/PerfilEmpresa.css'
import React, { useState,useEffect } from 'react';
import { useUser } from './UserContext';
import { AiFillStar, AiFillEdit,  AiFillDelete } from 'react-icons/ai';
import {Button, Modal, ModalBody} from 'reactstrap';
import { BiCommentAdd } from "react-icons/bi";
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';

function PerfilEmpresa() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idEmpresa = Number(queryParams.get('id'));
  const { user } = useUser();
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);

  const [empresas, setEmpresas] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const [comentar, setComentar] = useState(false);
  const [distancia, setDistancia] = useState(null);
  const [yaPostulo, setYaPostulo] = useState(false);
  const [comentario, setComentario] = useState("");
  const tUsuario = localStorage.getItem('tUsuario');



  const clickComentar = () => {
    setComentar(!comentar);
  }

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
          try{
            const distancia = response.rows[0].elements[0].distance.text;
            if (distancia) {
              resolve(distancia);
            } else {
              reject("No se pudo obtener la distancia");
            }
          } catch{
            
          }
          
        }
      );
    });
  };
  const mostrarDistancia = async () => {
    if (!user || !ofertaSeleccionada || tUsuario === 'empresa') {
      console.error('User o ofertaSeleccionada no están definidos');
      return;
    }
  
    const direccionUsuario = user.calle_numero + ', ' + user.comuna + ', ' + user.region;
    const otraDireccion = ofertaSeleccionada.calle_numero + ', ' + ofertaSeleccionada.comuna + ', ' + ofertaSeleccionada.region;
  
    if (!direccionUsuario || !otraDireccion) {
      console.error('DireccionUsuario o otraDireccion no están definidos');
      return;
    }

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
    comprobarPostulacion();
  }, [user, ofertaSeleccionada]);

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
      } else if (tUsuario === 'empresa'){
        return;
      } else {
        const datosOferta = {
          id_oferta: ofertaSeleccionada.id_oferta,
          id_estudiante: user.id_estudiante,
          fecha: new Date()
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
      swal("Error al postular", "Para postular debes de iniciar sesión como estudiante", "warning");
    }
  }
  const actualizarPuntuacionEmpresa = (idEmpresa, nuevaPuntuacion) => {
    setEmpresas(empresasAnteriores =>
      empresasAnteriores.map(empresa =>
        empresa.id_empresa === idEmpresa
          ? { ...empresa, puntuacion_total: nuevaPuntuacion }
          : empresa
      )
    );
  };
  const verificarPostulacionAceptada = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/postulacion/verificar/${user.id_estudiante}/${idEmpresa}`);
      const data = await response.json();
      return data.tienePostulacionAceptada;
    } catch (error) {
      console.error('Error al verificar postulaciones', error);
      return false;
    }
  };
  const publicarComentario= async (e) => {
    e.preventDefault();
    const tienePostulacionAceptada = await verificarPostulacionAceptada();
    if (!tienePostulacionAceptada) {
      swal("No puedes comentar", "Necesitas finalizar una práctica en la empresa para comentar", "warning");
      return;
    }
      try {
        const checkResponse = await fetch(`http://localhost:5000/api/comentarios/check/${user.id_estudiante}`);
        const exists = await checkResponse.json();
          if(rating !== 0){
          if (!exists.alreadyApplied) {
            const datosComentario = {
              id_estudiante: user.id_estudiante,
              id_empresa: idEmpresa,
              rating: rating,
              comentario: comentario,
            };
            const agregarResponse = await fetch('http://localhost:5000/api/comentarios/agregar', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(datosComentario),
            });
            if (agregarResponse.ok) {
              const data = await agregarResponse.json();
              swal({
                title: "¡Se publico el comentario!",
                icon: "success",
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
              setFeedbacks(prevFeedbacks => [...prevFeedbacks, data.comentario]);
              actualizarPuntuacionEmpresa(idEmpresa, data.promedioActualizado);
              setComentar(!comentar);
            }
          } else if (tUsuario === 'empresa'){
            return;
          } else {
            swal({
              title: "No puedes tener más de un comentario por empresa",
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
            setComentar(!comentar);
          }
        } else {
            swal({
              title: "¡Debes almenos colocar una estrella!",
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
        }
      } catch (error) {
        swal("Error", "Ocurrio un error al comentar", "warning");
      }
    
  }
  const clickOferta = (postulacion) => {
    setAbierto(!abierto);
    if(abierto == false) setOfertaSeleccionada(postulacion);
  }
 
  const fecha = new Date(ofertaSeleccionada?.fecha);
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
    fetch('http://localhost:5000/api/ofertas')
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

  useEffect(() => {
    fetch('http://localhost:5000/api/feedbacks')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        return response.json();
      })
      .then((feedbacks) => {
        setFeedbacks(feedbacks);

      })
      .catch((error) => console.log(error));
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
  const getEmpresaPorId = (id) => {
    const empresa = empresas.find((empresa) => empresa.id_empresa === id);
    return empresa;
  };

  const empresa = getEmpresaPorId(idEmpresa);
 

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

  const comprobarPostulacion = async () => {
    
    try {
      // Comprobamos si el usuario ya se postuló a la oferta
      const checkResponse = await fetch(`http://localhost:5000/api/postulacion/check/${ofertaSeleccionada.id_oferta}/${user.id_estudiante}`);
      const exists = await checkResponse.json();
      console.log(exists);
      if (exists.alreadyApplied) {
        setYaPostulo(true);
        console.log("hola")
      } else if (tUsuario === 'empresa'){
        return;
      } else {
        setYaPostulo(false);

      }
    } catch (error) {
      console.log("mal");
    }
  }

  const borrarComentario = async (idComentario) => {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez borrado, no podrás recuperar este comentario",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        // Si el usuario confirma, proceder con el borrado
        realizarBorrado(idComentario);
      }
    });
  }
  const realizarBorrado = async (idComentario) => {
    try {
      const response = await fetch(`http://localhost:5000/api/comentarios/borrar/${idComentario}/${idEmpresa}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        swal("Comentario eliminado", "El comentario ha sido eliminado exitosamente", "success");
        setFeedbacks(feedbacks.filter(feedback => feedback.id_feedback !== idComentario));
        actualizarPuntuacionEmpresa(idEmpresa, data.promedioActualizado);
      } else {
        throw new Error('No se pudo eliminar el comentario');
      }
    } catch (error) {
      swal("Error al eliminar", error.message, "error");
    }
  }  
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
            <p>Dirección: {empresa?.calle_numero}, {empresa?.comuna}, {empresa?.region}</p>
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
                  .filter((postulacion) => postulacion.departamento === departamento.nombre & postulacion.id_empresa === idEmpresa)
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
      <div className='empresa-comentarios'>
        <div className='empresa-comentarios-inicio'>
          <h1 className='empresa-comentarios-titulo'>Comentarios</h1>
          <p className='empresa-comentarios-titulo-agregar'>
            {tUsuario === "estudiante" ? 
            <BiCommentAdd onClick={clickComentar}/> : ""}
          </p>
          
        </div>
        {comentar &&
            <div className='empresa-comen'>
              <div className='empresa-comentar'>
                {estudiantes
                  .filter(estudiante => estudiante.id_estudiante === user?.id_estudiante)
                  .map((estudianteFiltrado, i) => {
                    // Encuentra el estudiante asociado con el feedback
                    
                    // Convierte los datos del logo a base64
                    const logoBase64 = estudianteFiltrado && estudianteFiltrado.imagen && estudianteFiltrado.imagen.data 
                                      ? uint8ArrayToBase64(new Uint8Array(estudianteFiltrado.imagen.data)) 
                                      : null;
                    
                    return (
                      <div className='empresa-comentarios-contenido'>
                        <div className='empresa-comentarios-contenido-p1 empresa-comentarios-contenido-informacion--width empresa-comentarios-contenido-informacion--foto'>
                        <img 
                          src={ logoBase64 && logoBase64.length > 100 ? `data:image/png;base64,${logoBase64}` : require(`../imagenes/usuario-404.png`)} 
                          alt="" 
                          className='empresa-comentarios-contenido-imagen-comentarios'
                        />
                          <div className='empresa-comentarios-contenido-informacion empresa-comentarios-contenido-informacion--width '>
                            <h2 className='empresa-comentarios-contenido-informacion-nombre'>
                              {estudianteFiltrado.nombre}
                            </h2>
                            <textarea 
                              type="text" 
                              className='empresa-comentar-comentario' 
                              placeholder = 'Escribe tu comentario aquí...' 
                              onChange={(e) => setComentario(e.target.value)} 
                              value={comentario}
                            />
                           
                          </div>
                        </div>
                        <div className='empresa-comentar-publicar'>
                          <p className='empresa-comentarios-contenido-estrellas comentar-estrellas'>
                            {[...Array(5)].map((star, i) => {
                              return (
                                <AiFillStar 
                                  key={i} 
                                  size={35} 
                                  onClick={() => cambioEstrellas(i)} 
                                  color={i < rating ? "#024e69" : "grey"} 
                                />
                              )
                            })}
                          </p>
                          <div >
                            <button 
                              className='empresa-comentar-publicar-boton'
                              onClick={publicarComentario}
                            >
                                Publicar
                            </button>
                          </div>
                        </div>
                        
                        </div>
                    );
                  })
                }
              </div>
              
            </div>
          }
          {feedbacks
            .filter(feedback => feedback.id_empresa === idEmpresa)
            .sort((a, b) => b.id_feedback - a.id_feedback)
            .map((feedbackFiltrado, i) => {
              // Encuentra el estudiante asociado con el feedback
              const estudiante = estudiantes.find(est => est.id_estudiante === feedbackFiltrado.id_estudiante);

              // Convierte los datos del logo a base64
              const logoBase64 = estudiante && estudiante.imagen && estudiante.imagen.data 
                                ? uint8ArrayToBase64(new Uint8Array(estudiante.imagen.data)) 
                                : null;
         
              return (
                <div className='empresa-comentarios-contenido'>
                  <div className='empresa-comentarios-contenido-p1'>
                    <img 
                      src={ logoBase64 && logoBase64.length > 100 ? `data:image/png;base64,${logoBase64}` : require(`../imagenes/usuario-404.png`)} 
                      alt="" 
                      className='empresa-comentarios-contenido-imagen'
                    />
                    <div className='empresa-comentarios-contenido-informacion'>
                      <h2 className='empresa-comentarios-contenido-informacion-nombre'>
                        {estudiantes.
                          find(estudiante => estudiante.id_estudiante === feedbackFiltrado.id_estudiante)
                          ?.nombre
                          
                        }
                      </h2>
                      <p className='empresa-comentarios-contenido-informacion-descripcion'>{feedbackFiltrado.descripcion}</p>
                    </div>
                  </div>
                  <div className='empresa-comentarios-contenido-p2'>
                    <p className='empresa-comentarios-contenido-estrellas'>
                      {[...Array(5)].map((star, i) => {
                        return (
                          <AiFillStar 
                            key={i} 
                            size={25} 
                            
                            color={i < feedbackFiltrado.puntaje ? "#024e69" : "grey"} 
                          />
                        )
                      })}
                    </p>

                    {feedbackFiltrado.id_estudiante === user?.id_estudiante ? <AiFillDelete className='boton-borrar' onClick={() => borrarComentario(feedbackFiltrado.id_feedback)} size={30}/> : ""}
                                        
                  </div>
                  
                </div>
              );
            })
          }
      </div>
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
                      size={40} 
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
              <p>
                {ofertaSeleccionada?.descripcion}
              </p>
            </div>
            
            <div className='modal-publicacion'>
              <div>
                <p className='modal-publicacion-rem1'>Remuneración:{0 === ofertaSeleccionada?.remuneracion ? " No posee": " $"+ofertaSeleccionada?.remuneracion}</p>
                <p className='modal-publicacion-rem'>Ubicación: { "Remoto" === ofertaSeleccionada?.modalidad ? " Online":
                                                                ofertaSeleccionada?.calle_numero + ", "} 
                                                                {"Remoto" === ofertaSeleccionada?.modalidad ? "" : ofertaSeleccionada?.comuna + ", "}
                                                                {"Remoto" === ofertaSeleccionada?.modalidad ? "" : "Región " + ofertaSeleccionada?.region} 
                                                                {("Remoto" === ofertaSeleccionada?.modalidad ? "": distancia ? " ("+distancia+")" : "")}</p>
                <p className='modal-publicacion-ubi'>Horario: {ofertaSeleccionada?.horario}</p>
                <p className='modal-fecha'>{fechaFormateada}</p>                           
              </div>
              
              <div className='modal-publicacion-oferta'>

                <Button onClick={postularOferta}> {yaPostulo ? "Estás postulando ✓" : "Postular a esta vacante"}</Button>
                
              </div>
            </div>
          </div>
          
        </ModalBody>
        </Modal>
    </div>
   
  );
}

export default PerfilEmpresa;