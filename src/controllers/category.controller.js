import Category from "../models/category.model.js";

export const getIndex = (req, res) => {
  Category.findAll()
    .then((result) => {
      const categories = result.map((result) => result.dataValues);

      res.render("../views/category/index", {
        pageTitle: "Categories",
        categoriesActive: true,
        categories: categories,
        hasCategories: categories.length > 0,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getCreate = (req, res) => {
  res.render("../views/category/save", {
    pageTitle: "Create Category",
    categoriesActive: true,
    editMode: false,
  });
};

export const postCreate = (req, res) => {
  const name = req.body.name;
  const description = req.body.description;

  Category.create({
    name: name,
    description: description,
  })
    .then(() => {
      res.redirect("/categories");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getEdit = (req, res) => {
  const id = req.params.categoryId;

  Category.findOne({ where: { id: id } })
    .then((result) => {
      const category = result.dataValues;

      if (!category) {
        return res.redirect("/categories");
      }

      res.render("../views/category/save", {
        pageTitle: "Create Category",
        category: category,
        categoriesActive: true,
        editMode: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postEdit = (req, res) => {
  const id = req.body.categoryId;
  const name = req.body.name;
  const description = req.body.description;

  Category.update(
    { name: name, description: description },
    { where: { id: id } }
  )
    .then(() => {
      return res.redirect("/categories");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDelete = (req, res) => {
  const id = req.params.categoryId;

  Category.findOne({ where: { id: id } })
    .then((result) => {
      const category = result.dataValues;

      if (!category) {
        return res.redirect("/categories");
      }

      res.render("../views/category/delete", {
        pageTitle: "Delete Category",
        category: category,
        categoriesActive: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postDelete = (req, res) => {
  const id = req.body.categoryId;

  Category.destroy({ where: { id: id } })
    .then(() => {
      return res.redirect("/categories");
    })
    .catch((err) => {
      console.log(err);
    });
};
