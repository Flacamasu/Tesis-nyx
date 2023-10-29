import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Buscar from './Rutas/Buscar';
import Empresas from './Rutas/Empresas';
import Sesion from './Rutas/Sesion';
import Registro from './Rutas/Registro';
import OfertasCrear from './Rutas/OfertasCrear';
import OfertasModificar from './Rutas/OfertasModificar';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './componentes/UserContext';
import EmpresasModificar from './Rutas/EmpresasModificar';
import Estudiantes from './Rutas/Estudiantes';
import EstudiantesModificar from './Rutas/EstudiantesModificar';
import Postulaciones from './Rutas/Postulaciones';
//import EstudiantesModificar from './componentes/EstudiantesModificar'; <Route path="/estudiantes/modificar" element={<EstudiantesModificar/>} />
window.initMap = function() {
  // Por ahora, no necesitas hacer nada aquí, a menos que quieras inicializar un mapa.
  console.log("Google Maps API ha sido inicializada.");
};
ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/buscar" element={<Buscar/>} />
          <Route path="/empresas" element={<Empresas/>} />
          <Route path="/empresas/modificar" element={<EmpresasModificar/>} />
          <Route path="/sesion" element={<Sesion/>} />
          <Route path="/sesion/registro" element={<Registro/>} />
          <Route path="/ofertas/crear" element={<OfertasCrear/>} />
          <Route path="/ofertas/modificar" element={<OfertasModificar/>} />
          <Route path="/estudiantes" element={<Estudiantes/>} />
          <Route path="/estudiantes/postulaciones" element={<Postulaciones/>} />
          <Route path="/estudiantes/modificar" element={<EstudiantesModificar/>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();