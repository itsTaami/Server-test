const express = require("express");
const cors = require("cors");
const fs = require("fs");
// const { json } = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const port = 8000;

const server = express();
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "Hello express server" }); // GET iruul json niig butsaana. Browser luu zovhon GET huselt yvuulna
});

server.post("/signup", (req, res) => {
  //post n shineer huselt bichih

  const { name, role = "user", email, password } = req.body;
  const date = fs.readFileSync("users.json", "utf-8");
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
server.post("/signin", (req, res) => {
  const { id, email, password } = req.body;
  const data = fs.readFileSync("users.json", "utf-8");
  const parseData = JSON.parse(data);
  const findUser = parseData.users.find((user) => user.id === id);
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
server.get("/users", (req, res) => {
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      console.log("Error:File loading!!!");
      return;
    }
    console.log("data:", data);
    const parseData = JSON.parse(data);
    res.status(201).json({ users: parseData.users });
  });
});
server.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync("user.json", "utf-8");
  const parseData = JSON.parse(data); // json iig parse buyu string bolgoj bga
  const user = parseData.users.find((el) => el.id === id);
  res.status(200).json({ user });
});
server.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const data = fs.readFileSync("user.json", "utf-8");
  const parseData = JSON.parse(data);
  const findIndex = parseData.users.findIndex((el) => el.id === id);
  parseData.users[findIndex].name = name;
  fs.writeFileSync("user.json", JSON.stringify(parseData));
  res
    .status(201)
    .json({ message: "Шинэ хэрэглэгчийн өгөгдөл амжилттай солигдлоо." });
});
server.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync("users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const findIndex = parsedData.users.findIndex((el) => el.id === id);
  parsedData.users.splice(findIndex, 1);
  fs.writeFileSync("users.json", JSON.stringify(parsedData));
  res
    .status(201)
    .json({ message: `${id} тай хэрэглэгч амжилттай устгагдлаа.` });
});

//User END

//Category START

server.post("/categories", (req, res) => {
  try {
    const content = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(content);
    const newData = { ...req.body };
    data.categories.push(newData);
    fs.writeFileSync("categories.json", JSON.stringify(data));
    res
      .status(201)
      .json({ message: "Category added successfully ", data: newData });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  res.json();
});

server.get("/categories", (req, res) => {
  try {
    const categoriesData = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    res.status(200).json({ message: "success", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  res.json();
});

//Category END

server.listen(port, () => {
  console.log(`Server aslaa ${port}`);
});
