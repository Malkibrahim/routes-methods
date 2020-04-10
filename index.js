const express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
// const erorrs =require('./erorrMessages.json')
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({}));
app.use(function (req, rea, next) {
  console.log(req.url);

  next();
});
app.post("/register", function (req, res, next) {
  const { username, password, firstname } = req.body;

  if (!username || !password || !firstname) {
    return res.status(400).json({
      message: "Compelete Your Data",
    });
  }

  fs.readFile("./DB.json", "utf8", (err, data) => {
    const db = JSON.parse(data);

    const id = db.length ? db[db.length - 1].id + 1 : 0;
    const obj = {
      id: id,
      firstname,
      username,
      password,
    };
    db.push(obj);
    fs.writeFile("./DB.json", JSON.stringify(db), (err) => {
      res.json({ message: "Done" });
    });
  });
});

app.post("/login", function (req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Compelete Your Data",
    });
  }

  fs.readFile("./DB.json", "utf8", (err, data) => {
    const db = JSON.parse(data);
    const data2 = db.find(
      (a) => a.username == username && a.password == password
    );
    if (data2) {
      return res.status(200).json({
        message: "Done",
      });
    }
    res.status(400).json({
      message: "your data is incorrect",
    });
  });
});
app.get("/users", function (req, res, next) {
  fs.readFile("./DB.json", "utf8", (err, data) => {
    const db = JSON.parse(data);

    res.status(200).json({
      message: db.map((a) => a.firstname),
    });
  });
});
app.delete("/users/:userId", function (req, res, next) {
  const [request, userId] = req.url.split("/");
  fs.readFile("./DB.json", "utf8", (err, data) => {
    const db = JSON.parse(data);
    const i = db.findIndex((a) => a.id == userId);
    const result = db.splice(i, 1);
    if (result) {
      res.status(200).json({
        message: "Done ",
      });
    } else {
      res.status(400).json({
        message: "No users with that id ",
      });
    }
  });
  fs.writeFile("./DB.json", JSON.stringify(db), (err) => {
    res.json({ message: "Done" });
  });
});
app.patch("/users/:userId", function (req, res, next) {
  const { username, password, firstname } = req.body;

  if (!username && !password && !firstname) {
    return res.status(400).json({
      message: "Compelete Your Data",
    });
  }
  const [request, userId] = req.url.split("/");
  fs.readFile("./DB.json", "utf8", (err, data) => {
    const db = JSON.parse(data);
    const { userId } = req.params;
    const obj = db.find((a) => a.id == userId);
    obj.username = username || obj.username;
    obj.firstname = firstname || obj.firstname;
    obj.password = password || obj.password;
    fs.writeFile("./DB.json", JSON.stringify(db), (err) => {
      res.json({ message: "Done" });
      if (err) {
        next(new Error("Something went Wrong"));
      }
    });
  });
});

app.listen(3000);
