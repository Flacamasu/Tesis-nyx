import { useState } from 'react';
import '../styles/Navbar.css';
import { useUser } from './UserContext';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import '../styles/custom-bootstrap.css';

function Navbar(props) {
  const { user } = useUser();
  const [dropdown, setDropdown]=useState(false);
  const tipoUsuario = localStorage.getItem('tUsuario');

  const abrirCerrarDropDown = () => {
    setDropdown(!dropdown);
  }
  const cerrarSesion = () => {
    localStorage.removeItem('usuario');  
    window.location.href = 'http://localhost:3000'; // Reemplaza con la URL a la que deseas redirigir al usuario
 
  }
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
          <li className='opcion-navegar opcion-navegar-estudiantes'>
            <a href="/empresas"><p>Estudiantes</p></a>
          </li>
        </div>

        <div className='opciones-navegar'>
          <li className='opcion-navegar opcion-navegar--borde opcion-navegar-registro'>
        
          {user ? (
            
            <Dropdown isOpen={dropdown} toggle={abrirCerrarDropDown}>
              <DropdownToggle>
                <p className='opcion-navegar-nombre'>{user.nombre}</p>
              </DropdownToggle>
              <DropdownMenu className= 'opcion-navegar-menu'>
              {tipoUsuario === 'empresa' ? (
                <>
                  <a href={`/empresas/?id=${user.id_empresa}`}><DropdownItem className='opcion-navegar-opciones'>Ver perfil</DropdownItem></a>
                  <a href="/empresas/modificar"><DropdownItem className='opcion-navegar-opciones'>Modificar perfil</DropdownItem></a>
                  <a href="/empresas/modificar"><DropdownItem className='opcion-navegar-opciones'>Ver departamentos</DropdownItem></a>
                  <a href="/ofertas/crear"><DropdownItem className='opcion-navegar-opciones'>Crear oferta</DropdownItem></a>
                  <a href="/ofertas/modificar"><DropdownItem className='opcion-navegar-opciones'>Ver/Modificar ofertas</DropdownItem></a>
                  <DropdownItem className='opcion-navegar-opciones' onClick={cerrarSesion}>Cerrar sesión</DropdownItem>
                </>
              ) : 
              <>
                  <a href={`/estudiantes/?id=${user.id_estudiante}`}><DropdownItem className='opcion-navegar-opciones'>Ver perfil</DropdownItem></a>
                  <a href="/estudiantes/modificar"><DropdownItem className='opcion-navegar-opciones'>Modificar perfil</DropdownItem></a>
                  <a href={`/estudiantes/postulaciones/?id=${user.id_estudiante}`}><DropdownItem className='opcion-navegar-opciones'>Ver postulaciones</DropdownItem></a>
                  <DropdownItem className='opcion-navegar-opciones' onClick={cerrarSesion}>Cerrar sesión</DropdownItem>
                </>}  
              </DropdownMenu>
            </Dropdown>
          ) : (
            <a href="/sesion" className='opcion-navegar-sesion'><p>Inicia sesión</p></a>
          )}
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