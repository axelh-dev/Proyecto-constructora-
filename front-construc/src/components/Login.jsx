import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Estilos/styles.scss";

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: username,
        password: password,
      });

      const userData = response.data;

      if (userData.role === "admin") {
        navigate("/municipalidad", {
          state: {
            usuario: userData.user,
            municipio: userData.municipio,
            role: userData.role,
          },
        });
      } else if (userData.role === "user") {
        navigate("/municipalidad/proyectos", {
          state: {
            usuario: userData.user,
            municipio: userData.municipio,
            role: userData.role,
            Muni_id: userData.Muni_id,
          },
        });
      }

      // Actualizar el estado de autenticación aquí
      setLoggedIn(true);
    } catch (error) {
      console.error("Error durante el inicio de sesión", error);

      if (error.response && error.response.status === 401) {
        setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      } else {
        setError(
          "Se produjo un error durante el inicio de sesión. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form>
          <label>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={handleLogin} disabled={loading}>
            {loading ? "Cargando..." : "Inicio de Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
