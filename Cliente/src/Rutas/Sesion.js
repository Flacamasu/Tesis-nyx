import '../styles/Empresas.css';
import Navbar from '../componentes/Navbar';
import PantallaSesion from '../componentes/PantallaSesion';
import PerfilEmpresa from '../componentes/PerfilEmpresa';
function Sesion() {

  return (
    <div className='empresas'>
      <Navbar />
      <PantallaSesion />
    </div>
  );
}

export default Sesion;