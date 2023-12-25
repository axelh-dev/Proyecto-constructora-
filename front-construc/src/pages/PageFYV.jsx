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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PageFYV = (props) => {
  const location = useLocation();
  const { usuario, municipio, role, Muni_id, proyectoID, nog } =
    location.state || {};

  const [showModal, setShowModal] = useState(false);
  const [proyectos, setProyectos] = useState([]);
  const [tipoArchivo, setTipoProyecto] = useState("Fotos");
  const [archivoProyecto, setArchivoProyecto] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

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
      if (tipoArchivo === "Fotos" || tipoArchivo === "Videos") {
        const endpointPrefix =
          tipoArchivo === "Fotos" ? "proyectosfp" : "proyectosfv";
        const archivosEndpoint = `http://localhost:8000/api/${endpointPrefix}/${proyectoID}/`;

        const archivosResponse = await axios.get(archivosEndpoint);

        const esFotos = tipoArchivo === "Fotos";
        const archivos = archivosResponse.data;

        setProyectos(archivos);

        console.log(`Información de ${esFotos ? "fotos" : "videos"}:`, archivos);
      } else {
        console.error(
          "Tipo de archivo no válido. Debe ser 'Fotos' o 'Videos'."
        );
      }
    } catch (error) {
      console.error("Error al obtener la lista de proyectos", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setArchivoSeleccionado(null);
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

      if (response.status === 201) {
        console.log("Archivo creado exitosamente");
        fetchProyectos();
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

              <Button type="submit border" onClick={handleOpenModal}>
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
          <div className="proyectos-container">
            {proyectos && proyectos.length > 0 ? (
              proyectos.map((proyecto) => (
                <div key={proyecto.project_id} className="proyecto-card border">
                  <p>Nombre: {proyecto.name}</p>
                  <p>NOG: {nog}</p>
                  <p>Fecha: {proyecto.date}</p>

                  {tipoArchivo === "Fotos" && (
                    <>
                      <img
                        src={proyecto.uploadedFile}
                        alt={`Imagen de ${proyecto.name}`}
                        width="200"
                        height="200"
                      />
                      <div className="d-flex justify-content-around">
                        <Button
                          variant="primary"
                          onClick={() => setArchivoSeleccionado(proyecto)}
                        >
                          Ver Imagen
                        </Button>
                      </div>
                    </>
                  )}

                  {tipoArchivo === "Videos" && (
                    <>
                      <video width="200" height="200" controls>
                        <source
                          src={proyecto.uploadedFile}
                          type="video/mp4"
                        />
                        Tu navegador no soporta el tag de video.
                      </video>
                      <div className="d-flex justify-content-around">
                        <Button
                          variant="primary"
                          onClick={() => setArchivoSeleccionado(proyecto)}
                        >
                          Ver Video
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>
                {tipoArchivo === "Fotos"
                  ? "No hay imágenes disponibles"
                  : "No hay videos disponibles"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal para mostrar la imagen o el video */}
      <Modal show={archivoSeleccionado !== null} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{tipoArchivo === "Fotos" ? "Imagen" : "Video"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tipoArchivo === "Fotos" && (
            <img
              src={archivoSeleccionado?.uploadedFile}
              alt={`Imagen de ${archivoSeleccionado?.name}`}
              width="100%"
            />
          )}

          {tipoArchivo === "Videos" && (
            <video width="100%" height="auto" controls>
              <source
                src={archivoSeleccionado?.uploadedFile}
                type="video/mp4"
              />
              Tu navegador no soporta el tag de video.
            </video>
          )}
        </Modal.Body>
      </Modal>

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
