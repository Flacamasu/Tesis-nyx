import '../styles/Empresas.css';
import Navbar from '../componentes/Navbar';
import EmpresasMod from '../componentes/EmpresasMod';

function EmpresasModificar() {

  return (
    <div className='empresas'>
      <Navbar />
      <EmpresasMod />
    </div>
  );
}

export default EmpresasModificar;