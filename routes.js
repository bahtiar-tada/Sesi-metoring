module.exports = app => {
  const user = require("./controllers/user.js");
  const router = require("express").Router();

  // Tugas Promise/Async/Callback
  router.get("/", require("./controllers/list.js"));

  // Create a new User
  router.post("/", user.create);

  // Retrieve a single User with id
  router.get("/:id", user.findOne);

  // Update a User with id
  router.put("/:id", user.update);

  // Delete a User with id
  router.delete("/:id", user.delete);

  app.use('/api/user', router);
};