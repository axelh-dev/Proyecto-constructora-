import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import icon from "../assets/icon.svg";
import DialogModal from "./msgExito";

const ComponenteA = ({ proyectoID, updateCounter1, role }) => {
  const [proyectos, setProyectos] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const videoRefs = useRef({}); // Referencias a los elementos de video

  const fetchProyectos = async () => {
    try {
      const archivosEndpoint = `http://localhost:8000/api/proyectosfv/${proyectoID}`;
      const archivosResponse = await axios.get(archivosEndpoint);
      const archivos = archivosResponse.data;

      if (Array.isArray(archivos)) {
        setProyectos(archivos);
      } else {
        console.error("La respuesta de la API no es un array:", archivos);
        setProyectos([]);
      }
    } catch (error) {
      console.error("Error al obtener la lista de proyectos", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/videos/${id}/`);
      setSelectedVideoId(id); // Almacena la ID del video eliminado
      setShowDialog(true);
      setProyectos((prevProyectos) => prevProyectos.filter((proyecto) => proyecto.id !== id));
    } catch (error) {
      console.error(`Error al eliminar el video con ID ${id}`, error);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, [proyectoID, updateCounter1]);

  const closeModal = () => {
    setShowDialog(false);
    setSelectedVideoId(null); // Restablece la ID del video seleccionado
  };

  return (
    <div className="proyectos-container container-fluid">
      {proyectos.length === 0 ? (
        <p>No hay videos disponibles</p>
      ) : (
        proyectos.map((pkP) => (
          <div key={pkP.id} className="card">
            <video
              width="100%"
              height="auto"
              ref={(el) => (videoRefs.current[pkP.id] = el)}
              controls
              muted // Silencio por defecto
            >
              <source src={`http://localhost:8000/${pkP.uploadedFile}`} type="video/mp4" />
              Tu navegador no soporta el tag de video.
            </video>
            {role === "admin" && (
              <NavDropdown
                id="dropdown-basic-button"
                title={<img src={icon} alt="Icon" />} // Usa el ícono importado
                className="menu-carfa"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "80%",
                  margin: "10px",
                }}
              >
                <Dropdown.Item onClick={() => handleDelete(pkP.id)}>
                  Eliminar
                </Dropdown.Item>
              </NavDropdown>
            )}
          </div>
        ))
      )}
      {selectedVideoId && (
        <DialogModal show={showDialog} onClose={closeModal} />
      )}
    </div>
  );
};

export default ComponenteA;
