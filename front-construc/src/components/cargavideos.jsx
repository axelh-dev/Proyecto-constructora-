import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import icon from "../assets/icon.svg";

const ComponenteA = ({ proyectoID, updateCounter1, role }) => {
  const [proyectos, setProyectos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null); // Referencia al elemento de video en el fondo


  console.log(role)
  const fetchProyectos = async () => {
    try {
      const archivosEndpoint = `http://localhost:8000/api/proyectosfv/${proyectoID}`;
      const archivosResponse = await axios.get(archivosEndpoint);
      const archivos = archivosResponse.data;

      if (Array.isArray(archivos)) {
        setProyectos(archivos);
      } else {
        console.error("La respuesta de la API no es un array:", archivos);
        setProyectos([]); // Establecer un array vacío como valor predeterminado
      }
    } catch (error) {
      console.error("Error al obtener la lista de proyectos", error);
    }
  };

  const handleDelete = async (id) => {


    try {
      await axios.delete(`http://localhost:8000/api/v1/videos/${id}/`);
      console.log(`Video con ID ${id} eliminado exitosamente.`);
      setProyectos((prevProyectos) => prevProyectos.filter((proyecto) => proyecto.id !== id));
    } catch (error) {
      console.error(`Error al eliminar el video con ID ${id}`, error);
    }
    closeModal(); // Cierra el modal después de eliminar
  };

  useEffect(() => {
    fetchProyectos();
  }, [proyectoID, updateCounter1]);

  const openModal = (video) => {
    setSelectedVideo(video);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const closeModal = () => {
    setSelectedVideo(null);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="proyectos-container container-fluid">
      {proyectos.length === 0 ? (
        <p>No hay videos disponibles</p>
      ) : (
        proyectos.map((pkP) => (
          <div key={pkP.id} className="card" >
            <video width="100%" height="auto" ref={videoRef} onClick={() => openModal(pkP.uploadedFile)}>
              <source src={`http://localhost:8000/${pkP.uploadedFile}`} type="video/mp4" />
              Tu navegador no soporta el tag de video.
            </video>
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
        ))
      )}

      {selectedVideo && (
        <Modal show={true} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Video</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <video width="100%" height="auto" controls>
              <source src={`http://localhost:8000/${selectedVideo}`} type="video/mp4" />
              Tu navegador no soporta el tag de video.
            </video>
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

export default ComponenteA;
