import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './componentes/Navbar';
import BusquedaInicio from './componentes/BusquedaInicio';

function App() {

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
    
    <div className="App">
      <Navbar />
      <BusquedaInicio data = {data}/>
    </div>
  );
}

export default App;
