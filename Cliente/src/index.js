import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Buscar from './Rutas/Buscar';
import Empresas from './Rutas/Empresas';
import Sesion from './Rutas/Sesion';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/buscar" element={<Buscar/>} />
        <Route path="/empresas" element={<Empresas/>} />
        <Route path="/sesion" element={<Sesion/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();