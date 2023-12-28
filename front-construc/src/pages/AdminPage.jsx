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
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import icon from "../assets/icon.svg";

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
  const [archivoProyecto, setArchivoProyecto] = useState(null);
  const role_id_fija = 2;

  useEffect(() => {
    const fetchMunicipalidades = async () => {
      try {
        const endPoint = "http://localhost:8000/api/v1/municipalidades/";
        const response = await axios.get(endPoint);
        setMunicipalidades(response.data);
      } catch (error) {
        console.error("Error al obtener las municipalidades", error);
      }
    };

    fetchMunicipalidades();
  }, []);

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

      const formData = new FormData();
      formData.append("name", nombreMuni);

      if (archivoProyecto) {
        formData.append("uploadedFile", archivoProyecto);
      }

      const endPoint = "http://localhost:8000/api/v1/municipalidades/";
      const response = await axios.post(endPoint, formData);

      if (response.status === 201) {
        console.log("Municipalidad creada exitosamente");
        setMunicipalidades((prevMunicipalidades) => [
          ...prevMunicipalidades,
          response.data,
        ]);

        // Actualizar el estado con la URL de la imagen de la municipalidad
        //setLogoMuni(response.data.uploadedFile || logo);
      } else {
        console.error(
          "Error al crear la municipalidad. Estado de la respuesta:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error en la solicitud POST:", error.message);
    } finally {
      setNombreMuni("");
      setArchivoProyecto(null);
    }
  };



  const handleGuardarUser = async () => {
    try {
      if (
        !nombreUsuario.trim() ||
        !contrasenaUsuario.trim() ||
        !selectedMunicipioId ||
        !role_id_fija
      ) {
        console.log(
          "Los campos nombreUsuario, contrasenaUsuario, selectedMunicipioId o role_id_fija están vacíos"
        );
        return;
      }

      const endPoint = "http://127.0.0.1:8000/api/register/";

      const postData = {
        username: nombreUsuario,
        password: contrasenaUsuario,
        munici_id: selectedMunicipioId,
        role_id: role_id_fija,
      };
      console.log(postData);
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

  const handleDelete = async (municipioId) => {
    // Implementa la lógica para eliminar el municipio según el municipioId
    // Esta función es llamada cuando se selecciona la opción "Eliminar"
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/v1/municipalidades/${municipioId}/`
      );
  
      if (response.status === 204) {
        console.log("Municipio eliminado exitosamente");
        // Actualiza el estado para reflejar el cambio
        setMunicipalidades((prevMunicipalidades) =>
          prevMunicipalidades.filter((muni) => muni.munici_id !== municipioId)
        );
      } else {
        console.error(
          `Error al eliminar el municipio. Estado de la respuesta: ${response.status}`
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
              src={logo} // Usar la imagen de la municipalidad si está disponible, de lo contrario, usa el logo predeterminado
              width="100"
              className="d-inline-block align-top"
              alt="Logo Constructora"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="me-auto">
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

      {role === "admin" && (
        <div className="content-pro">
          <div className="Titulo">
            <p>LISTA DE MUNICIPIOS</p>

            <div className="municipalidades-container">
              {municipalidades.map((muni) => (
                <div
                  key={muni.munici_id}
                  className="municipalidad-card border"
                  style={{ position: "relative" }}
                >
                  <img src={muni.uploadedFile === "http://localhost:8000/media/NULL" ? logo : muni.uploadedFile} alt="img_muni" />
                  <p>{muni.name}</p>
                  <NavDropdown
                    id="dropdown-basic-button"
                    title={<img src={icon} alt="Icon" />} // Usa el ícono importado
                    className="menu-carfa"
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: "80%",
                      margin: "10px",

                    }}
                  >
                    <Dropdown.Item onClick={() => handleDelete(muni.munici_id)}>
                      Eliminar
                    </Dropdown.Item>
                  </NavDropdown>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      navigate("/municipalidad/proyectos", {
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
                <div className="mb-3">
                  <label htmlFor="archivoProyecto" className="form-label">
                    Foto Muni:
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="archivoProyecto"
                    onChange={(e) => setArchivoProyecto(e.target.files[0])}
                  />
                </div>
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
                    const selectedMuniId = municipalidades.find(
                      (muni) => muni.name === e.target.value
                    )?.munici_id;
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
