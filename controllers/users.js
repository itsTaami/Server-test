const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const connection = require("../config/db");
const filePath = "../../data/users.json";

const getAllUsers = (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log("Файл уншихад алдаа гарлаа. !!!");
      return;
    }
    const parsedData = JSON.parse(data);
    res.status(201).json({ users: parsedData.datas });
  });
};
const getUsers = (req, res) => {
  const users = fs.readFile("./data/users.json", "utf-8", (err, data) => {
    if (err) {
      console.log("ERROR");
      return;
    }
    const parseData = JSON.parse(data);
    res.status(201).json({ users: parseData.users });
  });
};
const createUser = (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  const salted = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salted);

  const query =
    "INSERT INTO user (id, name,email,password, phone_number, profileImg) VALUES(null,  ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [name, email, hashedPassword, phoneNumber, "url"],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res
        .status(201)
        .json({ message: "Шинэ хэрэглэгч амжилттай бүртгэгдлээ." });
    }
  );
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync("./data/users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const user = parsedData.users.find((el) => el.id === id);
  res.status(200).json({ user });
};

const putUserById = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const data = fs.readFileSync("./data/users.json", "utf-8");
  const parseData = JSON.parse(data);
  const findIndex = parseData.users.findIndex((el) => el.id === id);
  parseData.users[findIndex].name = name;
  fs.writeFileSync("./data/users.json", JSON.stringify(parseData));
  res
    .status(201)
    .json({ message: "Шинэ хэрэглэгчийн өгөгдөл амжилттай солигдлоо." });
};
const deleteUserById = (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync("./data/users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const findIndex = parsedData.users.findIndex((el) => el.id === id);
  parsedData.users.splice(findIndex, 1);
  fs.writeFileSync("./data/users.json", JSON.stringify(parsedData));
  res
    .status(201)
    .json({ message: `${id} тай хэрэглэгч амжилттай устгагдлаа.` });
};

module.exports = {
  getUsers,
  getUserById,
  putUserById,
  deleteUserById,
  getAllUsers,
  createUser,
};