import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Estilos/AdminStyles.scss";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

const AdminPage = (props) => {
  const navigate = useNavigate();

  const location = useLocation();
  const { usuario, municipio, role } = location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [municipalidades, setMunicipalidades] = useState([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [nombreMuni, setNombreMuni] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasenaUsuario, setContrasenaUsuario] = useState("");
  const [selectedMunicipioId, setSelectedMunicipioId] = useState("");
  const role_id_fija = 2;

  useEffect(() => {
    const fetchMunicipalidades = async () => {
      try {
        const endPoint = "http://localhost:8000/api/v1/municipalidades/";
        const response = await axios.get(endPoint);
        setMunicipalidades(response.data); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        console.error("Error al obtener las municipalidades", error);
      }
    };

    fetchMunicipalidades();
  }, []); // El segundo parámetro del useEffect es un array de dependencias, en este caso, vacío para que se ejecute solo una vez al montar el componente.

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGuardarMuni = async () => {
    try {
      if (!nombreMuni.trim()) {
        console.log("El campo nombreMuni está vacío");
        return;
      }

      const endPoint = "http://localhost:8000/api/v1/municipalidades/";
      const response = await axios.post(endPoint, { name: nombreMuni });

      if (response.status === 201) {
        console.log("Municipalidad creada exitosamente");
        setMunicipalidades((prevMunicipalidades) => [
          ...prevMunicipalidades,
          response.data,
        ]);
      } else {
        console.error(
          "Error al crear la municipalidad. Estado de la respuesta:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error en la solicitud POST:", error.message);
    } finally {
      // Limpiar el campo después de la solicitud, independientemente de si tiene éxito o falla
      setNombreMuni("");
    }
  };

  const handleGuardarUser = async () => {
    try {
      if (!nombreUsuario.trim() || !contrasenaUsuario.trim() || !selectedMunicipioId || !role_id_fija) {
        console.log("Los campos nombreUsuario, contrasenaUsuario, selectedMunicipioId o role_id_fija están vacíos");
        return;
      }
  
      const endPoint = "http://127.0.0.1:8000/api/register/";

      const postData = {
        username: nombreUsuario,
        password: contrasenaUsuario,
        munici_id: selectedMunicipioId,
        role_id: role_id_fija, 
      };
      const response = await axios.post(endPoint, postData);
  
      if (response.status === 201) {
        console.log("Usuario creado exitosamente");
      } else {
        console.error(
          "Error al crear el usuario. Estado de la respuesta:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error en la solicitud POST:", error.message);
    } finally {
      // Limpia los campos después de la solicitud, independientemente de si tiene éxito o falla
      setNombreUsuario("");
      setContrasenaUsuario("");
      setSelectedMunicipio("");
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
      {role === "admin" && (
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
                  Cerrar sesión
                </Button>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
      {role === "admin" && (
        <div className="content-pro">
          <div className="Titulo">
            <p>LISTA DE MUNICIPIOS</p>

            <div className="municipalidades-container">
              {municipalidades.map((muni) => (
                <div key={muni.munici_id} className="municipalidad-card border">
                  <img src={logo} alt="img_muni" />
                  <p>{muni.name}</p>
                  <button
                    type="button" 
                    className="btn btn-primary"
                    onClick={() =>
                      navigate("/user", {
                        state: {
                          usuario,
                          municipio: muni.name,
                          Muni_id: muni.munici_id,
                          role: role,
                        },
                      })
                    }
                  >
                    Ir a la Municipalidad
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="Datosesquina">
        <p style={{ margin: 0 }}>CONSTRUCTORA LA UNION</p>
        <p style={{ margin: "0 auto", textAlign: "center" }}>
          KM. 72.5, RUTA AL ATLANTICO ALDEA CASAS VIEJAS GUASTATOYA,
        </p>
        <p style={{ margin: 0 }}>EL PROGRESO TEL. 3091-9731</p>

        <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="Ventana">Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="VentanaEmer">
            <h5>Crear Municipalidad</h5>
            <div className="mb-3">
              <label htmlFor="nombreMuni" className="form-label">
                Nombre Muni:
              </label>
              <input
                type="text"
                className="form-control"
                id="nombreMuni"
                placeholder="Nombre de la municipalidad"
                value={nombreMuni}
                onChange={(e) => setNombreMuni(e.target.value)}
              />
              <Button
                variant="primary"
                className="GuardarButtonRight mt-2"
                onClick={handleGuardarMuni}
              >
                Guardar
              </Button>
            </div>
          </div>

          <div className="VentanaEmer">
            <h5>Asignar a Usuario</h5>
            <div className="mb-3">
              <label htmlFor="nombreUsuario" className="form-label">
                Nombre:
              </label>
              <input
                type="text"
                className="form-control"
                id="nombreUsuario"
                placeholder="Ingrese el nombre del usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contrasenaUsuario" className="form-label">
                Contraseña:
              </label>
              <input
                type="password"
                className="form-control"
                id="contrasenaUsuario"
                placeholder="Ingrese la contraseña del usuario"
                value={contrasenaUsuario}
                onChange={(e) => setContrasenaUsuario(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="selectMunicipalidad" className="form-label">
                Seleccionar Municipalidad:
              </label>
              <select
                className="form-select"
                id="selectMunicipalidad"
                value={selectedMunicipio}
                onChange={(e) => {
                  const selectedMuniId = municipalidades.find((muni) => muni.name === e.target.value)?.munici_id;
                  setSelectedMunicipioId(selectedMuniId || "");
                  setSelectedMunicipio(e.target.value);
                }}
              >
                <option value="" disabled>
                  Seleccionar una municipalidad
                </option>
                {municipalidades.map((muni) => (
                  <option key={muni.munici_id} value={muni.name}>
                    {muni.name}
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                className="GuardarButtonRight mt-2"
                onClick={handleGuardarUser}
              >
                Guardar
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="CerrarButton">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
              
      </Modal>
      </div>
    </>
  );
};

export default AdminPage;
