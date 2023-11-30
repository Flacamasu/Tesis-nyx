import '../styles/Postulaciones.css';
import '../styles/Ofertas.css';
import '../styles/PantallaRegistro.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { AiFillEye, AiFillEdit, AiOutlineTeam, AiFillDelete, AiFillStar, AiOutlineUserAdd } from 'react-icons/ai';
import {Button, Modal, ModalBody, ModalHeader,Form, FormGroup, Label, Input} from 'reactstrap';
import Swal from 'sweetalert2';

function Ofertas() {
  const { user } = useUser();
  const [departamento, setDepartamento] = useState([])

  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
  const [titulo, setTitulo] = useState(ofertaSeleccionada?.titulo);
  const [departamentoBack, setDepartamentoBack] = useState(ofertaSeleccionada?.departamento);
  const [tags, setTags] = useState(ofertaSeleccionada?.tags);
  const [descripcion, setDescripcion] = useState(ofertaSeleccionada?.descripcion);
  const [remuneracion, setRemuneracion] = useState(ofertaSeleccionada?.remuneracion);
  const [modalidad, setModalidad] = useState(ofertaSeleccionada?.modalidad);
  const [ofertas, setOfertas] = useState([]);
  const [horario, setHorario] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [abiertoAgregarEstudiante, setAbiertoAgregarEstudiante] = useState(false);
  const [rutEstudiante, setRutEstudiante] = useState('');

  const [abiertoVer, setAbiertoVer] = useState(false);
  const [abiertoEditar, setAbiertoEditar] = useState(false);
  const [abiertoPostulantes, setAbiertoPostulantes] = useState(false);
  const [abiertoPracticantes, setAbiertoPracticantes] = useState(false);
  const [abiertoPracticantesFinalizada, setAbiertoPracticantesFinalizada] = useState(false);
  const [abiertoEstado, setAbiertoEstado] = useState(false);
  const [dropdownsOpen, setDropdownsOpen] = useState({});
  
  const toggleDropdown = (id) => {
    setDropdownsOpen(prevState => {
      const newState = {...prevState};
      // Establecer todas las entradas a false primero
      Object.keys(newState).forEach(key => {
        newState[key] = false;
      });
      // Alternar el menú actual
      newState[id] = !prevState[id];
      return newState;
    });
  };
  const toggleAgregarEstudiante = () => {
    setAbiertoAgregarEstudiante(!abiertoAgregarEstudiante);
  };
  const agregarEstudiante = async () => {

    try {

      const datosAgregar = {
        id_oferta: ofertaSeleccionada?.id_oferta,
        rutEstudiante
      };
      
      const response = await fetch('http://localhost:5000/api/postulaciones/agregarEstudiante', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosAgregar),
      });
      
      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }
      const data = await response.json();

      if (data.agregar) {
        console.log(data.postulacion);
        setPostulaciones(prevPostulaciones => [...prevPostulaciones, data.postulacion]);
        console.log(postulaciones);
        Swal.fire({
          title: '¡Se agregó al estudiante con éxito!',
          icon: 'success',

          confirmButtonColor: '#3085d6',

          confirmButtonText: 'Ok',

        });

        // Aquí puedes realizar acciones adicionales si la oferta se actualizó
      } else {
        Swal.fire({
          title: 'Estudiante no encontrado',
          
          icon: 'error',

          confirmButtonColor: '#3085d6',

          confirmButtonText: 'Ok',

        });
        console.log("No se actualizó la oferta, no hay postulaciones aprobadas.");
        // Aquí puedes mostrar un mensaje al usuario o realizar otras acciones
      }
    } catch (error) {
      console.error(error);
    }

    setRutEstudiante(''); // Limpiar el campo RUT
    setAbiertoAgregarEstudiante(false); // Cerrar el modal
};
  const opcionesMenu = [
    "En revisión",
    "Aceptada",
    "Rechazada",
  ];
  const opcionesEstadoOferta1 = [
    "En proceso",
  ];
  const opcionesEstadoOferta2 = [
    "Finalizada"
  ];
  const handleMenuClick = (event, opcion, id) => {
    event.stopPropagation(); 
    setDropdownsOpen(prevState => ({
      ...prevState,
      [id]: false
    }));
    actualizarEstadoPostulacion(id, opcion);
  };
  const handleMenuEstadoClick = (event, opcion, id) => {
    event.stopPropagation(); 
    setDropdownsOpen(prevState => ({
      ...prevState,
      [id]: false
    }));
    actualizarEstadoOferta(id, opcion);
  };
  
  const fecha = new Date(ofertaSeleccionada?.fecha);
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

  useEffect(() => {
    fetch('http://localhost:5000/api/estudiantes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        return response.json();
      })
      .then((estudiantes) => {
        setEstudiantes(estudiantes);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/postulaciones')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        return response.json();
      })
      .then((postulaciones) => {
        setPostulaciones(postulaciones);
      })
      .catch((error) => console.log(error));
  }, [ofertas]);

  const clickVer = (oferta) => {
    setAbiertoVer(!abiertoVer);
    if(abiertoVer === false) setOfertaSeleccionada(oferta);
  }
  const clickEditar = (oferta) => {
    setAbiertoEditar(!abiertoEditar);
    if(abiertoEditar === false) setOfertaSeleccionada(oferta);
  }
  const clickPostulantes = (oferta) => {
    setAbiertoPostulantes(!abiertoPostulantes);
    if(abiertoPostulantes === false) setOfertaSeleccionada(oferta);
  }
  const clickPracticantes = (oferta) => {
    setAbiertoPracticantes(!abiertoPracticantes);
    if(abiertoPracticantes === false) setOfertaSeleccionada(oferta);
  }
  const clickPracticantesFinalizada = (oferta) => {
    setAbiertoPracticantesFinalizada(!abiertoPracticantesFinalizada);
    if(abiertoPracticantesFinalizada === false) setOfertaSeleccionada(oferta);
  }
  const clickEstado = (oferta) => {
    setAbiertoEstado(!abiertoEstado);
    if(abiertoEstado === false) setOfertaSeleccionada(oferta);
  }
  const clickEliminar =  (ofertaFiltrada) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Suponiendo que tienes un endpoint de API para eliminar ofertas
        // y que ofertaFiltrada.id_oferta contiene el ID de la oferta a eliminar.
        const url = `http://localhost:5000/api/ofertas/${ofertaFiltrada.id_oferta}`;
        console.log(url);
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Aquí puedes añadir más cabeceras si es necesario,
            // por ejemplo, algún token de autorización si la API lo requiere.
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo eliminar la oferta.');
          }
          return response.json();
        })
        .then(data => {
          // Actualiza el estado para reflejar la oferta eliminada.
          setOfertas((ofertas) => ofertas.filter(oferta => oferta.id_oferta !== ofertaFiltrada.id_oferta));

          // Mostrar una alerta de éxito
          Swal.fire(
            'Eliminado!',
            'La oferta ha sido eliminada.',
            'success'
          );
        })
        .catch(error => {
          console.error('Hubo un error al eliminar la oferta:', error);
          // Aquí puedes mostrar un mensaje al usuario si algo va mal.
          Swal.fire(
            'Error!',
            'No se pudo eliminar la oferta.',
            'error'
          );
        });
      }
      // Si result.isConfirmed es falso, significa que el usuario hizo clic en "Cancelar".
    });
  };
  const clickEliminarPracticante =  (postulacionFiltrada) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Suponiendo que tienes un endpoint de API para eliminar ofertas
        // y que ofertaFiltrada.id_oferta contiene el ID de la oferta a eliminar.
        const url = `http://localhost:5000/api/postulaciones/${postulacionFiltrada.id_postulacion}`;
        console.log(url);
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Aquí puedes añadir más cabeceras si es necesario,
            // por ejemplo, algún token de autorización si la API lo requiere.
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo eliminar al estudiante.');
          }
          return response.json();
        })
        .then(data => {
          // Actualiza el estado para reflejar la oferta eliminada.
          setPostulaciones((postulaciones) => postulaciones.filter(postulacion => postulacion.id_postulacion !== postulacionFiltrada.id_postulacion));

          // Mostrar una alerta de éxito
          Swal.fire(
            '¡Eliminado!',
            'El estudiante ha sido eliminado de la práctica.',
            'success'
          );
        })
        .catch(error => {
          console.error('Hubo un error al eliminar la oferta:', error);
          // Aquí puedes mostrar un mensaje al usuario si algo va mal.
          Swal.fire(
            'Error!',
            'No se pudo eliminar al estudiante.',
            'error'
          );
        });
      }
      // Si result.isConfirmed es falso, significa que el usuario hizo clic en "Cancelar".
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      console.log(departamentoBack);
      // Crear un objeto con los datos del formulario
      const datosOferta = {
        id: ofertaSeleccionada?.id_oferta,
        titulo,
        departamentoBack,
        tags,
        descripcion,
        remuneracion,
        horario,
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
    setTitulo(ofertaSeleccionada?.titulo);
    setDescripcion(ofertaSeleccionada?.descripcion);
    setTags(ofertaSeleccionada?.tags);
    setRemuneracion(ofertaSeleccionada?.remuneracion);
  }, [ofertaSeleccionada]);
  const [rating, setRating] = useState(0); 
  const cambioEstrellas = (i) => {
    setRating(i + 1);
  };
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

  const actualizarEstadoPostulacion = async (idPostulacion, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:5000/api/postulaciones/${idPostulacion}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar la postulación");
      }
  
      const data = await response.json();
      console.log(data.mensaje);
      
      setPostulaciones(prevPostulaciones =>
        prevPostulaciones.map(postulacion => {
          if (postulacion.id_postulacion === idPostulacion) {
            return { ...postulacion, estado: nuevoEstado };
          }
          return postulacion;
        }),
      );
  
      // Aquí deberías actualizar el estado de tu componente con la nueva información
      // Esto podría implicar volver a cargar las postulaciones, o simplemente actualizar
      // el estado localmente si no quieres hacer otra petición al servidor.
    } catch (error) {
      console.error('Hubo un error al actualizar la postulación:', error);
    }
  };
  const actualizarEstadoOferta = async (idOferta, nuevoEstado) => {
    try {
      const resultado = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no puede deshacerse.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar estado',
        cancelButtonText: 'Cancelar'
      });
      
      if (resultado.isConfirmed) {
        const response = await fetch(`http://localhost:5000/api/ofertas/${idOferta}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nuevoEstado }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || "Error al actualizar la postulación");
        }
  
        console.log(data.mensaje);
  
        if (data.actualizar) {
          Swal.fire({
            title: '¡Se actualizó el estado de la oferta con éxito!',
            icon: 'success',

            confirmButtonColor: '#3085d6',
  
            confirmButtonText: 'Ok',

          });
          setOfertas(prevOfertas =>
            prevOfertas.map(oferta => {
              if (oferta.id_oferta === idOferta) {
                return { ...oferta, estado: nuevoEstado };
              }
              return oferta;
            }),
          );
          
          // Aquí puedes realizar acciones adicionales si la oferta se actualizó
        } else {
          Swal.fire({
            title: 'No se actualizó el estado de la oferta',
            text: "Necesitas aprobar a lo menos una postulación para cambiar el estado de la oferta.",
            icon: 'error',

            confirmButtonColor: '#3085d6',
  
            confirmButtonText: 'Ok',

          });
          console.log("No se actualizó la oferta, no hay postulaciones aprobadas.");
          // Aquí puedes mostrar un mensaje al usuario o realizar otras acciones
        }
      }
    } catch (error) {
      console.error('Hubo un error al actualizar la oferta:', error);
      // Aquí puedes manejar cómo mostrar el error al usuario
    }
  };
  function formatUsuario(value) {
    // Verificar si el último carácter es una 'k' o 'K'
    let endsWithK = value.toLowerCase().endsWith('k');

    // Si el valor termina con 'k' o 'K', eliminar este carácter
    let cleanedValue = endsWithK ? value.slice(0, -1) : value;

    // Limpiar el valor de entrada de cualquier caracter no numérico
 
    cleanedValue = cleanedValue.replace(/\D+/g, '');
    
    if (endsWithK){
      cleanedValue = cleanedValue+'K'
    } 

    // Si la longitud del valor limpio es 1 o 2, simplemente devolver el valor limpio
    if (cleanedValue.length <= 2) {
      return cleanedValue + (endsWithK ? '-K' : '');
    }

    // Separar el último dígito para el guion
    let lastDigit = cleanedValue.slice(-1);
    let restOfDigits = cleanedValue.slice(0, -1);

    // Formatear el resto de los dígitos con puntos
    let formattedRest = restOfDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Combinar el formato
    let formattedValue = `${formattedRest}-${lastDigit}`;

    return formattedValue;
  }

  const handleChange = (event) => {
    let inputValue = event.target.value;
    setRutEstudiante(formatUsuario(inputValue));
  };
  return (
    <div className="postulaciones-todo">
      <p className='postulaciones-titulo'>Ofertas: </p>
      <div className='ofertas-tabla'>
        <table cellspacing="15">
              <thead>
                  <tr>
                      <th>Oferta</th>
                      <th>Ver</th>
                      <th>Editar</th>
                      <th>Postulantes</th>
                      <th>Estado</th>
                      <th>Eliminar</th>
                  </tr>
              </thead>
              <tbody>
              
                {ofertas
                  .filter(oferta => oferta.id_empresa === user.id_empresa && oferta.estado === 'Oferta')
                  .map((ofertaFiltrada, i) => (
                    <tr className='ofertas-tabla-datos'>
                      <td 
                        className='empresa-ofertas-departamento-oferta oferta-tabla' 
                      >
                        {ofertaFiltrada.titulo}
                      </td>
                      <td className='oferta-icons' 
                        key={i} 
                        onClick={() => clickVer(ofertaFiltrada)}
                      >
                        <AiFillEye />
                      </td>
                      <td className='oferta-icons'
                        key={i} 
                        onClick={() => clickEditar(ofertaFiltrada)}
                      >
                        <AiFillEdit />
                      </td>
                      <td className='oferta-icons'
                        key={i} 
                        onClick={() => clickPostulantes(ofertaFiltrada)}
                      >
                        <AiOutlineTeam />
                      </td>
                      <td className='oferta-icons oferta-estado'
                        key={i} 
                        onClick={() => clickEstado(ofertaFiltrada)}
                      >
                        {ofertaFiltrada.estado}
                        <AiFillEdit className='oferta-estado--margin' onClick={() => toggleDropdown(ofertaFiltrada.id_oferta)}/>
                          {dropdownsOpen[ofertaFiltrada.id_oferta] && (
                            <div className="menu-desplegable">
                              {opcionesEstadoOferta1.map((opcion, index) => (
                                <div 
                                    key={index} 
                                    className="menu-item" 
                                    onClick={(event) => handleMenuEstadoClick(event, opcion, ofertaFiltrada.id_oferta) }
                                >
                                  {opcion}
                                </div>
                              ))}
                            </div>
                          )}     
                      </td>                      
                      
                      <td className='oferta-icons'
                        key={i} 
                        onClick={() => clickEliminar(ofertaFiltrada)}
                      >
                        <AiFillDelete />
                      </td>
                    </tr>
                ))}
              </tbody>
        </table>
        
      </div>

      <p className='postulaciones-titulo postulaciones-titulo--margin'>Prácticas en proceso: </p>
      <div className='ofertas-tabla practicas-tabla'>
        <table cellspacing="15">
              <thead>
                  <tr>
                      <th>Práctica</th>
                      <th>Ver</th>
                      <th>Prácticantes</th>
                      <th>Estado</th>
                  </tr>
              </thead>
              <tbody>
              
                {ofertas
                  .filter(oferta => oferta.id_empresa === user.id_empresa  && oferta.estado === 'En proceso')
                  .map((ofertaFiltrada, i) => (
                    <tr className='ofertas-tabla-datos'>
                      <td 
                        className='empresa-ofertas-departamento-oferta' 
                      >
                        {ofertaFiltrada.titulo}
                      </td>
                      <td className='oferta-icons' 
                        key={i} 
                        onClick={() => clickVer(ofertaFiltrada)}
                      >
                        <AiFillEye />
                      </td>
                      
                  
                      <td className='oferta-icons'
                        key={i} 
                        onClick={() => clickPracticantes(ofertaFiltrada)}
                      >
                        <AiOutlineTeam />
                      </td>
                      <td className='oferta-icons oferta-estado'
                        key={i} 
                        onClick={() => clickEstado(ofertaFiltrada)}
                      >
                        {ofertaFiltrada.estado}
                        <AiFillEdit className='oferta-estado--margin' onClick={() => toggleDropdown(ofertaFiltrada.id_oferta)}/>
                          {dropdownsOpen[ofertaFiltrada.id_oferta] && (
                            <div className="menu-desplegable">
                              {opcionesEstadoOferta2.map((opcion, index) => (
                                <div 
                                    key={index} 
                                    className="menu-item" 
                                    onClick={(event) => handleMenuEstadoClick(event, opcion, ofertaFiltrada.id_oferta) }
                                >
                                  {opcion}
                                </div>
                              ))}
                            </div>
                          )}     
                      </td>                      
                      
                      
                    </tr>
                ))}
              </tbody>
        </table>
        
      </div>

      <p className='postulaciones-titulo postulaciones-titulo--margin'>Prácticas finalizadas: </p>
      <div className='ofertas-tabla practicas-tabla'>
        <table cellspacing="15">
              <thead>
                  <tr>
                      <th>Práctica</th>
                      <th>Ver</th>
                      <th>Prácticantes</th>
                      <th>Estado</th>
                  </tr>
              </thead>
              <tbody>
              
                {ofertas
                  .filter(oferta => oferta.id_empresa === user.id_empresa  && oferta.estado === 'Finalizada')
                  .map((ofertaFiltrada, i) => (
                    <tr className='ofertas-tabla-datos'>
                      <td 
                        className='empresa-ofertas-departamento-oferta' 
                      >
                        {ofertaFiltrada.titulo}
                      </td>
                      <td className='oferta-icons' 
                        key={i} 
                        onClick={() => clickVer(ofertaFiltrada)}
                      >
                        <AiFillEye />
                      </td>
                      
                  
                      <td className='oferta-icons'
                        key={i} 
                        onClick={() => clickPracticantesFinalizada(ofertaFiltrada)}
                      >
                        <AiOutlineTeam />
                      </td>
                      <td className='oferta-icons oferta-estado'
                        key={i} 
                        onClick={() => clickEstado(ofertaFiltrada)}
                      >
                        {ofertaFiltrada.estado}
                        
         
                             
                      </td>                      
                      
                      
                    </tr>
                ))}
              </tbody>
        </table>
        
      </div>

      {/*Ver oferta*/}
      <Modal isOpen={abiertoVer} className='modal-practicas'>
        <div className='modal-volver'>
          <Button onClick={clickVer}>Volver</Button>
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
            {ofertaSeleccionada && ofertaSeleccionada?.tags.split(',').map((tag, index) => (
              <div className='figura' key={index}>
                <p>{tag}</p>
              </div>
              
            ))}
            </div>
            <div className='modal-descripcion'>
             <p>{ofertaSeleccionada?.descripcion}</p>
            </div>
            
            <div className='modal-publicacion'>
              <div>
                <p className='modal-publicacion-rem1'>Remuneración:{0 === ofertaSeleccionada?.remuneracion ? " No posee": " $"+ofertaSeleccionada?.remuneracion}</p>
                <p className='modal-publicacion-rem'>Ubicación: { "Remoto" === ofertaSeleccionada?.modalidad ? " Online":
                                                                ofertaSeleccionada?.calle_numero + ", "} 
                                                                {"Remoto" === ofertaSeleccionada?.modalidad ? "" : ofertaSeleccionada?.comuna + ", "}
                                                                {"Remoto" === ofertaSeleccionada?.modalidad ? "" : "Región " + ofertaSeleccionada?.region} 
                                                                </p>
                <p className='modal-publicacion-ubi'>Horario: {ofertaSeleccionada?.horario}</p>
                <p className='modal-fecha'>{fechaFormateada}</p>                           
              </div>
              
              <div className='modal-publicacion-oferta'>

                <Button>Postular a esta vacante</Button>
                
              </div>
            </div>
          </div>
          
        </ModalBody>
        </Modal>      
      {/*Editar oferta*/}
      <Modal isOpen={abiertoEditar} className='modal-practicas'>
        <div className='modal-volver'>
          <Button onClick={clickEditar}>Volver</Button>
          <img src={require(`../imagenes/nyxbich2.png`)} alt='' className='img-bichnx'></img>
        </div>
        <ModalBody>
          <div className='modal-contenido modal-ofertas'>
            <h1 className='modal-contenido-titulo'>Modificar oferta ({ofertaSeleccionada ? ofertaSeleccionada.titulo : ''})</h1>
            
            <form className="form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={ofertaSeleccionada?.titulo}
                  className="form-usuario"
                  onChange={(e) => setTitulo(e.target.value)}
                  value={titulo}
                />
                <p className='form-usuario-abajo'>Titulo</p>
                <select 
                    id="departamento"
                    onChange={(e) => setDepartamentoBack(e.target.value)}
                >
                    <option value="">{ofertaSeleccionada?.departamento}</option>
                    {departamento
                        .filter(departamento => departamento.id_empresa === user.id_empresa && departamento.nombre !== ofertaSeleccionada?.departamento)
                        .map((departamento, index) => (
                            <option key={index} value={departamento.nombre}>
                                {departamento.nombre}
                            </option>
                    ))}
                </select>
                <p className='form-usuario-abajo'>Departamento</p>
                <input
                  type="text"
                  placeholder={ofertaSeleccionada?.tags}
                  className="form-usuario"
                  onChange={(e) => setTags(e.target.value)}
                  value={tags}
                />
                <p className='form-usuario-abajo'>Tags</p>
                <textarea
                  
                  placeholder={ofertaSeleccionada?.descripcion}
                  className="form-usuario form-textarea"
                  onChange={(e) => setDescripcion(e.target.value)}
                  value={descripcion}
                />
                <p className='form-usuario-abajo'>Descripción</p>
                <input
                  type="number"
                  placeholder={ofertaSeleccionada?.remuneracion}
                  className="form-usuario"
                  onChange={(e) => setRemuneracion(e.target.value)}
                  value={remuneracion}
                />
                <p className='form-usuario-abajo'>Remuneración</p>
                <select
                  id="departamento"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                >
                  {/* Mostrar el horario actual */}
                  {ofertaSeleccionada?.horario && <option value={ofertaSeleccionada.horario}>{ofertaSeleccionada.horario}</option>}

                  {/* Mostrar los otros horarios */}
                  {ofertaSeleccionada?.horario !== 'Full-Time' && <option value="Full-Time">Full-time</option>}
                  {ofertaSeleccionada?.horario !== 'Part-Time' && <option value="Part-Time">Part-time</option>}
                  {ofertaSeleccionada?.horario !== 'Flexible' && <option value="Flexible">Flexible</option>}
                </select>
                <p className='form-usuario-abajo'>Horario</p>
                <select id="departamento"  onChange={(e) => setModalidad(e.target.value)}>
                  <option>{ofertaSeleccionada?.modalidad}</option>
                  {ofertaSeleccionada?.modalidad === 'Presencial' ? <option>Remoto</option> : <option>Presencial</option>}

                </select>
                <p className='form-usuario-abajo'>Modalidad</p>
                {modalidad === 'Presencial' && (
                  <>
                    <input
                      type="text"
                      placeholder={ofertaSeleccionada?.calle_numero}
                      className="form-usuario"
                      // ... otros props aquí
                    />
                    <p className='form-usuario-abajo'>Calle y número</p>

                    <input
                      type="text"
                      placeholder={ofertaSeleccionada?.region}
                      className="form-usuario"
                      // ... otros props aquí
                    />
                    <p className='form-usuario-abajo'>Región</p>

                    <input
                      type="text"
                      placeholder={ofertaSeleccionada?.comuna}
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

      {/*Postulantes oferta*/}
      <Modal isOpen={abiertoPostulantes} className='modal-practicas'>
        <div className='modal-volver'>
          <Button onClick={clickPostulantes}>Volver</Button>
          <img src={require(`../imagenes/nyxbich2.png`)} alt='' className='img-bichnx'></img>
        </div>
        <ModalBody>
          <div className='modal-contenido modal-ofertas modal-practicantes'>
            <h1 className='modal-contenido-titulo'>Postulantes ({ofertaSeleccionada ? ofertaSeleccionada.titulo : ''})</h1>
            <div className='ofertas-tabla practicas-tabla'>
              <table cellspacing="15">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th className='tabla-estado--padding'>Estado</th>
                        
                    </tr>
                </thead>
                <tbody>
                {postulaciones
                    .filter(postulacion=> postulacion.id_oferta === ofertaSeleccionada?.id_oferta)
                    .map((postulacionFiltrada, i) => (
                      <tr className='ofertas-tabla-datos'>
                        <td 
                          className='empresa-ofertas-departamento-oferta' 
                        >
                          {estudiantes
                            .find(estudiante => estudiante.id_estudiante === postulacionFiltrada.id_estudiante)
                            ?.nombre
                          }
                         <a href={`/estudiantes/?id=${postulacionFiltrada.id_estudiante}`} className='postulacion-ver'>
                              <AiFillEye />
                            </a>
                          
                        </td>
                        
                       
                        <td className='oferta-icons oferta-estado tabla-estado--padding'
                          
                        >
                          {postulacionFiltrada.estado}
                          <AiFillEdit className='oferta-estado--margin' onClick={() => toggleDropdown(postulacionFiltrada.id_postulacion)}/>
                            {dropdownsOpen[postulacionFiltrada.id_postulacion] && (
                              <div className="menu-desplegable">
                                {opcionesMenu.map((opcion, index) => (
                                  <div 
                                      key={index} 
                                      className="menu-item" 
                                      onClick={(event) => handleMenuClick(event, opcion, postulacionFiltrada.id_postulacion) }
                                  >
                                    {opcion}
                                  </div>
                                ))}
                              </div>
                            )}     
                        </td>                    
                        
                        
                      </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </ModalBody>
        </Modal>  
                 
      {/*Prácticantes oferta*/}
      <Modal isOpen={abiertoPracticantes} className='modal-practicas'>
              <div className='modal-volver'>
                <Button onClick={clickPracticantes}>Volver</Button>
                <img src={require(`../imagenes/nyxbich2.png`)} alt='' className='img-bichnx'></img>
              </div>
              <ModalBody>
                <div className='modal-contenido modal-ofertas modal-practicantes'>
                  <h1 className='modal-contenido-titulo modal-contenido-titulo-practicantes'>Prácticantes ({ofertaSeleccionada ? ofertaSeleccionada.titulo : ''})</h1>
                  <div className='ofertas-tabla practicas-tabla'>
                    <table cellspacing="15">
                        <thead>
                            <tr>
                                <th >Nombre</th>
                                <th >Eliminar</th>
                            </tr>
                        </thead>
                          <tbody> 
                            {postulaciones
                              .filter(postulacion=> postulacion.id_oferta === ofertaSeleccionada?.id_oferta)
                              .map((postulacionFiltrada, i) => (
                                <tr className='ofertas-tabla-datos'>
                                  <td 
                                    className='empresa-ofertas-departamento-oferta' 
                                  >
                                    {estudiantes
                                      .find(estudiante => estudiante.id_estudiante === postulacionFiltrada.id_estudiante)
                                      ?.nombre
                                    }
                                    <a href={`/estudiantes/?id=${postulacionFiltrada.id_estudiante}`} className='postulacion-ver'>
                                      <AiFillEye />
                                    </a>
                                    
                                  </td>
                                  
                                
                                  <td className='oferta-icons icons-delete' onClick={() => clickEliminarPracticante(postulacionFiltrada)}>
                                    <AiFillDelete />
                                  </td>                                                                             
                                </tr>
                            ))}
                          </tbody>
                          
                    </table>
                   
                  </div>
                  <p className='oferta-agregar-estudiante' onClick={toggleAgregarEstudiante}>Agregar estudiante <AiOutlineUserAdd /></p>
                </div>
              </ModalBody>
      </Modal>  
      {/*Prácticantes oferta finalizada*/}
      <Modal isOpen={abiertoPracticantesFinalizada} className='modal-practicas'>
              <div className='modal-volver'>
                <Button onClick={clickPracticantesFinalizada}>Volver</Button>
                <img src={require(`../imagenes/nyxbich2.png`)} alt='' className='img-bichnx'></img>
              </div>
              <ModalBody>
                <div className='modal-contenido modal-ofertas modal-practicantes'>
                  <h1 className='modal-contenido-titulo'>Prácticantes ({ofertaSeleccionada ? ofertaSeleccionada.titulo : ''})</h1>
                  <div className='ofertas-tabla practicas-tabla'>
                    <table cellspacing="15">
                      <thead>
                          <tr>
                              <th >Nombre</th>
                          </tr>
                      </thead>
                        <tbody> 
                          
                          {postulaciones
                            .filter(postulacion=> postulacion.id_oferta === ofertaSeleccionada?.id_oferta)
                            .map((postulacionFiltrada, i) => (
                              <tr className='ofertas-tabla-datos'>
                              
                                    <td 
                                      className='empresa-ofertas-departamento-oferta' 
                                    >
                                      {estudiantes
                                        .find(estudiante => estudiante.id_estudiante === postulacionFiltrada.id_estudiante)
                                        ?.nombre
                                      }
                                      
                                    <a href={`/estudiantes/?id=${postulacionFiltrada.id_estudiante}`} className='postulacion-ver'>
                                      <AiFillEye />
                                    </a>
                                    
                                    </td>
                                    
                                  
                              </tr>
                          ))}

                        </tbody>
                    </table>
                    
                  </div>
                </div>
              </ModalBody>
      </Modal>      
      <Modal isOpen={abiertoAgregarEstudiante} toggle={toggleAgregarEstudiante} className='modal-practicas'>
        <div className='modal-volver'>
          <Button onClick={toggleAgregarEstudiante}>Volver</Button>

        </div>
        <ModalBody>
          <div className='modal-contenido modal-ofertas modal-practicantes'>
            <Form className='modal-agregar-form'>
                <FormGroup className='modal-agregar-formgroup'>
                    <Label for="rutEstudiante" className='modal-agregar-titulo'>RUT del Estudiante:</Label>
                    <Input
                        className='buscar-resultados-barra-inputBusqueda modal-agregar-titulo modal-agregar-input'
                        type="text"
                        name="rut"
                        id="rutEstudiante"
                        placeholder="Ingrese RUT"
                        value={rutEstudiante}
                        onChange={handleChange}
                      
                    />
                </FormGroup>
                <Button className='modal-agregar-boton' onClick={agregarEstudiante}>Agregar</Button>
            </Form>
          </div>
        </ModalBody>
    </Modal>

    </div>
    
  );
}

export default Ofertas;
