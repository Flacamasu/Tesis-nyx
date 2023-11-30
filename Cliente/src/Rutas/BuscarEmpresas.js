import React, { useEffect, useState } from 'react';
import '../styles/Buscar.css';
import Navbar from '../componentes/Navbar';
import BuscarEmpresas1 from '../componentes/BuscarEmpresas';

function BuscarEmpresas() {


  


  return (
    <div className='buscar'>
      <Navbar />
      <BuscarEmpresas1/>
    </div>
  );
}

export default BuscarEmpresas;