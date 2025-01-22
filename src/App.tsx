import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import BookList from "./components/BookList";
import BookDetails from "./components/BookDetails";
import BookForm from "./components/BookFormCreate";
import SearchBooks from "./components/SearchBooks";
import UpdateBookForm from "./components/BookFormUpdate";

function App() {
  const [token, setToken] = useState(null);

  // Al montar el componente, recuperar el token del localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Función para guardar el token en el localStorage cuando el usuario inicie sesión
  const handleSetToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  return (
    <>
      {token && <Navbar />}
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login setToken={handleSetToken} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute token={token}>
                <BookList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:id"
            element={
              <ProtectedRoute token={token}>
                <BookDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute token={token}>
                <BookForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute token={token}>
                <UpdateBookForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute token={token}>
                <SearchBooks />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
