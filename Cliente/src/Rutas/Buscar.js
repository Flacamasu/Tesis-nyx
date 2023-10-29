import React, { useEffect, useState } from 'react';
import '../styles/Buscar.css';
import Navbar from '../componentes/Navbar';
import BuscarPractica from '../componentes/BuscarPractica';

function Buscar() {


  


  return (
    <div className='buscar'>
      <Navbar />
      <BuscarPractica/>
    </div>
  );
}

export default Buscar;