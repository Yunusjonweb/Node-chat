const router = require("express").Router();
const path = require("path");
const fs = require("fs/promises");

router.get("/", (req, res) => {
  res.render("signup", {
    title: "Signup",
  });
});
router.post("/", async (req, res) => {
  try {
    const { full_name, username, password } = req.body;

    if (password.length < 7) {
      throw new Error("Password must be at least 6 characters");
    }

    let dbPath = path.join(__dirname, "..", "db", "db.json");
    let dbFile = await fs.readFile(dbPath, "utf-8");
    let db = JSON.parse(dbFile);

    let isUserExsist = db.users.find(
      (user) => user.username === username.toLowerCase()
    );

    if (isUserExsist) {
      throw new Error("This user already exists");
    }
    db.users.push({
      id: db.users.length + 1,
      full_name,
      username: username.toLowerCase(),
      password,
    });

    await fs.writeFile(dbPath, JSON.stringify(db));
    res.redirect("/login");
  } catch (err) {
    res.render("signup", {
      title: "Sign Up",
      error: err + "",
    });
  }
});

module.exports = {
  path: "/signup",
  router,
};
