import '../styles/Estudiantes.css';
import Navbar from '../componentes/Navbar';
import EstudianteModificar  from '../componentes/EstudianteModificar';

function EstudiantesModificar() {

  return (
    <div className='estudiante'>
      <Navbar />
      <EstudianteModificar />
    </div>
  );
}

export default EstudiantesModificar;