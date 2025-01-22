import axios from "axios";
import { BookInterface } from "../interfaces/book.interface";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBooks() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"autor" | "anno" | "categoria" | null>(null);
  const [results, setResults] = useState<BookInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() === "") {
      setResults([]); // Limpiar resultados si la búsqueda está vacía
      return;
    }

    setLoading(true);
    setError(""); // Limpiar cualquier error previo

    const token = localStorage.getItem("token"); // Obtener token del localStorage

    if (!token) {
      setError("Unauthorized! Please login.");
      setLoading(false);
      return;
    }

    // Construir la query con los parámetros
    let searchParams = `?search=${encodeURIComponent(query)}&`;

    // Agregar filtro según el seleccionado
    if (filter && query.trim() !== "") {
      searchParams += `${filter}=${encodeURIComponent(query)}&`;
    }

    // Eliminar el último "&" si existe
    searchParams = searchParams.slice(0, -1);

    // Realizar la solicitud GET con los filtros
    axios
      .get(`http://localhost:3003/books${searchParams}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token en las cabeceras
        },
      })
      .then((response) => {
        setResults(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al obtener los resultados, intente nuevamente.");
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Buscar Libros</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por título, autor, etc."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-primary mt-3 w-100"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <div className="mb-3">
        <h4>Filtrar por:</h4>
        <div>
          <label className="me-2">
            <input
              type="radio"
              name="filter"
              value="autor"
              checked={filter === "autor"}
              onChange={() => setFilter("autor")}
            />
            Autor
          </label>
          <label className="me-2">
            <input
              type="radio"
              name="filter"
              value="anno"
              checked={filter === "anno"}
              onChange={() => setFilter("anno")}
            />
            Año
          </label>
          <label className="me-2">
            <input
              type="radio"
              name="filter"
              value="categoria"
              checked={filter === "categoria"}
              onChange={() => setFilter("categoria")}
            />
            Categoría
          </label>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {results.length === 0 && !loading && !error && (
        <p>No se encontraron resultados. Intente otra búsqueda.</p>
      )}

      <ul className="list-group">
        {results.map((book: BookInterface) => (
          <li key={book.id} className="list-group-item">
            <strong>{book.titulo}</strong> - {book.autor}
            <button
              className="btn btn-info btn-sm float-end"
              onClick={() => navigate(`/books/${book.id}`)}
            >
              Detalles
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBooks;
