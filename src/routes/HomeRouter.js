const AuthMiddlewares = require("../middlewares/AuthMiddlewares");
const path = require("path");
const fs = require("fs").promises;

const router = require("express").Router();

router.use(AuthMiddlewares);

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id - 0;

    if (id === req.user.id) {
      throw new Error("Select another chat");
    }

    let dbPath = path.join(__dirname, "..", "db", "db.json");
    let dbFile = await fs.readFile(dbPath, "utf8");
    let db = await JSON.parse(dbFile);

    // manni id=1
    // man yozishadigan odamni id'si 2

    // message.from = 1 message.to = 2
    // message.from = 2 message.to = 1

    let messages = db.messages.filter((message) => {
      return (
        (message.from === req.user.id && message.to === id) ||
        (message.to === req.user.id && message.from === id)
      );
    });

    res.render("index", {
      title: "Chat",
      messages,
      users: db.users,
      me: req.user,
    });
  } catch (err) {
    console.log(err + "");
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (id === req.user.id) {
      throw new Error("Select another chat");
    }

    let dbPath = path.join(__dirname, "..", "db", "db.json");
    let dbFile = await fs.readFile(dbPath, "utf8");
    let db = await JSON.parse(dbFile);

    let message = {
      id: db.messages.length + 1,
      to: id,
      from: req.user.id,
      text,
    };

    db.message.push(message);

    await fs.writeFile(dbPath, JSON.stringify(db));

    res.redirect("/chat");
  } catch (err) {
    res.render("index", {
      title: "Chat",
      error: e + "",
    });
  }
});

module.exports = {
  path: "/chat",
  router,
};
