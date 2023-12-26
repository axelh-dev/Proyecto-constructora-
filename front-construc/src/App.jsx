import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminPage from "./pages/AdminPage";
import PageFYV from "./pages/PageFYV";
import PageProyectos from "./pages/PageProyectos";
import prb from "./pages/prb";
// Componente de protección para verificar la autenticación


const App = () => {

  const [isLoggedIn, setLoggedIn] = useState(false);

  const ProtectedRoute = ({ element, isLoggedIn, ...props }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }
  
    return React.cloneElement(element, props);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/municipalidad"
          element={
            <ProtectedRoute element={<AdminPage />} isLoggedIn={isLoggedIn} />
          }
        />
        <Route
          path="/municipalidad/proyectos"
          element={
            <ProtectedRoute
              element={<PageProyectos />}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="/municipalidad/proyectos/content"
          element={
            <ProtectedRoute element={<PageFYV />} isLoggedIn={isLoggedIn} />
          }
        />
        <Route path="/" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="/prueba" element={<Login setLoggedIn={prb} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
