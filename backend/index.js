const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const user = require("./user");
const chat = require("./chat");
const docs = require("./uploads");
const { multerUpload } = require("./multer");

// user API
app.get("/users", user.getUsers);
app.post("/addUser", user.addUser);
app.put("/updateuser/:id", user.updateUser);
app.get("/users/:id", user.getUserById);
app.delete("/deleteuser/:id", user.deleteUserById);
// Chat API
app.get("/chats", chat.getChat);
app.post("/addChat", chat.addChat);
//Document API
app.get("/docs", docs.getdocs);
app.post("/adddoc", multerUpload.single("file"), docs.addDoc);
app.put("/updatedoc/:id", docs.updateDoc);
app.get("/docs/:id", docs.getDocById);
app.delete("/deletedoc/:id", docs.deleteDocById);

app.listen(4200);
