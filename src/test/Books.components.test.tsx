import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Necesario para Link
import axios from "axios";
import { BookInterface } from "../interfaces/book.interface";
import BookList from "../components/BookList";

jest.mock("axios");

describe("BookList Component", () => {
  const mockBooks: BookInterface[] = [
    { id: 1, titulo: "Book One", autor: "Author One", categoria: "Fiction" },
    { id: 2, titulo: "Book Two", autor: "Author Two", categoria: "Non-Fiction" },
  ];

  beforeEach(() => {
    // Simula el token en el localStorage
    localStorage.setItem("token", "mockToken");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("should render the book list and fetch books on mount", async () => {
    // Simula la respuesta de Axios
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockBooks });

    render(
      <BrowserRouter>
        <BookList />
      </BrowserRouter>
    );

    expect(screen.getByText(/Book List/i)).toBeInTheDocument();

    // Espera a que los libros se carguen
    await waitFor(() => {
      expect(screen.getByText(/Book One/i)).toBeInTheDocument();
      expect(screen.getByText(/Book Two/i)).toBeInTheDocument();
    });

    // Verifica que Axios fue llamado correctamente
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3003/books/", {
      headers: {
        Authorization: "Bearer mockToken",
      },
    });
  });

  test("should handle deleteBook and remove the book from the list", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockBooks });
    (axios.delete as jest.Mock).mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <BookList />
      </BrowserRouter>
    );

    // Espera a que los libros se carguen
    await waitFor(() => {
      expect(screen.getByText(/Book One/i)).toBeInTheDocument();
    });

    // Simula un clic en el botón de eliminar del primer libro
    const deleteButtons = screen.getAllByText(/Delete/i);
    fireEvent.click(deleteButtons[0]);

    // Espera a que Axios delete sea llamado y se elimine el libro
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("http://localhost:3003/books/1", {
        headers: {
          Authorization: "Bearer mockToken",
        },
      });

      // Verifica que el libro ya no esté en el DOM
      expect(screen.queryByText(/Book One/i)).not.toBeInTheDocument();
    });
  });

  test("should display an error when token is missing", () => {
    // Limpia el token del localStorage
    localStorage.removeItem("token");

    render(
      <BrowserRouter>
        <BookList />
      </BrowserRouter>
    );

    expect(screen.getByText(/No token found/i)).toBeInTheDocument();
  });

  test("should display an Add New Book button", () => {
    render(
      <BrowserRouter>
        <BookList />
      </BrowserRouter>
    );

    const addButton = screen.getByText(/Add New Book/i);
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveAttribute("href", "/add");
  });
});

describe('BookDetails Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mockToken');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should display loading state initially', () => {
    render(
      <BrowserRouter>
        <BookDetails />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should fetch and display book details', async () => {
    const mockBook = {
      id: 1,
      titulo: 'Mock Title',
      autor: 'Mock Author',
      fechaPublicacion: '2022-01-01',
      precio: 20,
      stock: 10,
      categoria: 'Fiction',
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockBook });

    render(
      <BrowserRouter>
        <BookDetails />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Mock Title')).toBeInTheDocument();
      expect(screen.getByText('Mock Author')).toBeInTheDocument();
      expect(screen.getByText('$20')).toBeInTheDocument();
    });
  });

  it('should display an error if no token is found', () => {
    localStorage.removeItem('token');
    render(
      <BrowserRouter>
        <BookDetails />
      </BrowserRouter>
    );

    expect(screen.getByText(/Unauthorized! Please login./i)).toBeInTheDocument();
  });

  it('should handle errors when fetching book details', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(
      <BrowserRouter>
        <BookDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error fetching book details. Please try again./i)).toBeInTheDocument();
    });
  });
});
onst mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  const setTokenMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the login form", () => {
    render(
      <BrowserRouter>
        <Login setToken={setTokenMock} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("should update username and password fields when typing", () => {
    render(
      <BrowserRouter>
        <Login setToken={setTokenMock} />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  it("should handle successful login", async () => {
    const mockToken = "mockToken123";
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { token: mockToken } });

    render(
      <BrowserRouter>
        <Login setToken={setTokenMock} />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe(mockToken);
      expect(setTokenMock).toHaveBeenCalledWith(mockToken);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should display an error message on invalid credentials", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <BrowserRouter>
        <Login setToken={setTokenMock} />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials. Please try again./i)).toBeInTheDocument();
    });
  });
});
describe("BookForm Component", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: [
        { id: 1, nombre: "Fiction" },
        { id: 2, nombre: "Non-Fiction" },
      ],
    });
  });

  test("renders the form correctly", async () => {
    render(
      <MemoryRouter>
        <BookForm />
      </MemoryRouter>
    );

    expect(screen.getByText("Create New Book")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Author")).toBeInTheDocument();
    expect(screen.getByLabelText("Publication Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
    expect(screen.getByLabelText("Stock")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();

    // Espera que las categorías se carguen
    await waitFor(() => {
      expect(screen.getByText("Fiction")).toBeInTheDocument();
      expect(screen.getByText("Non-Fiction")).toBeInTheDocument();
    });
  });

  test("shows error message if required fields are missing", async () => {
    render(
      <MemoryRouter>
        <BookForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /create book/i }));

    expect(await screen.findByText("All fields are required.")).toBeInTheDocument();
  });

  test("submits the form successfully", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { message: "Book created successfully!" } });

    render(
      <MemoryRouter>
        <BookForm />
      </MemoryRouter>
    );

    // Rellena los campos del formulario
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "My Book" } });
    fireEvent.change(screen.getByLabelText("Author"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Publication Date"), { target: { value: "2023-01-01" } });
    fireEvent.change(screen.getByLabelText("Price"), { target: { value: "19.99" } });
    fireEvent.change(screen.getByLabelText("Stock"), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "Fiction" } });

    // Envía el formulario
    fireEvent.click(screen.getByRole("button", { name: /create book/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:3003/books/",
        {
          titulo: "My Book",
          autor: "John Doe",
          fechaPublicacion: "2023-01-01",
          precio: 19.99,
          stock: 10,
          categoria: "Fiction",
        },
        expect.any(Object) // Cabeceras de la petición
      );
    });
  });

  test("shows error message on API failure", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: "Error creating book." } },
    });

    render(
      <MemoryRouter>
        <BookForm />
      </MemoryRouter>
    );

    // Rellena los campos del formulario
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "My Book" } });
    fireEvent.change(screen.getByLabelText("Author"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Publication Date"), { target: { value: "2023-01-01" } });
    fireEvent.change(screen.getByLabelText("Price"), { target: { value: "19.99" } });
    fireEvent.change(screen.getByLabelText("Stock"), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "Fiction" } });

    // Envía el formulario
    fireEvent.click(screen.getByRole("button", { name: /create book/i }));

    // Espera el mensaje de error
    expect(await screen.findByText("Error creating book.")).toBeInTheDocument();
  });
});
