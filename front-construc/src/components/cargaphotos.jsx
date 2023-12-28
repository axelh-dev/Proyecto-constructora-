import React, { useEffect, useState } from "react";
import "../Estilos/photosvideos.scss";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import icon from "../assets/icon.svg";
import DialogModal from "./msgExito";

const ComponenteB = ({ proyectoID, updateCounter, role }) => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const fetchProyectos = async () => {
    try {
      const archivosEndpoint = `http://localhost:8000/api/proyectosfp/${proyectoID}`;
      const archivosResponse = await axios.get(archivosEndpoint);
      const archivos = archivosResponse.data;

      if (Array.isArray(archivos)) {
        setProyectos(archivos);
      } else {
        console.error("La respuesta de la API no es un array:", archivos);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener la lista de proyectos", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/photos/${id}/`);
      setSelectedImageId(id); // Almacena la ID de la imagen eliminada
      setShowDialog(true);
      setProyectos((prevProyectos) =>
        prevProyectos.filter((proyecto) => proyecto.id !== id)
      );
    } catch (error) {
      console.error(`Error al eliminar la foto con ID ${id}`, error);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, [proyectoID, updateCounter]);

  const closeModal = () => {
    setShowDialog(false);
    setSelectedImageId(null); // Restablece la ID de la imagen seleccionada
  };

  return (
    <div className="proyectos-container container-fluid">
      {loading ? (
        <p>Cargando...</p>
      ) : Array.isArray(proyectos) && proyectos.length === 0 ? (
        <p>No hay imágenes disponibles</p>
      ) : (
        proyectos.map((pkP) => (
          <div key={pkP.id} className="card" style={{ position: "relative" }}>
            <img
              src={`http://localhost:8000/${pkP.uploadedFile}`}
              alt={pkP.name}
              onClick={() => setShowDialog(false)} // No muestra directamente el DialogModal al hacer clic
              className="mb-2"
            />
            {role === "admin" && (
              <NavDropdown
                id="dropdown-basic-button"
                title={<img src={icon} alt="Icon" />}
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
      {selectedImageId && (
        <DialogModal show={showDialog} onClose={closeModal} />
      )}
    </div>
  );
};

export default ComponenteB;
