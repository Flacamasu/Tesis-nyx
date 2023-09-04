import '../styles/Navbar.css'

function Navbar(props) {
  return(
    
    <div className="navbar-contenedor">
      <div className='navbar-logo'>
        <a href="/"><h1>Nyx</h1></a>
      </div>

      <div className='navbar-opciones'>

        <div className='opciones-navegar'>
          <li className='opcion-navegar opcion-navegar-buscar'>
          <a href="/buscar"><p>Buscar</p></a>
          </li>
          <li className='opcion-navegar opcion-navegar-empresas'>
          <a href="/empresas"><p>Empresas</p></a>
          </li>
        </div>

        <div className='opciones-navegar'>
          <li className='opcion-navegar opcion-navegar--borde opcion-navegar-registro'>
          <a href="/sesion"><p>Registrate</p></a>
          </li>
          <li className='opcion-navegar opcion-navegar--borde opcion-navegar-logo'>
            <img src={require(`../imagenes/unab.png`)} alt='unab' className='img-unab'/>
          </li>
        </div>

      </div>
    </div>
  );
}

export default Navbar;