import '../styles/BusquedaInicio.css'
import FormularioInicio from '../componentes/FormularioInicio';

function BusquedaInicio({data}) {
  return(
    <div className="busqueda-todo">
      <div className='busqueda-contenedor'>
        <h2 className='busqueda-pregunta'>¿Qué estás buscando?</h2>
        <FormularioInicio data = {data}/>
        <img src={require(`../imagenes/nyxbich1.png`)} alt='nyz' className='img-nyx'/>
      </div>
      <img src={require(`../imagenes/lun2.png`)} alt='' className='img-modoNocturno'></img>
      <div className='portal-empresa'>
        Portal para empresas
      </div>
    </div>    
  );
}

export default BusquedaInicio;