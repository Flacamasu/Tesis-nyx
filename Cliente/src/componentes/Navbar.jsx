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
    window.location.reload();
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
        </div>

        <div className='opciones-navegar'>
          <li className='opcion-navegar opcion-navegar--borde opcion-navegar-registro'>
        
          {user ? (
            
            <Dropdown isOpen={dropdown} toggle={abrirCerrarDropDown}>
              <DropdownToggle>
                <p className='opcion-navegar-nombre'>{user.nombre}</p>
              </DropdownToggle>
              <DropdownMenu>
              {tipoUsuario === 'empresa' ? (
                <>
                  <DropdownItem><a href={`/empresas/?id=${user.id_empresa}`}>Ver perfil</a></DropdownItem>
                  <DropdownItem><a href="/empresas/modificar">Modificar perfil</a></DropdownItem>
                  <DropdownItem><a href="/ofertas/crear">Crear oferta</a></DropdownItem>
                  <DropdownItem><a href="/ofertas/modificar">Modificar ofertas</a></DropdownItem>
                  <DropdownItem onClick={cerrarSesion}>Cerrar sesión</DropdownItem>
                </>
              ) : 
              <>
                  <DropdownItem><a href={`/estudiantes/?id=${user.id_estudiante}`}>Ver perfil</a></DropdownItem>
                  <DropdownItem><a href="/estudiantes/modificar">Modificar perfil</a></DropdownItem>
                  <DropdownItem><a href={`/estudiantes/postulaciones/?id=${user.id_estudiante}`}>Ver postulaciones</a></DropdownItem>
                  <DropdownItem><a href={`/estudiantes/postulaciones/guardadas/?id=${user.id_estudiante}`}>Ver postulaciones guardadas</a></DropdownItem>
                  <DropdownItem onClick={cerrarSesion}>Cerrar sesión</DropdownItem>
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