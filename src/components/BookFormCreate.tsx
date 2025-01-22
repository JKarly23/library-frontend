import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BookForm() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const [precio, setPrecio] = useState<number | string>(""); // Para permitir números
  const [stock, setStock] = useState<number | string>(""); // Para permitir números
  const [categoria, setCategoria] = useState(""); // Cambié a string para almacenar el nombre de la categoría
  const [categories, setCategories] = useState<any[]>([]); // Para almacenar las categorías
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Obtener categorías desde el backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please login.");
      return;
    }

    axios
      .get("https://library-api-ee6k.onrender.com/books/get/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        setError("Error fetching categories. Please try again.");
        console.error(err);
      });
  }, []);

  // Manejar el cambio en el precio
  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrecio(value ? parseFloat(value) : 0); // Asegúrate de que sea un número
  };

  // Manejar el cambio en el stock
  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStock(value ? parseInt(value, 10) : 0); // Asegurar que sea un número entero
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized! Please login.");
      return;
    }

    // Verificar que precio y stock sean números
    if (isNaN(Number(precio)) || isNaN(Number(stock))) {
      setError("Precio y Stock deben ser números.");
      return;
  }

    try {
      await axios.post(
        "https://library-api-ee6k.onrender.com/books/",
        { titulo, autor, fechaPublicacion, precio, stock, categoria }, // Ahora se envía el nombre de la categoría
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/"); // Redirigir después de crear el libro
    } catch (err: any) {
      setError("Error creating book. Please try again.");
      console.error(err.response?.data); // Verifica el error detallado aquí
    }
  };

  return (
    <div>
      <h2>Create New Book</h2>
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
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
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
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
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
            value={fechaPublicacion}
            onChange={(e) => setFechaPublicacion(e.target.value)}
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
            value={precio}
            onChange={handlePrecioChange}
            min="0"
            required
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
            value={stock}
            onChange={handleStockChange}
            min="0"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">
            Category
          </label>
          <select
            className="form-control"
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)} // Cambié a nombre de la categoría
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.nombre}> {/* Usando el nombre de la categoría */}
                {category.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Book
        </button>
      </form>
    </div>
  );
}

export default BookForm;
