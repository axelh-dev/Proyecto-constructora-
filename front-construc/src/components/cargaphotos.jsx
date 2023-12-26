import React, { useEffect, useState } from 'react';
import "../Estilos/photosvideos.scss";
import axios from 'axios';

const ComponenteB = ({ proyectoID, updateCounter }) => {
  const [proyectos, setProyectos] = useState([]);

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
  }, [proyectoID, updateCounter]); // Añade updateCounter a las dependencias del efecto

  return (
    <div className='proyectos-container container-fluid'>
    {proyectos.map((pkP) => (
      <div key={pkP.id} className="card ">  
        {console.log(pkP.uploadedFile)}
        <img src={"http://localhost:8000/"+pkP.uploadedFile} alt={pkP.name} className="card-img-top" />
        <div className="card-body">
          <p className="card-text">{pkP.name}</p>
        </div>
      </div>
    ))}
  </div>
  );
};

export default ComponenteB;
