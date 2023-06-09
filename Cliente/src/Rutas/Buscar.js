import React, { useEffect, useState } from 'react';
import '../styles/Buscar.css';
import Navbar from '../componentes/Navbar';
import BuscarPractica from '../componentes/BuscarPractica';

function Buscar() {

  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => console.log(error));
  }, []); 

  return (
    <div className='buscar'>
      <Navbar />
      <BuscarPractica/>
    </div>
  );
}

export default Buscar;