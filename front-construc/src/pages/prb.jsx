import React, { useState } from 'react';
import ComponenteA from '../components/cargaphotos';
import ComponenteB from '../components/cargavideos';

const PageFYV = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('imagenes');
  const [proyectoID, setProyectoID] = useState(15); // Puedes establecer el ID del proyecto según tus necesidades

  const cambiarOpcion = (nuevaOpcion) => {
    setOpcionSeleccionada(nuevaOpcion);
  };

  return (
    <div>
      <h1>PageFYV</h1>
      <div>
        <button onClick={() => cambiarOpcion('imagenes')}>Mostrar Imágenes</button>
        <button onClick={() => cambiarOpcion('videos')}>Mostrar Videos</button>
      </div>
      {opcionSeleccionada === 'imagenes' && <ComponenteA proyectoID={proyectoID} />}
      {opcionSeleccionada === 'videos' && <ComponenteB proyectoID={proyectoID} />}
    </div>
  );
};

export default PageFYV;
