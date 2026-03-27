import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

// Leer datos
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return [];
  }
};

// Escribir datos
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(err);
  }
};

// Ruta base
app.get("/", (req, res) => {
  res.send("Bienvenido a mi API de libros 📚");
});

// Obtener todos los libros
app.get("/books", (req, res) => {
  const data = readData();
  res.json(data);
});

// Obtener libro por ID
app.get("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);

  const book = data.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({ mensaje: "Libro no encontrado" });
  }

  res.json(book);
});

// Crear libro
app.post("/books", (req, res) => {
  const data = readData();
  const body = req.body;

  if (!body.titulo || !body.autor || !body.precio) {
    return res.status(400).json({
      message: "Faltan campos: titulo, autor o precio",
    });
  }

  const newBook = {
    id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
    ...body,
  };

  data.push(newBook);
  writeData(data);

  res.status(201).json(newBook);
});

// Actualizar libro
app.put("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const body = req.body;

  const bookIndex = data.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  data[bookIndex] = {
    ...data[bookIndex],
    ...body,
  };

  writeData(data);

  res.json({
    message: "Libro actualizado correctamente",
    book: data[bookIndex],
  });
});

// Eliminar libro
app.delete("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);

  const bookIndex = data.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  const deletedBook = data.splice(bookIndex, 1);

  writeData(data);

  res.json({
    message: "Libro eliminado correctamente",
    book: deletedBook[0],
  });
});

// 🔥 IMPORTANTE: Puerto dinámico para Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});