import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Estilos/PageProyectos.scss";
import "../Estilos/photosvideos.scss";
import logo from "../assets/logo.svg";
import axios from "axios";
import ComponenteA from '../components/cargavideos';
import ComponenteB from '../components/cargaphotos';

const PageFYV = (props) => {
  const location = useLocation();
  const { usuario, municipio, role, Muni_id, proyectoID, nog } =
    location.state || {};

  const [showModal, setShowModal] = useState(false);
  const [tipoArchivo, setTipoProyecto] = useState("Fotos");
  const [archivoProyecto, setArchivoProyecto] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [updateCounter1, setUpdateCounter1] = useState(0);


  useEffect(() => {
    document.title = `Proyectos en ${municipio}`;
  }, [municipio]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCerrarSesion = async () => {
    try {
      const endpoint = "http://127.0.0.1:8000/api/logout/";
      await axios.post(endpoint);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const handleGuardarArchivo = async () => {
    try {
      console.log("Archivo seleccionado:", archivoProyecto.name);
  
      let endpoint = "";
      let formData = new FormData();
  
      if (tipoArchivo === "Fotos") {
        endpoint = "http://127.0.0.1:8000/api/v1/photos/";
        formData.append("project_id", proyectoID);
        formData.append("name", archivoProyecto.name);
        formData.append("uploadedFile", archivoProyecto);
      } else if (tipoArchivo === "Videos") {
        endpoint = "http://127.0.0.1:8000/api/v1/videos/";
        formData.append("project_id", proyectoID);
        formData.append("name", archivoProyecto.name);
        formData.append("uploadedFile", archivoProyecto);
      }
      
      const response = await axios.post(endpoint, formData);
  
      if (tipoArchivo === "Fotos" && response.status === 201) {
        console.log("Archivo de fotos creado exitosamente");
        setUpdateCounter((prevCounter) => prevCounter + 1);
        console.log(setUpdateCounter)
      } else if (tipoArchivo === "Videos" && response.status === 201) {
        console.log("Archivo de videos creado exitosamente");
        setUpdateCounter1((prevCounter1) => prevCounter1 + 1);
        console.log(setUpdateCounter1)
      } else {
        console.error(
          "Error al crear el archivo. Estado de la respuesta:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error en la solicitud POST:", error.message);
    } finally {
      if (tipoArchivo === "Fotos") {
        setTipoProyecto("Fotos");
      } else if (tipoArchivo === "Videos") {
        setTipoProyecto("Videos");
      }
      setArchivoProyecto(null);
      setShowModal(false);
    }
  };
  

  return (
    <>
      <Navbar expand="md" bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/user">
            <img
              src={logo}
              width="100"
              className="d-inline-block align-top"
              alt="Logo Constructora"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="me-auto">
              <Navbar.Text>
                Municipalidad:{" "}
                <a className="text-capitalize mx-2 fw-bold">{municipio}</a>
              </Navbar.Text>

              <NavDropdown
                className=""
                title="Visualizar"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  href=""
                  className="btn btn-primary"
                  onClick={() => setTipoProyecto("Fotos")}
                >
                  Fotos
                </NavDropdown.Item>
                <NavDropdown.Item
                  href=""
                  className="btn btn-primary"
                  onClick={() => setTipoProyecto("Videos")}
                >
                  Videos
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Navbar.Text>
                Usuario:{" "}
                <a className="text-capitalize mx-2 fw-bold">{usuario}</a>
              </Navbar.Text>
            </Nav>
            <div className="d-flex justify-content-around ">
              {role === "admin" && (
                <Button
                  type="submit border"
                  className="mx-2"
                  onClick={handleOpenModal}
                >
                  Agregar
                </Button>
              )}

              <Button type="submit border" onClick={handleCerrarSesion}>
                Cerrar sesion
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <div className="content-pro">
        <div className="Titulo">  
          {tipoArchivo === "Fotos" && <p>Vista de Imágenes</p>}
          {tipoArchivo === "Videos" && <p>Vista de Videos</p>}
          </div>
            {tipoArchivo === "Videos" && (
              <ComponenteA proyectoID={proyectoID} updateCounter={updateCounter} />
            )}
            {tipoArchivo === "Fotos" && (
              <ComponenteB proyectoID={proyectoID}  updateCounter1={updateCounter1}/>
            )}
      </div>

      
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="VentanaEmer1">Nuevo Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="VentanaEmer">
            <h5>Datos Del Proyecto</h5>
            <div className="mb-3">
              <label htmlFor="tipoProyecto" className="form-label">
                Tipo:
              </label>
              <input
                type="text"
                className="form-control"
                id="tipoProyecto"
                value={tipoArchivo}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="archivoProyecto" className="form-label">
                Archivo:
              </label>
              <input
                type="file"
                className="form-control"
                id="archivoProyecto"
                onChange={(e) => setArchivoProyecto(e.target.files[0])}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleGuardarArchivo}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PageFYV;
