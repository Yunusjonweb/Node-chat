const router = require("express").Router();
const path = require("path");
const fs = require("fs/promises");
const { generateJWTToken } = require("../modules/jwt");

router.get("/", (req, res) => {
  res.render("login", {
    title: "Log in",
  });
});

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const dbPath = path.join(__dirname, "..", "db", "db.json");
    let dbFile = await fs.readFile(dbPath, "utf8");
    let db = await JSON.parse(dbFile);

    let userIndex = db.users.findIndex(
      (user) => user.username === username.toLowerCase()
    );

    if (userIndex < 0) {
      throw new Error("User not registered");
    }

    let isPasswordExist = db.users[userIndex].password === password;

    if (!isPasswordExist) {
      throw new Error("Incorrect password");
    }

    let token = generateJWTToken({
      id: db.users[userIndex].id,
      full_name: db.users[userIndex].full_name,
      username: db.users[userIndex].username,
    });

    res.cookie("token", token).redirect(`/chat/${db.users[userIndex].id}`);
  } catch (err) {
    res.render("login", { title: "Log in", error: err + "" });
  }
});

module.exports = {
  path: "/login",
  router,
};
