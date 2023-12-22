import React from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Estilos/ProyectosAdmin.scss';
import logo from '../assets/logo.svg';

const ProyectosAdmin = (props) => {
  const location = useLocation();
  const { role, usuario, municipio } = location.state || {};

  return (
    <>
      <Navbar className="ColorPanel" expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/admin">
            <img src={logo} alt="Logo" className="logoImage" />
          </Navbar.Brand>
          <p6>Nog.{'202021'}</p6>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className='Barra'>          
            <Nav className="me-auto NavbarLinks">
              <NavDropdown title="Visualizar" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Fotos</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Videos</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Subir Archivo" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Subir Fotos</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Subir Videos</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className='Datosesquina'>
        <p style={{ margin: 0 }}>CONSTRUCTORA LA UNION</p>
        <p style={{ margin: '0 auto', textAlign: 'center' }}>
          KM. 72.5, RUTA AL ATLANTICO ALDEA CASAS VIEJAS GUASTATOYA,
        </p>
        <p style={{ margin: 0 }}>EL PROGRESO TEL. 3091-9731</p>
      </div>
    </>
  );
};

export default ProyectosAdmin;



