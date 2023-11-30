import '../styles/CrearOferta.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import Swal from 'sweetalert2';

function CrearOferta() {
  const { user } = useUser();
  const [empresas, setEmpresas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [puntuacion, setPuntuacion] = useState('');
  const [tags, setTags] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [remuneracion, setRemuneracion] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [horario, setHorario] = useState('');
  const [calleNumero, setCalleNumero] = useState('');
  const [comuna, setComuna] = useState('');
  const [region, setRegion] = useState('');
  const [fecha, setFecha] = useState('');
  const [id_empresa, setId_empresa] = useState('');
  const [empresa, setEmpresa] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/departamentos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        return response.json();
      })
      .then((departamentos) => {
        setEmpresas(departamentos);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (user) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setFecha(formattedDate);
      setId_empresa(user.id_empresa);
      setEmpresa(user.nombre);
      setPuntuacion(user.puntuacion_total);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      if(modalidad){
        if((calleNumero && comuna && region) || modalidad === 'Remoto'){
          const datosOferta = {
                  id_empresa,
                  titulo,
                  empresa, 
                  puntuacion,
                  departamento,
                  tags,
                  descripcion,
                  remuneracion,
                  fecha,
                  horario,
                  modalidad,
                  calleNumero,
                  comuna,
                  region
                };
                
                const response = await fetch('http://localhost:5000/api/ofertas/agregar', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(datosOferta),
                });
                
                if (!response.ok) {
                  throw new Error('Error al registrar la oferta');
                }
                Swal.fire({
                  title: '¡Se creo la oferta con éxito!',
                  icon: 'success',

                  confirmButtonColor: '#3085d6',

                  confirmButtonText: 'Ok',

                })
                .then(() => {
                  window.location.href = 'http://localhost:3000/ofertas/modificar'; // Reemplaza con la URL a la que deseas redirigir al usuario
                });
        } else {
          Swal.fire({
            title: '¡Debes colocar la dirección!',
            icon: 'error',

            confirmButtonColor: '#3085d6',

            confirmButtonText: 'Ok',

          });
        }
      }

      
    
    } catch (error) {
      console.error("error");
    }
  };

  return (
    <div className="sesion-todo">
      <div className="sesion-contenedor">
        <p className='sesion-titulo'>Crear oferta de práctica profesional</p>
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Titulo"
            className="form-usuario"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <p className='form-usuario-abajo'>Titulo</p>
          
          <select id="departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
            <option value="">--Selecciona departamento--</option>
            {empresas
              .filter(departamento => departamento.id_empresa === user.id_empresa)
              .map((departamento, index) => (
              <option key={index} value={departamento.nombre}>
                {departamento.nombre}
              </option>
            ))}
          </select>
          <p className='form-usuario-abajo'>Departamento</p>
          <input
            type="text"
            placeholder="Tags"
            className="form-usuario"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <p className='form-usuario-abajo'>Tags</p>
          <textarea
                  
            placeholder="Descripción"
            className="form-usuario form-textarea"
            onChange={(e) => setDescripcion(e.target.value)}
            value={descripcion}
          />
          <p className='form-usuario-abajo'>Descripción</p>
          <input
            type="number"
            placeholder="Remuneración"
            className="form-usuario"
            value={remuneracion}
            onChange={(e) => setRemuneracion(e.target.value)}
          />
          <p className='form-usuario-abajo'>Remuneración</p>

          <select
            id="departamento"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          >
            <option value="">--Selecciona horario--</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Flexible">Flexible</option>
          </select>
          <p className='form-usuario-abajo'>Horario</p>

          <select
            id="departamento"
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value)}
          >
            <option value="">--Selecciona modalidad--</option>
            <option value="Presencial">Presencial</option>
            <option value="Remoto">Remoto</option>
          </select>
          <p className='form-usuario-abajo'>Modalidad</p>
          
          {modalidad === 'Presencial' && (
            <>
              <input
                type="text"
                placeholder="Calle y número"
                className="form-usuario"
                value={calleNumero}
                onChange={(e) => setCalleNumero(e.target.value)}
              />
              <p className='form-usuario-abajo'>Calle y número</p>
              <input
                type="text"
                placeholder="Comuna"
                className="form-usuario"
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
              />
              <p className='form-usuario-abajo'>Comuna</p>
              <input
                type="text"
                placeholder="Región"
                className="form-usuario"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
              <p className='form-usuario-abajo'>Región</p>
            </>
          )}


          <div className='form-usuario-abajo-abajo'>
            <button type="submit" className="form-boton">
              Crear Oferta
            </button>
            <div className='form-usuario-abajo-cosas'>
              
              
            </div>
          </div>
        
        </form>
      </div>
    </div>
  );
}

export default CrearOferta;