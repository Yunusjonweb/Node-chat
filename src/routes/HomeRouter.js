const AuthMiddleware = require("../middlewares/AuthMiddlewares");
const path = require("path");
const fs = require("fs").promises;

const router = require("express").Router();

router.use(AuthMiddleware);

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id - 0;

    let dbPath = path.join(__dirname, "..", "db", "db.json");
    let dbFile = await fs.readFile(dbPath, "utf-8");
    let db = await JSON.parse(dbFile);

    // mani id = 1
    // man yozishadigan odamn id'si 2

    // message.from = 1 message.to = 2
    // message.from = 2 message.to = 1

    let messages = db.messages.filter(
      (message) =>
        (message.from === req.user.id && message.to === id) ||
        (message.to === req.user.id && message.from === id)
    );

    res.render("index", {
      title: "Chat",
      messages,
      users: db.users,
      me: req.user,
      id,
    });
  } catch (err) {
    console.log(err + "");
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    let dbPath = path.join(__dirname, "..", "db", "db.json");
    let dbFile = await fs.readFile(dbPath, "utf-8");
    let db = await JSON.parse(dbFile);

    let now = new Date();
    let hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    let minutes =
      now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    let time = hours + ":" + minutes;

    let messages = {
      id: db.messages.length + 1,
      from: req.user.id,
      to: parseInt(id),
      text: message,
      date: time,
      id,
    };

    db.messages.push(messages);

    await fs.writeFile(dbPath, JSON.stringify(db));

    res.redirect("/chat/" + id);
  } catch (e) {
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
