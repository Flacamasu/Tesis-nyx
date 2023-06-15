import '../styles/BuscarPractica.css'
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';

import { AiFillStar,AiFillLock,AiFillUnlock,AiFillCloseSquare,AiOutlineSearch } from 'react-icons/ai';

function BuscarPractica() {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const practica = params.get('practica');

  // eslint-disable-next-line
  const locacion = params.get('locacion');

  //Aqui cambia el estado del candado
  const [isLocked, setIsLocked] = useState(false);
  const cambioCandado = () => {
    setIsLocked(!isLocked);
  };

  //Aqui cambia el estado de las X para cada area
  const [x2Ubicacion, setX2Ubicacion] = useState(false);
  const [x2Remuneracion, setX2Remuneracion] = useState(false);
  const [x2Puntuacion, setX2Puntuacion] = useState(false);
  const [x2Horario, setX2Horario] = useState(false);
  const [x2Modalidad, setX2Modalidad] = useState(false);
  
  const cambioXUbicacion = () => {
    setX2Ubicacion(!x2Ubicacion);
  };
  const cambioXRemuneracion = () => {
    setX2Remuneracion(!x2Remuneracion);
  };
  const cambioXPuntuacion = () => {
    setX2Puntuacion(!x2Puntuacion);
  };
  const cambioXHorario = () => {
    setX2Horario(!x2Horario);
  };
  const cambioXModalidad = () => {
    setX2Modalidad(!x2Modalidad);
  };

  //cambio en el valor de la remuneracion
  const [remuneracion, setRemuneracion] = useState(200000);
  const cambioRemuneracion = (e) => {
    setRemuneracion(e.target.value)
  };

  //Aqui cambia el valor de rating estrellas
  const [rating, setRating] = useState(0); 
  const cambioEstrellas = (i) => {
    setRating(i + 1);
  };

  //Aqui estan las checkbox de horario y modalidad
  const [checkedItems, setCheckedItems] = useState({
    parttime: false,
    fulltime: false,
    rotativo: false,
    remoto: false,
    presencial: false
  });
  const handleChange = (e) => {
    setCheckedItems({
      ...checkedItems,
      [e.target.name]: e.target.checked
    });
  };



  return(
    <div className='buscar-todo'>
        <h1 className='buscar-practica'>Prácticas encontradas con la busqueda "{practica}"</h1>
        <div className='buscar-cuadro'>
          <div className='buscar-filtros'>
            <div className='buscar-filtros-titulo'>
              <p>Filtros</p>
              <button onClick={cambioCandado} className='buscar-filtros-candado'>
                {isLocked ? <AiFillLock size={40} color='white' /> : <AiFillUnlock size={40} color='white' />}
              </button>
            </div>
            <div className={`buscar-filtros-componentes buscar-filtros-ubicacion ${x2Ubicacion ? 'buscar-filtros--disabled' : 'buscar-filtros--normal'}`}>
              <button onClick={cambioXUbicacion} className='buscar-filtros-boton-x'>
                <AiFillCloseSquare className='buscar-filtros-boton-x-provisional' size={25}/>
              </button>
              <p className='buscar-filtros-subtitulo'>Ubicación</p>
              <input type="text" />
            </div>
            <div className={`buscar-filtros-componentes buscar-filtros-remuneracion ${x2Remuneracion ? 'buscar-filtros--disabled' : 'buscar-filtros--normal'}`}>
              <button onClick={cambioXRemuneracion} className='buscar-filtros-boton-x'>
                <AiFillCloseSquare className='buscar-filtros-boton-x-provisional' size={25}/>
              </button>
              
              <p className='buscar-filtros-subtitulo'>¿Remuneración?</p>
              <input
                className='buscar-filtros-remuneracion-rango'
                type="range"
                min="1"
                max="1000000"
                value={remuneracion}
                id="myRange"
                onChange={cambioRemuneracion}
                disabled={cambioXRemuneracion} 
              />
              <div className='buscar-filtros-remuneracion-rango-numeros'>
                <p>0</p>
                <p>1.000.000</p>
              </div>
              <div className='buscar-filtros-remuneracion-valor'>
                <p className='aaaa'>$</p>
                <input 
                  type="number" 
                  placeholder={`...`} 
                  value={remuneracion} 
                  min="1"
                  max="1000000"
                  onChange={cambioRemuneracion} 
                  readOnly={cambioXRemuneracion}
                  className={`buscar-filtros-remuneracion-dinero`}
                />
              </div>
              
            </div>
            <div className={`buscar-filtros-componentes buscar-filtros-puntuacion ${x2Puntuacion ? 'buscar-filtros--disabled' : 'buscar-filtros--normal'}`}>
              <button onClick={cambioXPuntuacion} className='buscar-filtros-boton-x'>
                <AiFillCloseSquare className='buscar-filtros-boton-x-provisional' size={25}/>
              </button>
              <p className='buscar-filtros-subtitulo'>Puntuación</p>
              <div>
                {[...Array(5)].map((star, i) => {
                  return (
                    <AiFillStar 
                      key={i} 
                      size={30} 
                      onClick={() => cambioEstrellas(i)} 
                      color={i < rating ? "blue" : "grey"} 
                    />
                  )
                })}
              </div>
            </div>
            <div className={`buscar-filtros-componentes buscar-filtros-horario ${x2Horario ? 'buscar-filtros--disabled' : 'buscar-filtros--normal'}`}>
              <button onClick={cambioXHorario } className='buscar-filtros-boton-x'>
                <AiFillCloseSquare className='buscar-filtros-boton-x-provisional' size={25}/>
              </button>
              <p className='buscar-filtros-subtitulo'>Horario</p>
              <div className='buscar-filtros-checkboxes'>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="checkbox" 
                    name="parttime"
                    checked={checkedItems.parttime} 
                    onChange={handleChange} 
                  />
                  Part-time
                </label>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="checkbox" 
                    name="fulltime"
                    checked={checkedItems.fulltime} 
                    onChange={handleChange} 
                  />
                  Full-time
                </label>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="checkbox" 
                    name="rotativo"
                    checked={checkedItems.rotativo} 
                    onChange={handleChange} 
                  />
                  Rotativo
                </label>
              </div>
            </div>
            <div className={`buscar-filtros-componentes buscar-filtros-modalidad ${x2Modalidad ? 'buscar-filtros--disabled' : 'buscar-filtros--normal'}`}>
              <button onClick={cambioXModalidad} className='buscar-filtros-boton-x'>
                <AiFillCloseSquare className='buscar-filtros-boton-x-provisional' size={25}/>
              </button>
              <p className='buscar-filtros-subtitulo'>Modalidad</p>
              <div className='buscar-filtros-checkboxes'>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="checkbox" 
                    name="remoto"
                    checked={checkedItems.remoto} 
                    onChange={handleChange} 
                  />
                  Remoto
                </label>
                <label className='buscar-filtros-checkboxes-texto'>
                  <input 
                    type="checkbox" 
                    name="presencial"
                    checked={checkedItems.presencial} 
                    onChange={handleChange} 
                  />
                  Presencial
                </label>
              </div>
            </div>
          </div>

          <div className='buscar-resultados'>
            <div className='buscar-resultados-barra'>
              <input className='buscar-resultados-barra-inputBusqueda' type="text" />
              <select name="select" className='buscar-resultados-barra-inputOrdenar' defaultValue="">
                <option value="" disabled>Ordenar por:</option>
                <option value="value1">Mejor evaluado</option>
                <option value="value2">Más recientes</option>
                <option value="value3">Más cercanos</option>
              </select>
              <button className='buscar-resultados-barra-enviar'>Buscar<AiOutlineSearch size={40}/></button>
            </div>
            <div className='buscar-resultados-contenido'>
              <div className='buscar-resultados-contenido-cuadro'>
                <div className='buscar-resultados-contenido-cuadro-titulo'>
                  <h1>Desarrollador web | Rgb.co</h1>
                  <h1>5 star</h1>
                </div>
                <p className='buscar-resultados-contenido-cuadro-descripcion'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae tempora illo doloremque minus laudantium architecto 
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                </p>
                <div className='buscar-resultados-contenido-cuadro-etiqueta'>
                  <p>1111</p>
                  <p>2222</p>
                  <p>3333</p>
                  <p>4444</p>
                </div>
              </div>
              <div className='buscar-resultados-contenido-cuadro'>
                <div className='buscar-resultados-contenido-cuadro-titulo'>
                  <h1>Desarrollador web | Rgb.co</h1>
                  <h1>5 star</h1>
                </div>
                <p className='buscar-resultados-contenido-cuadro-descripcion'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae tempora illo doloremque minus laudantium architecto 
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                </p>
                <div className='buscar-resultados-contenido-cuadro-etiqueta'>
                  <p>1111</p>
                  <p>2222</p>
                  <p>3333</p>
                  <p>4444</p>
                </div>
              </div>
              <div className='buscar-resultados-contenido-cuadro'>
                <div className='buscar-resultados-contenido-cuadro-titulo'>
                  <h1>Desarrollador web | Rgb.co</h1>
                  <h1>5 star</h1>
                </div>
                <p className='buscar-resultados-contenido-cuadro-descripcion'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae tempora illo doloremque minus laudantium architecto 
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                </p>
                <div className='buscar-resultados-contenido-cuadro-etiqueta'>
                  <p>1111</p>
                  <p>2222</p>
                  <p>3333</p>
                  <p>4444</p>
                </div>
              </div>
              <div className='buscar-resultados-contenido-cuadro'>
                <div className='buscar-resultados-contenido-cuadro-titulo'>
                  <h1>Desarrollador web | Rgb.co</h1>
                  <h1>5 star</h1>
                </div>
                <p className='buscar-resultados-contenido-cuadro-descripcion'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae tempora illo doloremque minus laudantium architecto 
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                </p>
                <div className='buscar-resultados-contenido-cuadro-etiqueta'>
                  <p>1111</p>
                  <p>2222</p>
                  <p>3333</p>
                  <p>4444</p>
                </div>
              </div>
              <div className='buscar-resultados-contenido-cuadro'>
                <div className='buscar-resultados-contenido-cuadro-titulo'>
                  <h1>Desarrollador web | Rgb.co</h1>
                  <h1>5 star</h1>
                </div>
                <p className='buscar-resultados-contenido-cuadro-descripcion'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae tempora illo doloremque minus laudantium architecto 
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                </p>
                <div className='buscar-resultados-contenido-cuadro-etiqueta'>
                  <p>1111</p>
                  <p>2222</p>
                  <p>3333</p>
                  <p>4444</p>
                </div>
              </div>
              <div className='buscar-resultados-contenido-cuadro'>
                <div className='buscar-resultados-contenido-cuadro-titulo'>
                  <h1>Desarrollador web | Rgb.co</h1>
                  <h1>5 star</h1>
                </div>
                <p className='buscar-resultados-contenido-cuadro-descripcion'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae tempora illo doloremque minus laudantium architecto 
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                </p>
                <div className='buscar-resultados-contenido-cuadro-etiqueta'>
                  <p>1111</p>
                  <p>2222</p>
                  <p>3333</p>
                  <p>4444</p>
                </div>
              </div>
              <div className='buscar-resultados-contenido-cuadro'>
                <div className='buscar-resultados-contenido-cuadro-titulo'>
                  <h1>Desarrollador web | Rgb.co</h1>
                  <h1>5 star</h1>
                </div>
                <p className='buscar-resultados-contenido-cuadro-descripcion'>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae tempora illo doloremque minus laudantium architecto 
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                  numquam doloribus vel debitis. Cum necessitatibus provident at praesentium laboriosam hic tempore amet beatae inventore?
                </p>
                <div className='buscar-resultados-contenido-cuadro-etiqueta'>
                  <p>1111</p>
                  <p>2222</p>
                  <p>3333</p>
                  <p>4444</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default BuscarPractica;