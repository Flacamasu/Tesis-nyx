import '../styles/Navbar.css'

function Navbar(props) {
  return(
    
    <div className="navbar-contenedor">
      <div className='navbar-logo'>
        <a href="/"><h1>Nyx</h1></a>
      </div>

      <div className='navbar-opciones'>

        <div className='opciones-navegar'>
          <li className='opcion-navegar'>
            <p>Buscar</p>
          </li>
          <li className='opcion-navegar'>
            <p>Empresas</p>
          </li>
        </div>

        <div className='opciones-navegar'>
          <li className='opcion-navegar opcion-navegar--borde'>
            <p>Registrate</p>
          </li>
          <li className='opcion-navegar opcion-navegar--borde'>
            <img src={require(`../imagenes/unab.png`)} alt='unab' className='img-unab'/>
          </li>
        </div>

      </div>
    </div>
  );
}

export default Navbar;