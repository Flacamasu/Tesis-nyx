import React, { useEffect, useState } from 'react';
import '../styles/Buscar.css';
import Navbar from '../componentes/Navbar';
import BuscarEstudiantes1 from '../componentes/BuscarEstudiantes';

function BuscarEstudiantes() {


  


  return (
    <div className='buscar'>
      <Navbar />
      <BuscarEstudiantes1/>
    </div>
  );
}

export default BuscarEstudiantes;