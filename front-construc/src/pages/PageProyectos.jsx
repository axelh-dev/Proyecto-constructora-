import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Estilos/PageProyectos.scss";
import logo from "../assets/logo.svg";
import carpeta from "../assets/carpeta.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import icon from "../assets/icon.svg";
import DialogModal from "../components/msgExito"; // Importa el componente DialogModal
import SuccessMessage from "../components/alert"; // Ruta relativa al componente SuccessMessage
import "../Estilos/alert.scss";

const PageProyectos = (props) => {
  const location = useLocation();
  const { usuario, municipio, role, municipioName, Muni_id } =
    location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [proyectos, setProyectos] = useState([]);
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [nogProyecto, setNogProyecto] = useState("");
  const [fechaProyecto, setFechaProyecto] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
      const endPoint = "http://localhost:8000/api/municipalidadf/" + Muni_id;
      const response = await axios.get(endPoint);
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de proyectos", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCerrarSesion = async () => {
    try {
      const endpoint = "http://127.0.0.1:8000/api/logout/";
      await axios.post(endpoint);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const handleGuardarProyecto = async () => {
    try {
      const endpoint = "http://127.0.0.1:8000/api/v1/projects/";
      const response = await axios.post(endpoint, {
        name: nombreProyecto,
        nog: nogProyecto,
        date: fechaProyecto,
        munici_id: Muni_id,
      });

      if (response.status === 201) {
        console.log("Proyecto creado exitosamente");
        setShowSuccessMessage(true);
        setProyectos((prevProyectos) => {
          const newArray = Array.isArray(prevProyectos)
            ? [...prevProyectos]
            : [];
          newArray.push(response.data);
          return newArray;
        });
      } else {
        console.error(
          "Error al crear el proyecto. Estado de la respuesta:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error en la solicitud POST:", error.message);
    } finally {
      setNombreProyecto("");
      setNogProyecto("");
      setFechaProyecto("");
      setShowModal(false);
    }
  };

  const handleDelete = async (proyectoId) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/v1/projects/${proyectoId}/`
      );

      if (response.status === 204) {
        console.log("Proyecto eliminado exitosamente");
        setSelectedProjectId(proyectoId);
        setShowDialog(true);
        setProyectos((prevProyectos) =>
          prevProyectos.filter((proyecto) => proyecto.project_id !== proyectoId)
        );
      } else {
        console.error(
          `Error al eliminar el proyecto. Estado de la respuesta: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error en la solicitud DELETE:", error.message);
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
              <Button type="submit border" onClick={handleCerrarSesion}>
                Cerrar sesion
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showSuccessMessage && (
        <SuccessMessage
          show={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
          message="Se ha creado el proyecto exitosamente."
        />
      )}
      {selectedProjectId && (
        <DialogModal show={showDialog} onClose={() => setShowDialog(false)} />
      )}
      <div className="content-pro">
        <div className="Titulo">
          <p className="titulo-1">LISTA DE PROYECTOS</p>
          <div className="proyectos-container">
            {proyectos && proyectos.length > 0 ? (
              proyectos.map((proyecto) => (
                <div
                  key={proyecto.project_id}
                  className="proyecto-card border"
                  style={{ position: "relative" }}
                >
                  <img
                    src={carpeta}
                    width="200"
                    height="200"
                    className="d-inline-block align-top"
                    alt="Logo Constructora"
                  />
                  <div className="container-pro">
                    <p className="item-pro">Nombre: {proyecto.name}</p>
                    <p className="item-pro">NOG: {proyecto.nog}</p>
                    <p className="item-pro">Fecha: {proyecto.date}</p>
                  </div>
                  {role === "admin" && (
                    <NavDropdown
                      id="dropdown-basic-button"
                      title={<img src={icon} alt="Icon" />} // Usa el ícono importado
                      className="menu-carfa"
                      style={{
                        width:"20px",
                        position: "absolute",
                        bottom: "0px",
                        left: "80%",
                        margin: "10px",
                      }}
                    >
                      <Dropdown.Item
                        onClick={() => handleDelete(proyecto.project_id)}
                      >
                        Eliminar
                      </Dropdown.Item>
                    </NavDropdown>
                  )}
                  
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      navigate("/municipalidad/proyectos/content", {
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
                    Ir al Proyecto
                  </button>
                </div>
              ))
            ) : (
              <p>No hay proyectos disponibles</p>
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
              <label htmlFor="nombreProyecto" className="form-label">
                Nombre:
              </label>
              <input
                type="text"
                className="form-control"
                id="nombreProyecto"
                placeholder="Ingrese el nombre del proyecto"
                value={nombreProyecto}
                onChange={(e) => setNombreProyecto(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nogProyecto" className="form-label">
                NOG:
              </label>
              <input
                type="text"
                className="form-control"
                id="nogProyecto"
                placeholder="Ingrese el NOG del proyecto"
                value={nogProyecto}
                onChange={(e) => setNogProyecto(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaProyecto" className="form-label">
                Fecha:
              </label>
              <input
                type="date"
                className="form-control"
                id="fechaProyecto"
                value={fechaProyecto}
                onChange={(e) => setFechaProyecto(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleGuardarProyecto}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PageProyectos;
