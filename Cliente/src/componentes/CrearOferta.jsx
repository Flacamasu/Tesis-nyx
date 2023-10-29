import '../styles/CrearOferta.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';

function CrearOferta() {
  const { user } = useUser();
  const [empresas, setEmpresas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [puntuacion, setPuntuacion] = useState('');
  const [tags, setTags] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [remuneracion, setRemuneracion] = useState('');
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
      // Crear un objeto con los datos del formulario
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
          <input
            type="text"
            placeholder="Descripcion"
            className="form-usuario"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
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
          
          <div className='form-usuario-abajo-abajo'>
            <button type="submit" className="form-boton">
              Crear Oferta
            </button>
            <div className='form-usuario-abajo-cosas'>
              
              <p>¿Ya tienes una cuenta? <a href='/sesion'>Inicia sesión aquí</a></p>
            </div>
          </div>
        
        </form>
      </div>
    </div>
  );
}

export default CrearOferta;