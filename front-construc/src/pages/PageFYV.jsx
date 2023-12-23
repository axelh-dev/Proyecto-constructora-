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
import logo from "../assets/logo.svg";
import carpeta from "../assets/carpeta.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PageFYV = (props) => {
  const location = useLocation();
  const { usuario, municipio, role, Muni_id, proyectoID, nog } = location.state || {};
  console.log(location.state);

  const [showModal, setShowModal] = useState(false);
  const [proyectos, setProyectos] = useState([]);
  const [tipoProyecto, setTipoProyecto] = useState("Fotos");
  const [archivoProyecto, setArchivoProyecto] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Proyectos en ${municipio}`;
    fetchProyectos();
  }, [municipio]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const fetchProyectos = async () => {
    try {
      const proyectosEndpoint = `http://localhost:8000/api/municipalidadf/${Muni_id}`;
      const proyectosResponse = await axios.get(proyectosEndpoint);
      setProyectos(proyectosResponse.data);

      if (tipoProyecto === "Fotos" || tipoProyecto === "Videos") {
        const archivosEndpoint =
          tipoProyecto === "Fotos"
            ? `http://localhost:8000/proyectosfp/${proyectoID}/`
            : `http://localhost:8000/proyectosfv/${proyectoID}/`;

        const archivosResponse = await axios.get(archivosEndpoint);

        // Aquí debes manejar la respuesta según tus necesidades.
        // Puedes almacenar la información en el estado o procesarla de alguna manera.
        console.log("Información de archivos:", archivosResponse.data);
      }
    } catch (error) {
      console.error("Error al obtener la lista de proyectos", error);
    }
  };


  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGuardarArchivo = async () => {
    try {
      console.log("Archivo seleccionado:", archivoProyecto.name);

      let endpoint = "";
      let formData = new FormData();

      if (tipoProyecto === "Fotos") {
        endpoint = "http://127.0.0.1:8000/api/v1/photos/";
        formData.append("project_id", proyectoID);
        formData.append("name", archivoProyecto.name);
        formData.append("uploadedFile", archivoProyecto);
      } else if (tipoProyecto === "Videos") {
        endpoint = "http://127.0.0.1:8000/api/v1/videos/";
        formData.append("project_id", proyectoID);
        formData.append("name", archivoProyecto.name);
        formData.append("uploadedFile", archivoProyecto);
      }

      const response = await axios.post(endpoint, formData);

      if (response.status === 201) {
        console.log("Archivo creado exitosamente");
      } else {
        console.error(
          "Error al crear el archivo. Estado de la respuesta:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error en la solicitud POST:", error.message);
    } finally {
      setTipoProyecto("Fotos");
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
              <NavDropdown title="Visualizar" id="basic-nav-dropdown">
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
              <Button type="submit border" onClick={handleOpenModal}>
                Cerrar sesion
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="content-pro">
        <div className="Titulo">
          {tipoProyecto === "Fotos" && <p>Vista de Imágenes</p>}
          {tipoProyecto === "Videos" && <p>Vista de Videos</p>}
          <div className="proyectos-container">
            {proyectos && proyectos.length > 0 ? (
              proyectos.map((proyecto) => (
                <div key={proyecto.project_id} className="proyecto-card border">
                  <img
                    src={carpeta}
                    width="200"
                    height="200"
                    className="d-inline-block align-top"
                    alt="Logo Constructora"
                  />
                  <p>Nombre: {proyecto.name}</p>
                  <p>NOG: {proyecto.nog}</p>
                  <p>Fecha: {proyecto.date}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      navigate("/proyects", {
                        state: {
                          usuario,
                          municipio,
                          proyectoID: proyecto.project_id,
                          role: role,
                          nog: proyecto.nog,
                          proyecto: proyecto.name,
                        },
                      })
                    }
                  >
                    Ir a la Proyecto
                  </button>
                </div>
              ))
            ) : (
              <p>
                {tipoProyecto === "Fotos"
                  ? "No hay imágenes disponibles"
                  : "No hay videos disponibles"}
              </p>
            )}
          </div>
        </div>
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
                value={tipoProyecto}
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
