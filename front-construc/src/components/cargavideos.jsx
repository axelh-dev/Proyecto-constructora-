import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ComponenteA = ({ proyectoID,updateCounter }) => {
  const [proyectos, setProyectos] = useState([]);

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

  return (
    <div className='proyecto-card'>
      {proyectos.map((pkP) => (
        <div key={pkP.id} className="card">
          <video width="100%" height="auto" controls>
            <source src={"http://localhost:8000/"+pkP.uploadedFile} type="video/mp4" />
            Tu navegador no soporta el tag de video.
          </video>
          <p>{pkP.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ComponenteA;
