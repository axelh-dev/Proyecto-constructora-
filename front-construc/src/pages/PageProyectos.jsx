import React, { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Estilos/PageProyectos.scss";
import logo from "../assets/logo.svg";

const PageProyectos = (props) => {
  const location = useLocation();
  const { usuario, municipio, role } = location.state || {};
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    document.title = `Proyectos en ${municipio}`;

  }, [municipio]);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
              <Button type="submit border" onClick={handleOpenModal}>
                Cerrar sesion
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="content-pro">
        <div className="Titulo">
          <p>LISTA DE PROYECTOS</p>

        </div>
      </div>

      <div className="Datosesquina">
        <p style={{ margin: 0 }}>CONSTRUCTORA LA UNION</p>
        <p style={{ margin: "0 auto", textAlign: "center" }}>
          KM. 72.5, RUTA AL ATLANTICO ALDEA CASAS VIEJAS GUASTATOYA,
        </p>
        <p style={{ margin: 0 }}>EL PROGRESO TEL. 3091-9731</p>
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
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaProyecto" className="form-label">
                Fecha:
              </label>
              <input type="date" className="form-control" id="fechaProyecto" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PageProyectos;
