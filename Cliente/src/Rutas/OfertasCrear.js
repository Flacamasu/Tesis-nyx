import '../styles/Empresas.css';
import Navbar from '../componentes/Navbar';
import CrearOferta from '../componentes/CrearOferta';
function OfertasCrear() {

  return (
    <div className='empresas'>
      <Navbar />
      <CrearOferta />
    </div>
  );
}

export default OfertasCrear;