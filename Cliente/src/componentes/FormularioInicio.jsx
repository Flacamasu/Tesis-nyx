import '../styles/FormularioInicio.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';

function FormularioInicio({data}) {

  const [practica, setPractica] = useState('');
  const [locacion, setLocacion] = useState("");
  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();
    navigate(`/buscar?practica=${practica}&locacion=${locacion}`);
    // Aquí puedes colocar tu lógica para lo que sucederá cuando se presione el botón
  }
  const [rating, setRating] = useState(5);

  const cambioEstrellas = (index) => {
    setRating(index + 1);
  };
  
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

        <button className='boton-buscar' onClick={handleClick}>Buscar</button>
      </form>
      </div>
    </div>
  );
}

export default FormularioInicio;