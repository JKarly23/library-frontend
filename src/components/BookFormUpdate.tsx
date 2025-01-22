import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    titulo: "",
    autor: "",
    fechaPublicacion: "",
    precio: "",
    stock: "",
    categoria: "",
  });
  const [categories, setCategories] = useState<any[]>([]); // Almacenar categorías
  const [error, setError] = useState("");

  // Obtener el token desde el localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized! Please login.");
      return;
    }

    // Obtener las categorías desde el backend
    axios.get("http://localhost:3003/books/get/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data); // Verifica la estructura aquí
      setCategories(response.data);
    })
    .catch((err) => {
      setError("Error fetching categories. Please try again.");
      console.error(err);
    });
  }, []); // Este useEffect se ejecuta una sola vez cuando el componente se monta

  // Obtener los detalles del libro cuando cambia el ID
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized! Please login.");
      return;
    }

    axios
      .get(`http://localhost:3003/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setBook(response.data))
      .catch((err) => {
        setError("Error fetching book details. Please try again.");
        console.error(err);
      });
  }, [id]); // Este useEffect se ejecuta cada vez que el ID cambia

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized! Please login.");
      return;
    }

    // Convertir precio y stock a números
    const precioNumber = parseFloat(book.precio);
    const stockNumber = parseInt(book.stock, 10);

    // Verificar si precio y stock son números válidos
    if (isNaN(precioNumber) || isNaN(stockNumber)) {
      setError("Price and stock must be valid numbers.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3003/books/${id}`,
        {
          titulo: book.titulo,
          autor: book.autor,
          fechaPublicacion: book.fechaPublicacion,
          precio: precioNumber, // Enviar como número
          stock: stockNumber, // Enviar como número
          categoria: book.categoria, // Enviar solo el nombre de la categoría
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/"); // Redirigir después de actualizar el libro
    } catch (err) {
      setError("Error updating book. Please try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Update Book</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            value={book.titulo}
            onChange={(e) => setBook({ ...book, titulo: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="autor" className="form-label">
            Author
          </label>
          <input
            type="text"
            className="form-control"
            id="autor"
            value={book.autor}
            onChange={(e) => setBook({ ...book, autor: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fechaPublicacion" className="form-label">
            Publication Date
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaPublicacion"
            value={book.fechaPublicacion}
            onChange={(e) => setBook({ ...book, fechaPublicacion: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="precio" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="precio"
            value={book.precio}
            onChange={(e) => setBook({ ...book, precio: e.target.value })}
            min="0"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="stock" className="form-label">
            Stock
          </label>
          <input
            type="number"
            className="form-control"
            id="stock"
            value={book.stock}
            onChange={(e) => setBook({ ...book, stock: e.target.value })}
            min="0"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">
            Category
          </label>
          <select
            className="form-control"
            id="categoria"
            value={book.categoria}
            onChange={(e) => setBook({ ...book, categoria: e.target.value })}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.nombre}> {/* Ahora enviamos el nombre de la categoría */}
                {category.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Book
        </button>
      </form>
    </div>
  );
}

export default UpdateBookForm;
