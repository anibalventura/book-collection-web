import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressHbs from "express-handlebars";
import editorialRoutes from "./routes/editorial.routes.js";
import authorRoutes from "./routes/author.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import errorRoutes from "./routes/error.routes.js";
import database from "./helpers/database.helper.js";
import Book from "./models/book.model.js";
import Category from "./models/category.model.js";
import Author from "./models/author.model.js";
import Editorial from "./models/editorial.model.js";

const PORT = process.env.PORT || 5001;
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure express to use handlebars.
app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "./src/views/layouts",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "./src/views");

// Middleware's.
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

// Routes.
app.use(editorialRoutes);
app.use(authorRoutes);
app.use(categoryRoutes);
app.use(errorRoutes);

// Database relationships.
Book.belongsTo(Category, { constraint: true, onDelete: "CASCADE" });
Category.hasMany(Book);

Book.belongsTo(Author, { constraint: true, onDelete: "CASCADE" });
Author.hasMany(Book);

Book.belongsTo(Editorial, { constraint: true, onDelete: "CASCADE" });
Editorial.hasMany(Book);

// Start the server.
database
  .sync()
  .then((_) => {
    app.listen(PORT, () =>
      console.log(`Server running on port http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.log(err);
  });
