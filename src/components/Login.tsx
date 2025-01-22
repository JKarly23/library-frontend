import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginProps } from "../interfaces/login.interface";

function Login({ setToken }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://library-api-ee6k.onrender.com/auth/login", {
        username,
        password,
      });
      // Guardar el token en localStorage
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);  // Si estás usando un estado global para el token
      navigate("/");  // Redirigir a la página principal
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleLogin}
        className="w-100 w-sm-75 w-md-50 w-lg-25 p-4 shadow rounded bg-light"
        style={{
          maxWidth: "400px", // Limitar el tamaño en PC
          height: "400px", // Aseguramos que el formulario sea cuadrado
        }}
      >
        <h2 className="text-center mb-4">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
