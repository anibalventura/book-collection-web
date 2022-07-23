import Book from "../models/book.model.js";
import Category from "../models/category.model.js";
import Author from "../models/author.model.js";
import Editorial from "../models/editorial.model.js";
import compare from "../helpers/hbs/compare.helper.js";
import { sendEmail } from "../helpers/email.helper.js";

let categories = [];
let authors = [];
let editorials = [];

const getAllCategories = () => {
  Category.findAll()
    .then((result) => {
      categories = [];
      const categoriesResult = result.map((result) => result.dataValues);
      categories = categoriesResult;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAllAuthors = () => {
  Author.findAll()
    .then((result) => {
      authors = [];
      const authorsResult = result.map((result) => result.dataValues);
      authors = authorsResult;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAllEditorials = () => {
  Editorial.findAll()
    .then((result) => {
      editorials = [];
      const editorialResult = result.map((result) => result.dataValues);
      editorials.push(...editorialResult);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getIndex = (req, res) => {
  Book.findAll({
    include: [{ model: Category }, { model: Author }, { model: Editorial }],
  })
    .then((result) => {
      const books = result.map((result) => result.dataValues);

      res.render("../views/book/index", {
        pageTitle: "Home",
        hasBooks: 0,
        booksActive: true,
        books: books,
        hasBooks: books.length > 0,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getCreate = (req, res) => {
  Category.findAll()
    .then((result) => {
      categories = [];
      const categoriesResult = result.map((result) => result.dataValues);

      Author.findAll()
        .then((result) => {
          const authorsResult = result.map((result) => result.dataValues);

          Editorial.findAll()
            .then((result) => {
              const editorialResult = result.map((result) => result.dataValues);

              res.render("../views/book/save", {
                pageTitle: "Create Book",
                categories: categoriesResult,
                authors: authorsResult,
                editorials: editorialResult,
                hasCategories: categoriesResult.length === 0,
                hasAuthors: authorsResult.length === 0,
                hasEditorials: editorialResult.length === 0,
                hasRelations:
                  categoriesResult.length > 0 &&
                  authorsResult.length > 0 &&
                  editorialResult.length > 0,
                booksActive: true,
                editMode: false,
                helpers: {
                  equalValue: compare,
                },
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postCreate = (req, res) => {
  const title = req.body.title;
  const publicationYear = req.body.publicationYear;
  const imagePath = req.body.imagePath;
  const categoryId = req.body.categoryId;
  const authorId = req.body.authorId;
  const editorialId = req.body.editorialId;

  Book.create({
    title: title,
    publicationYear: publicationYear,
    imagePath: imagePath,
    categoryId: categoryId,
    authorId: authorId,
    editorialId: editorialId,
  })
    .then(() => {
      Author.findOne({ where: { id: authorId } })
        .then((result) => {
          const author = result.dataValues;

          sendEmail({
            from: "Book Collection",
            to: author.email,
            subject: "Book Collection - Your book has been published!",
            html: `
            Hi ${author.name}!<br><br>
            Your book <strong>${title}</strong> has been published!<br><br>
            Thank you for using Book Collection!
            `,
          });
          res.redirect("/books");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getEdit = (req, res) => {
  getAllCategories();
  getAllAuthors();
  getAllEditorials();

  const id = req.params.bookId;

  Book.findOne({ where: { id: id } })
    .then((result) => {
      const book = result.dataValues;

      if (!book) {
        return res.redirect("/books");
      }

      res.render("../views/book/save", {
        pageTitle: "Create Book",
        book: book,
        categories: categories,
        authors: authors,
        editorials: editorials,
        hasCategories: categories.length === 0,
        hasAuthors: authors.length === 0,
        hasEditorials: editorials.length === 0,
        hasRelations:
          categories.length > 0 && authors.length > 0 && editorials.length > 0,
        booksActive: true,
        editMode: true,
        helpers: {
          equalValue: compare,
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postEdit = (req, res) => {
  const id = req.body.bookId;
  const title = req.body.title;
  const publicationYear = req.body.publicationYear;
  const imagePath = req.body.imagePath;
  const categoryId = req.body.categoryId;
  const authorId = req.body.authorId;
  const editorialId = req.body.editorialId;

  Book.update(
    {
      title: title,
      publicationYear: publicationYear,
      imagePath: imagePath,
      categoryId: categoryId,
      authorId: authorId,
      editorialId: editorialId,
    },
    { where: { id: id } }
  )
    .then(() => {
      return res.redirect("/books");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDelete = (req, res) => {
  const id = req.params.bookId;

  Book.findOne({ where: { id: id } })
    .then((result) => {
      const book = result.dataValues;

      if (!book) {
        return res.redirect("/books");
      }

      res.render("../views/book/delete", {
        pageTitle: "Delete Book",
        book: book,
        booksActive: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postDelete = (req, res) => {
  const id = req.body.bookId;

  Book.destroy({ where: { id: id } })
    .then(() => {
      return res.redirect("/books");
    })
    .catch((err) => {
      console.log(err);
    });
};
