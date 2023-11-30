import '../styles/CrearOferta.css';
import '../styles/DepartamentosCrear.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import swal from 'sweetalert';
import {Button, Modal, ModalBody, ModalHeader,Form, FormGroup, Label, Input} from 'reactstrap';
import { AiFillEye, AiFillEdit, AiOutlineTeam, AiFillDelete, AiFillStar, AiOutlineUserAdd } from 'react-icons/ai';

function DepartamentosCrear() {
  const { user } = useUser();
  const [departamentos,setDepartamentos] = useState([]);;
  const [nombre, setNombre] = useState('');
  const [nombreCambiar, setNombreCambiar] = useState('');
  const [nombreAntiguo, setNombreAntiguo] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [departamentoEditar, setDepartamentoEditar] = useState(null);

  const handleEdit = (departamento) => {
    swal({
      title: "Atención",
      text: "Cambiar el nombre del departamento trasladará todas las ofertas asociadas al nuevo nombre.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willEdit) => {
      if (willEdit) {
        setNombreCambiar(departamento.nombre)
        setNombreAntiguo(departamento.nombre)
        setDepartamentoEditar(departamento);
        setModalOpen(true);
      }
    });
  };



  // Función para cerrar el modal
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  // Función para actualizar el departamento
  const actualizarDepartamento = async (e) => {
    e.preventDefault();
    try {
      const datosActualizados = {
        nombre: nombreCambiar,
        nombreAntiguo: nombreAntiguo
      };
      
      const response = await fetch(`http://localhost:5000/api/departamentos/actualizar/${departamentoEditar.id_departamentos}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el departamento');
      }

      const data = await response.json();
      setDepartamentos(departamentos.map(dep => 
        dep.id_departamentos === departamentoEditar.id_departamentos ? { ...dep, nombre: nombreCambiar} : dep
      ));

      swal("Departamento actualizado correctamente", { icon: "success" });
      toggleModal();
    } catch (error) {
      console.error("error");
      swal("Error al actualizar el departamento", { icon: "error" });
    }
  };
  const handleDelete = async (id) => {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, todas las ofertas de este departamento serán movidas al departamento 'Otro'.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await fetch(`http://localhost:5000/api/departamentos/eliminar/${id}`, {
            method: 'DELETE',
          });
  
          if (!response.ok) {
            throw new Error('Error al eliminar el departamento');
          }
  
          // Aquí asumimos que el backend devuelve un booleano que indica si se creó 'Otro'
          const { otroCreado, departamentoOtro, ofertaOtro  } = await response.json(); 
          if(ofertaOtro){
            swal("¡No puedes eliminar departamento 'Otro' si existe una oferta dentro!", { icon: "error" });
            return;
          }
          // Actualizar el estado de departamentos
          setDepartamentos((prevDepartamentos) => {
            const updatedDepartamentos = prevDepartamentos.filter(dep => dep.id_departamentos !== id);
            if (otroCreado && departamentoOtro) {
              // Asumimos que sabes el id_empresa del departamento 'Otro'
              updatedDepartamentos.push({ id_departamentos: departamentoOtro.id_departamentos, nombre: departamentoOtro.nombre, id_empresa: departamentoOtro.id_empresa });
            }
            return updatedDepartamentos;
          });
  
          swal("Departamento eliminado correctamente", { icon: "success" });
        } catch (error) {
          console.error("error");
          swal("Error al eliminar el departamento", { icon: "error" });
        }
      }
    });
  };
  
  

  useEffect(() => {
    fetch('http://localhost:5000/api/departamentos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        return response.json();
      })
      .then((departamentos) => {
        setDepartamentos(departamentos);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // Primero, verificar si ya existe un departamento con ese nombre
      const responseCheck = await fetch(`http://localhost:5000/api/departamentos/check/${nombre}`);
      const existeDepartamento = await responseCheck.json();
      
      if (existeDepartamento.existe) {
        swal("Error", "Ya existe un departamento con ese nombre.", "error");
        return;
      }
  
      // Crear un objeto con los datos del formulario
      const datosDepartamento = {
        nombre,
        id_empresa: user?.id_empresa
      };
  
      const response = await fetch('http://localhost:5000/api/departamentos/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosDepartamento),
      });
  
      if (!response.ok) {
        throw new Error('Error al registrar el departamento');
      }
      const data = await response.json();
      if (data.departamento){
        setDepartamentos(prevDepartamentos => [...prevDepartamentos, data.departamento]);
      } 
  
      swal("Éxito", "Departamento creado correctamente", "success");
      
    } catch (error) {
      console.error("error");
      swal("Error", "Hubo un problema al crear el departamento", "error");
    }
  };
  

  return (
    <div className="sesion-todo departamentos-todo">
      <div className="sesion-contenedor">
        <p className='sesion-titulo'>Crear departamento</p>
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Nombre"
            className="form-usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <p className='form-usuario-abajo'>Nombre</p>
          
          
          <div className='form-usuario-abajo-abajo'>
            <button type="submit" className="form-boton">
              Crear departamento
            </button>
            <div className='form-usuario-abajo-cosas'>   
              
            </div>
          </div>
        
        </form>
      </div>
      <div>
        <p className='sesion-titulo titulo-departamentos'>Departamentos actuales</p>
        <div className='ofertas-tabla practicas-tabla'>
          <table cellspacing="15">
                <thead>
                    <tr>
                        <th>Departamento</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                
                  {departamentos
                    .filter(departamento => departamento.id_empresa === user.id_empresa)
                    .map((departamentoFiltrado, i) => (
                      <tr className='ofertas-tabla-datos'>
                        <td 
                          className='empresa-ofertas-departamento-oferta oferta-tabla' 
                        >
                          {departamentoFiltrado.nombre}
                        </td>
                        
                        <td className='oferta-icons'
                          key={i} 
                          onClick={() => handleEdit(departamentoFiltrado)}
                        >
                         
                          <AiFillEdit />
                        </td>
                                          
                        
                        <td className='oferta-icons'
                          key={i} 
                          onClick={() => handleDelete(departamentoFiltrado.id_departamentos)}
                        >
                          <AiFillDelete />
                        </td>
                      </tr>
                  ))}
                </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={modalOpen} toggle={toggleModal} className='modal-practicas'>
        <div className='modal-volver'>
          <Button onClick={toggleModal}>Volver</Button>
        </div>
        <ModalBody>
          <div className='modal-contenido modal-ofertas modal-practicantes'>
            <Form onSubmit={actualizarDepartamento} className='modal-agregar-form'>
              <FormGroup className='modal-agregar-formgroup'>
                <Label for="nombreDepartamento" className='modal-agregar-titulo'>Nuevo Nombre</Label>
                <Input
                  className='buscar-resultados-barra-inputBusqueda modal-agregar-titulo modal-agregar-input'
                  type="text"
                  name="nombre"
                  id="nombreDepartamento"
                  placeholder="Ingrese el nuevo nombre"
                  value={nombreCambiar}
                  onChange={(e) => setNombreCambiar(e.target.value)}
                />
              </FormGroup>
              <Button className='modal-agregar-boton' type="submit">Guardar Cambios</Button>
            </Form>
          </div>
        </ModalBody>
      </Modal>
    </div>
    
  );
}

export default DepartamentosCrear;