import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Estilos/PageFYV.scss';
import logo from '../assets/logo.svg';

const AdminPage = (props) => {
  const location = useLocation();
  const { usuario, municipio, role, municipioName } = location.state || {};

  console.log(location.state);
  console.log(usuario)
  console.log(municipio)
  console.log(municipioName)
  console.log(role)
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Navbar expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="/admin">
            <img src={logo} alt="Logo" className="logoImage" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto NavbarLinks">
              <h5>{usuario}</h5>
            </Nav>
            <Nav className="ms-auto">
              <Button variant="primary" className="AgregarProyectoButton" onClick={handleOpenModal}>
                Crear Municipalidad
              </Button>
              <Button variant="primary" className="AgregarProyectoButton" onClick={handleOpenModal}>
                Visualizar +
              </Button>
              <Button variant="danger" className="CerrarSesionButton">
                Cerrar Sesión
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className='Titulo'>
        <p>LISTA DE MUNICIPIOS</p>
      </div>

      <div className='Datosesquina'>
        <p style={{ margin: 0 }}>CONSTRUCTORA LA UNION</p>
        <p style={{ margin: '0 auto', textAlign: 'center' }}>
          KM. 72.5, RUTA AL ATLANTICO ALDEA CASAS VIEJAS GUASTATOYA,
        </p>
        <p style={{ margin: 0 }}>EL PROGRESO TEL. 3091-9731</p>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
  <Modal.Header closeButton>
    <Modal.Title className='VentanaEmer1'>Subir Archivo</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className='VentanaEmer'>
      <h5>Subir archivo</h5>
      <div className="mb-3">
        <select className="form-select" id="tipoArchivo">
          <option value="imagen">Imagen</option>
          <option value="video">Video</option>
        </select>
      </div>
    </div>

    <div className='VentanaEmer'>
      <h5>Seleccione archivo a subir</h5>
      <div className="mb-3">
        <input type="file" className="form-control" id="seleccionarArchivo" accept="image/*, video/*" />
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Cerrar
    </Button>
    <Button variant="primary" onClick={handleCloseModal}>
      Subir Archivo
    </Button>
  </Modal.Footer>
</Modal>
    </>
  );
};

export default AdminPage;
