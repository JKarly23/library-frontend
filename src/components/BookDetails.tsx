import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BookInterface } from "../interfaces/book.interface";

function BookDetails() {
  const { id } = useParams(); // Captura el ID de la URL
  const [book, setBook] = useState<BookInterface | null>(null); // Estado para almacenar los detalles del libro
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtener token del localStorage

    if (!token) {
      setError("Unauthorized! Please login.");
      return;
    }

    // Hacer la solicitud GET para obtener los detalles del libro
    axios
      .get(`https://library-api-ee6k.onrender.com/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token en las cabeceras
        },
      })
      .then((response) => setBook(response.data))
      .catch((error) => {
        setError("Error fetching book details. Please try again.");
        console.error(error);
      });
  }, [id]);

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">{book.titulo}</h1>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <p><strong>Autor:</strong> {book.autor}</p>
          <p><strong>Fecha de Publicación:</strong> {book.fechaPublicacion}</p>
          <p><strong>Precio:</strong> ${book.precio}</p>
          <p><strong>Stock:</strong> {book.stock}</p>
          <p><strong>Categoría:</strong> {book.categoria}</p>
          <button className="btn btn-secondary mt-3" onClick={() => navigate("/")}>
            Volver a la lista
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
