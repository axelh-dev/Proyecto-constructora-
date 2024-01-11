import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import icon from "../assets/icon.svg";
import info from "../assets/info-circle.svg";
import DialogModal from "./msgExito";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "../Estilos/PageFYV.scss";

const ComponenteA = ({ proyectoID, updateCounter1, role }) => {
  const [proyectos, setProyectos] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState({}); // Estado para el tooltip individual
  const videoRef = useRef(null); // Referencia al elemento de video

  const fetchProyectos = async () => {
    try {
      const archivosEndpoint = `http://localhost:8000/api/proyectosfv/${proyectoID}`;
      const archivosResponse = await axios.get(archivosEndpoint);
      const archivos = archivosResponse.data;

      if (Array.isArray(archivos)) {
        setProyectos(archivos);
        // Inicializar el estado del tooltip para cada video
        const tooltipState = archivos.reduce((acc, video) => {
          acc[video.id] = false;
          return acc;
        }, {});
        setTooltipVisible(tooltipState);
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
      setProyectos((prevProyectos) =>
        prevProyectos.filter((proyecto) => proyecto.id !== id)
      );
    } catch (error) {
      console.error(`Error al eliminar el video con ID ${id}`, error);
    }
  };

  const playVideo = (id) => {
    if (selectedVideoId === id && isPlaying) {
      // Si se hace clic en el video que ya se está reproduciendo, pausarlo
      setIsPlaying(false);
      videoRef.current.pause();
    } else {
      // Si se hace clic en un nuevo video, reproducirlo y actualizar el estado
      setIsPlaying(true);
      setSelectedVideoId(id);
    }
  };

  const toggleTooltip = (id) => {
    // Cambiar el estado del tooltip específico para el video con la ID proporcionada
    setTooltipVisible((prevTooltipState) => ({
      ...prevTooltipState,
      [id]: !prevTooltipState[id],
    }));
  };

  const closeTooltip = () => {
    // Cerrar todos los tooltips al hacer clic en cualquier parte de la página
    setTooltipVisible((prevTooltipState) => {
      const closedTooltips = {};
      Object.keys(prevTooltipState).forEach((key) => {
        closedTooltips[key] = false;
      });
      return closedTooltips;
    });
  };

  useEffect(() => {
    // Cerrar el tooltip cuando se hace clic en cualquier parte de la página
    document.addEventListener("click", closeTooltip);
    return () => {
      document.removeEventListener("click", closeTooltip);
    };
  }, []);

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
        <p className="colorN">No hay videos disponibles</p>
      ) : (
        proyectos.map((pkP) => (
          <div key={pkP.id} className="card" style={{ position: "relative" }}>
            <video
              width="100%"
              height="auto"
              ref={videoRef}
              controlsList="nodownload"
              controls
              muted // Silencio por defecto
              onPlay={() => playVideo(pkP.id)}
              onClick={() => playVideo(pkP.id)}
            >
              <source
                src={pkP.uploadedFile}
                type="video/mp4"
              />
              Tu navegador no soporta el tag de video.
            </video>
            {role === "admin" && (
              <Dropdown className="Dropdown-videos">
                <Dropdown.Toggle
                  className="dropdown-toggle"
                  variant="light"
                  id="dropdown-basic"
                >
                  <img
                    src={icon}
                    alt="Icon"
                    style={{ width: "25px", height: "25px" }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleDelete(pkP.id)}>
                    Eliminar
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            <OverlayTrigger
              show={tooltipVisible[pkP.id]}
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${pkP.id}`}>
                  {pkP.name}
                </Tooltip>
              }
            >
              <img
                src={info}
                alt="Información"
                style={{
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                  position: "absolute",
                  bottom: "89%", // Usa porcentajes relativos en lugar de píxeles
                  right: "89%", // Usa porcentajes relativos en lugar de píxeles
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTooltip(pkP.id);
                }}
              />
            </OverlayTrigger>
          </div>
        ))
      )}
      {selectedVideoId && <DialogModal show={showDialog} onClose={closeModal} />}
    </div>
  );
};

export default ComponenteA;
