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

const PageProyectos = (props) => {
  const location = useLocation();
  const { usuario, municipio, role, municipioName } = location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [proyectos, setProyectos] = useState([]);
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [nogProyecto, setNogProyecto] = useState("");
  const [fechaProyecto, setFechaProyecto] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Proyectos en ${municipioName}`;
    fetchProyectos();
  }, [municipio]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const fetchProyectos = async () => {
    try {
      const endPoint = "http://localhost:8000/api/municipalidadf/" + municipio;
      const response = await axios.get(endPoint);
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de proyectos", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGuardarProyecto = async () => {
    try {
      const endpoint = "http://127.0.0.1:8000/api/v1/projects/";
      const response = await axios.post(endpoint, {
        name: nombreProyecto,
        nog: nogProyecto,
        date: fechaProyecto,
        munici_id: municipio,
      });

      if (response.status === 201) {
        console.log("Proyecto creado exitosamente");
        setProyectos((prevProyectos) => {
          const newArray = Array.isArray(prevProyectos) ? [...prevProyectos] : [];
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

  const handleCerrarSesion = async () => {
    try {
      const endpoint = "http://127.0.0.1:8000/api/logout/";
      await axios.post(endpoint);

      // Redirige a la página de inicio de sesión u otra página después de cerrar sesión
      // Puedes ajustar la ruta según tus necesidades
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
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
                <a className="text-capitalize mx-2 fw-bold">{municipioName}</a>
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
      <div className="content-pro">
        <div className="Titulo">
          <p>LISTA DE PROYECTOS</p>
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
                          municipio: proyecto.munici_id,
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

