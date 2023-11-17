import '../styles/Postulaciones.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { AiFillStar,AiFillLock,AiFillUnlock,AiFillCloseSquare,AiOutlineSearch, AiFillHeart } from 'react-icons/ai';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import { FaHeart } from "react-icons/fa";
import { BsShareFill, BsThreeDots } from "react-icons/bs";
import swal from 'sweetalert';

function Postulaciones() {
  const { user } = useUser();
  const [empresas, setEmpresas] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
  const [puntuacionEmpresa, setPuntuacionEmpresa] = useState(0);
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [distancia, setDistancia] = useState(null);
  const tUsuario = localStorage.getItem('tUsuario');
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
  const [yaPostulo, setYaPostulo] = useState(false);
  const [rating, setRating] = useState(0); 
  const cambioEstrellas = (i) => {
    setRating(i + 1);
  };
  const fecha = new Date(ofertaSeleccionada?.fecha);
  const dia = fecha.getDate();
  const mes = fecha.getMonth();
  const ano = fecha.getFullYear();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const nombreMes = meses[mes];
  const fechaFormateada = `${dia} de ${nombreMes} del ${ano}`;

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
  const clickOferta = (postulacion) => {
    setAbierto(!abierto);
    if(abierto === false) setOfertaSeleccionada(postulacion);
  }
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
  return (
    <div className="postulaciones-todo">
      <p className='postulaciones-titulo'>Postulaciones: </p>
      <div className="postulaciones-ofertas">
      <table cellspacing="15">
            <thead>
                <tr>
                    <th>Postulación</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
            {postulaciones.map(postulacionActual => {

              const fecha = new Date(postulacionActual?.fecha);
              const dia = fecha.getDate();
              const mes = fecha.getMonth();
              const ano = fecha.getFullYear();
              const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
              const nombreMes = meses[mes];
              const fechaFormateada = `${dia} de ${nombreMes} del ${ano}`; 

              return ofertas
                  .filter(oferta => oferta.id_oferta === postulacionActual.id_oferta)
                  .map((postulacionFiltrada, i) => (
                      <tr key={postulacionFiltrada.id_oferta}>
                          <td className='empresa-ofertas-departamento-oferta' 
                            key={i} 
                            onClick={() => clickOferta(postulacionFiltrada)}
                          > 
                          {postulacionFiltrada.titulo}
                          </td>
                          <td className='empresa-ofertas-departamento-oferta empresa-ofertas-departamento-oferta-derecha' 
                            key={i} 
                            onClick={() => clickOferta(postulacionFiltrada)}
                          > 
                          {fechaFormateada}
                          </td>
                          <td className='empresa-ofertas-departamento-oferta' 
                            key={i} 
                            onClick={() => clickOferta(postulacionFiltrada)}
                          > 
                          {postulacionActual.estado}
                          </td>
                      </tr>
                  ))
              })}

            </tbody>
        </table>
  
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
                      size={25} 
                      onClick={() => cambioEstrellas(i)} 
                      color={i < getPuntuacionEmpresa(ofertaSeleccionada?.id_empresa) ? "#024e69" : "grey"} 
                    />
                  )
                })}
              </div>
            </div>
            <div className='modal-tags'>
            {ofertaSeleccionada && ofertaSeleccionada?.tags?.split(',').map((tag, index) => (
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

                <Button onClick={postularOferta}>{yaPostulo ? "Estás postulando ✓" : "Postular a esta vacante"}</Button>
                
              </div>
            </div>
          </div>
          
        </ModalBody>
        </Modal>
    </div>
  );
}

export default Postulaciones;
