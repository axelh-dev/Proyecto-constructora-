import React, { useEffect, useState } from "react";
import "../Estilos/photosvideos.scss";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import icon from "../assets/icon.svg";

const ComponenteB = ({ proyectoID, updateCounter }) => {
  const [proyectos, setProyectos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProyectos = async () => {
    try {
      const archivosEndpoint = `http://localhost:8000/api/proyectosfp/${proyectoID}`;
      const archivosResponse = await axios.get(archivosEndpoint);
      const archivos = archivosResponse.data;
      setProyectos(archivos);
    } catch (error) {
      console.error("Error al obtener la lista de proyectos", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/photos/${id}/`);
      console.log(`Elemento con ID ${id} eliminado exitosamente.`);
      setProyectos((prevProyectos) => prevProyectos.filter((proyecto) => proyecto.id !== id));
    } catch (error) {
      console.error(`Error al eliminar el elemento con ID ${id}`, error);
    }
    closeModal(); // Cierra el modal después de eliminar
  };

  useEffect(() => {
    fetchProyectos();
  }, [proyectoID, updateCounter]);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="proyectos-container container-fluid">
      {proyectos.map((pkP) => (
        <div key={pkP.id} className="card" style={{ position: "relative" }}>
          <img
            src={`http://localhost:8000/${pkP.uploadedFile}`}
            alt={pkP.name}
            onClick={() => openModal(pkP.uploadedFile)}
            className="mb-2"
          />
          <NavDropdown
            id="dropdown-basic-button"
            title={<img src={icon} alt="Icon" />} // Usa el ícono importado
            className="menu-carfa"
            style={{
              position: "absolute",
              bottom: 0,
              left: "180px",
              margin: "10px",
            }}
          >
            <Dropdown.Item onClick={() => handleDelete(pkP.id)}>
              Eliminar
            </Dropdown.Item>
          </NavDropdown>
        </div>
      ))}
      {selectedImage && (
        <Modal show={true} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Imagen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={`http://localhost:8000/${selectedImage}`}
              alt={`Imagen de ${selectedImage}`}
              width="100%"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ComponenteB;
