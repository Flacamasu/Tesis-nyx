import '../styles/BuscarPractica.css'
import { useLocation } from 'react-router-dom';

function BuscarPractica() {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const practica = params.get('practica');
  const locacion = params.get('locacion');


  return(
    <div className='buscar-todo'>
        <h1 className='buscar-practica'>Prácticas encontradas con la busqueda "{practica}"</h1>
        <div className='buscar-cuadro'>
          <div className='buscar-filtros'>
            <div className='buscar-filtros-titulo'>
              <p>Filtros</p>
              <button>Candao</button>
            </div>
            <div className='buscar-filtros-componentes buscar-filtros-ubicacion'>
              <p className='buscar-filtros-x'>X</p>
              <p className='buscar-filtros-subtitulo'>Ubicación</p>
              <input type="text" />
            </div>
            <div className='buscar-filtros-componentes buscar-filtros-remuneracion'>
              <p className='buscar-filtros-x'>X</p>
              <p className='buscar-filtros-subtitulo'>¿Remuneración?</p>
              <input type="text" placeholder='$...'/>
            </div>
            <div className='buscar-filtros-componentes buscar-filtros-puntuacion'>
              <p className='buscar-filtros-x'>X</p>
              <p className='buscar-filtros-subtitulo'>Puntuación</p>
            </div>
            <div className='buscar-filtros-componentes buscar-filtros-horario'>
              <p className='buscar-filtros-x'>X</p>
              <p className='buscar-filtros-subtitulo'>Horario</p>
            </div>
            <div className='buscar-filtros-componentes buscar-filtros-modalidad'>
              <p className='buscar-filtros-x'>X</p>
              <p className='buscar-filtros-subtitulo'>Modalidad</p>
            </div>
          </div>
          <div className='buscar-resultados'>

          </div>
        </div>
    </div>
  );
}

export default BuscarPractica;