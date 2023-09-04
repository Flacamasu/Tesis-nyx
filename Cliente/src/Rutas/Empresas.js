import '../styles/Empresas.css';
import Navbar from '../componentes/Navbar';
import PerfilEmpresa from '../componentes/PerfilEmpresa';

function Empresas() {

  return (
    <div className='empresas'>
      <Navbar />
      <PerfilEmpresa />
    </div>
  );
}

export default Empresas;