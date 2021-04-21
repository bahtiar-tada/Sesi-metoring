module.exports = app => {
  const managerRouter = require("express").Router();

  const manager = require("./controllers/manager.js");

  // manager pagination
  managerRouter.get("/", manager.pagination);
  // Create a new manager
  managerRouter.post("/", manager.create);
  // Update a manager with id
  managerRouter.put("/:id", manager.update);
  // Delete a manager with id
  managerRouter.delete("/:id", manager.delete);

  app.use('/api/manager', managerRouter);
};