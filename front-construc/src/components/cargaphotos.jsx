import React, { useEffect, useState } from 'react';
import "../Estilos/photosvideos.scss";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'; // Asegúrate de tener el componente Modal de Bootstrap
import Button from 'react-bootstrap/Button';

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
    <div className='proyectos-container container-fluid'>
      {proyectos.map((pkP) => (
        <div key={pkP.id} className="card" onClick={() => openModal(pkP.uploadedFile)}>
          <img src={"http://localhost:8000/"+pkP.uploadedFile} alt={pkP.name} className="card-img-top" />
          <div className="card-body">
            <p className="card-text">{pkP.name}</p>
          </div>
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
