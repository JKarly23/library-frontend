import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BookInterface } from "../interfaces/book.interface";

function BookList() {
  const [books, setBooks] = useState<BookInterface[]>([]);
  const token = localStorage.getItem("token");  // Asegúrate de que el token esté guardado en el localStorage o un estado global
  console.log(token);
  
  useEffect(() => {
    if (token) {
      axios
        .get("https://library-api-ee6k.onrender.com/books/", {
          headers: {
            Authorization: `Bearer ${token}`,  // Envía el token en las cabeceras
          },
        })
        .then((response) => setBooks(response.data))
        .catch((error) => console.error(error));
    } else {
      console.error("No token found.");
    }
  }, [token]);

  const deleteBook = (id: number) => {
    if (token) {
      axios
        .delete(`https://library-api-ee6k.onrender.com/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Envía el token para eliminar
          },
        })
        .then(() => setBooks(books.filter((book) => book.id !== id)))
        .catch((error) => console.error(error));
    } else {
      console.error("No token found.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Book List</h1>
      <div className="d-flex justify-content-between mb-3 flex-column flex-sm-row">
        <Link to="/add" className="btn btn-success w-100 w-sm-auto mb-2 mb-sm-0">
          Add New Book
        </Link>
      </div>
      <ul className="list-group">
        {books.map((book) => (
          <li
            key={book.id}
            className="list-group-item d-flex justify-content-between align-items-center mb-2"
          >
            <span>{book.titulo}</span>
            <div>
              <Link className="btn btn-primary btn-sm me-2" to={`/books/${book.id}`}>
                Details
              </Link>
              <Link className="btn btn-secondary btn-sm me-2" to={`/edit/${book.id}`}>
                Edit
              </Link>
              <button className="btn btn-danger btn-sm" onClick={() => deleteBook(book.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
