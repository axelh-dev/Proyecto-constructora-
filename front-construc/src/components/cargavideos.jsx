import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ComponenteA = ({ proyectoID, updateCounter }) => {
  const [proyectos, setProyectos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null); // Referencia al elemento de video en el fondo

  const fetchProyectos = async () => {
    try {
      const archivosEndpoint = `http://localhost:8000/api/proyectosfv/${proyectoID}`;
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
      {proyectos.map((pkP) => (
        <div key={pkP.id} className="card" onClick={() => openModal(pkP.uploadedFile)}>
          <video width="100%" height="auto" controls ref={videoRef}>
            <source src={"http://localhost:8000/"+pkP.uploadedFile} type="video/mp4" />
            Tu navegador no soporta el tag de video.
          </video>
        </div>
      ))}

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
