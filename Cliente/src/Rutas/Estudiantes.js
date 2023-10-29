import '../styles/Estudiantes.css';
import Navbar from '../componentes/Navbar';
import PerfilEstudiante from '../componentes/PerfilEstudiante';

function Estudiante() {

  return (
    <div className='estudiante'>
      <Navbar />
      <PerfilEstudiante />
    </div>
  );
}

export default Estudiante;