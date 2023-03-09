const { Router } = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const {
  getUsers,
  getUserById,
  putUserById,
  deleteUserById,
} = require("../controllers/users");

const router = Router();

// Start Users

router.get("/", getUsers);

router.get("/:id", getUserById);
router.put("/:id", putUserById);
router.delete("/:id", deleteUserById);

// End Users

router.post("./data/signup", (req, res) => {
  //post n shineer huselt bichih

  const { name, role = "user", email, password } = req.body;
  const data = fs.readFileSync("users.json", "utf-8");
  const parseData = JSON.parse(data);
  const id = uuidv4();
  const salted = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salted);
  console.log(hashedPassword);

  const newUser = {
    id,
    name,
    role,
    email,
    password,
  };
  parseData.users.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(parseData));
  res.status(201).json({ message: "new user added successfully" });
});
router.post("./data/signin", (req, res) => {
  const { id, email, password } = req.body;
  const data = fs.readFileSync("users.json", "utf-8");
  const parseData = JSON.parse(data);
  const findUser = parseData.users.find((user) => user.email === email);
  if (!findUser) {
    return res.status(401).json({ message: "User not found" });
  }
  const isCheck = bcrypt.compareSync(password, findUser.password);
  if (isCheck) {
    res.status(200).json({ message: "Signin Success.", user: findUser });
  } else {
    res
      .status(401)
      .json({ message: "Check your email or password", user: null });
  }
});

// router.get("/", (req, res) => {
//   fs.readFile("users.json", "utf-8", (err, data) => {
//     if (err) {
//       console.log("Файл уншихад алдаа гарлаа. !!!");
//       return;
//     }
//     console.log(data);
//     const parsedData = JSON.parse(data);
//     res.status(201).json({ users: parsedData.users });
//   });
// });

// router.get("/:id", (req, res) => {
//   const { id } = req.params;
//   const data = fs.readFileSync("users.json", "utf-8");
//   const parsedData = JSON.parse(data);
//   const user = parsedData.users.find((el) => el.id === id);
//   res.status(200).json({ user });
// });

// router.put("/:id", (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   const data = fs.readFileSync("user.json", "utf-8");
//   const parseData = JSON.parse(data);
//   const findIndex = parseData.users.findIndex((el) => el.id === id);
//   parseData.users[findIndex].name = name;
//   fs.writeFileSync("user.json", JSON.stringify(parseData));
//   res
//     .status(201)
//     .json({ message: "Шинэ хэрэглэгчийн өгөгдөл амжилттай солигдлоо." });
// });
// router.delete("/:id", (req, res) => {
//   const { id } = req.params;
//   const data = fs.readFileSync("users.json", "utf-8");
//   const parsedData = JSON.parse(data);
//   const findIndex = parsedData.users.findIndex((el) => el.id === id);
//   parsedData.users.splice(findIndex, 1);
//   fs.writeFileSync("users.json", JSON.stringify(parsedData));
//   res
//     .status(201)
//     .json({ message: `${id} тай хэрэглэгч амжилттай устгагдлаа.` });
// });

module.exports = router;
