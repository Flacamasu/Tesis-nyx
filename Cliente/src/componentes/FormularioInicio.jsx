import '../styles/FormularioInicio.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


function FormularioInicio({data}) {

  const [practica, setPractica] = useState('');
  const [locacion, setLocacion] = useState("");
  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();
    navigate(`/buscar?practica=${practica}&locacion=${locacion}`);
    // Aquí puedes colocar tu lógica para lo que sucederá cuando se presione el botón
  }

  /*<select className='barra-input barra-input-' defaultValue='pagaTrue'>
          <option value="pagaFalse">Todas</option>
          <option value="pagaTrue">Pagada</option>
        </select>
        <select className='barra-input' defaultValue={"pagaFalse"}>
          <option value="pagaFalse">5</option>
          <option value="pagaTrue">4</option>
          <option value="pagaTrue">3</option>
          <option value="pagaTrue">2</option>
          <option value="pagaTrue">1</option>
        </select>*/ 
  return(
    <div className='busqueda-contenedor-barra'>
      <div className='busqueda-barra'>
      <form >
        <input 
          className='barra-input barra-input-escribir'
          type='text'
          placeholder='Escribe aquí...' 
          value={practica}
          onChange={(e) => setPractica(e.target.value)}               
        />
        <input
          className='barra-input barra-input-ubicacion'
          type='text'
          placeholder='Ubicación'
          value={locacion}
          onChange={(e) => setLocacion(e.target.value)}
        />
        <select className='barra-input barra-input-' defaultValue='pagaTrue'>
          <option value="pagaFalse">Todas</option>
          <option value="pagaTrue">Pagada</option>
        </select>
        <select className='barra-input' defaultValue={"pagaFalse"}>
          <option value="pagaFalse">5</option>
          <option value="pagaTrue">4</option>
          <option value="pagaTrue">3</option>
          <option value="pagaTrue">2</option>
          <option value="pagaTrue">1</option>
        </select>
        
        <button className='boton-buscar' onClick={handleClick}>Buscar</button>
      </form>
      </div>
    </div>
  );
}

export default FormularioInicio;