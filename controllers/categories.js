const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const filePath = "./data/categories.json";

const postCategories = (req, res) => {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    const newData = { ...req.body };
    data.categories.push(newData);
    fs.writeFileSync(filePath, JSON.stringify(data));
    res
      .status(201)
      .json({ message: "Category added successfully ", data: newData });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  res.json();
};

const getCategories = (req, res) => {
  try {
    const categoriesData = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    res.status(200).json({ message: "success", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  res.json();
};
const getCategoriesById = (req, res) => {
  try {
    const { id } = req.params;
    const categoriesData = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    const category = data.categories.find((el) => el.id === id);
    res.status(201).json({ category });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const putCategoriesById = (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const categoriesData = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    const findIndex = data.categoriesData.findIndex((el) => el.id === id);
    // parseData.categories[findIndex].title = title;
    // fs.writeFileSync("categories.json", JSON.stringify(parseData));
    // res.status(201).json({ message: " өгөгдөл амжилттай солигдлоо." });
    if (findIndex === -1) {
      return res.status(404).json({ message: "Not found", data: null });
    }
    data.categoriesData[findIndex] = {
      ...data.categoriesData[findIndex],
      ...req.body,
    };
    fs.writeFileSync("categories.json", JSON.stringify(parseData));
    res.status(200).json({
      message: " ugugdul amjilttai soligdloo ",
      data: parseData.categoriesData[findIndex],
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteCategoriesById = (req, res) => {
  try {
    const { id } = req.params;
    const categoriesData = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    const findArr = data.categoriesData.filter((el) => el.id !== id);
    const deletedCategory = data.categoriesData.find((el) => el.id === id);
    if (!(findArr.length > 0)) {
      return res.status(404).json({ message: "not found", data: null });
    }
    data.categoriesData = findArr;
    fs.writeFileSync("categories.json", JSON.stringify(data));
    res
      .status(201)
      .json({ message: "амжилттай устгагдлаа.", data: deletedCategory });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  postCategories,
  getCategories,
  putCategoriesById,
  deleteCategoriesById,
  getCategoriesById,
};
