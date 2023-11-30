import '../styles/Empresas.css';
import Navbar from '../componentes/Navbar';
import DepartamentosCrear from '../componentes/DepartamentosCrear';

function Departamentos() {

  return (
    <div className='empresas'>
      <Navbar />
      <DepartamentosCrear />
    </div>
  );
}

export default Departamentos;