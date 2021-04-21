module.exports = app => {
  const router = require("express").Router();

  router.get("/", require("./controllers/list.js"));
  router.post("/", require("./controllers/create.js"));
  router.get("/:id", require("./controllers/show.js"));
  router.put("/:id", require("./controllers/update.js"));
  router.delete("/:id", require("./controllers/delete.js"));

  app.use('/api/user', router);
};