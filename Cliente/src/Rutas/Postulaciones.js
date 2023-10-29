import '../styles/Empresas.css';
import Navbar from '../componentes/Navbar';
import Postulacion from '../componentes/Postulaciones';
function Postulaciones() {

  return (
    <div className='empresas'>
      <Navbar />
      <Postulacion />
    </div>
  );
}

export default Postulaciones;