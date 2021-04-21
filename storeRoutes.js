module.exports = app => {
  const storeRouter = require("express").Router();

  const store = require("./controllers/store.js");

  // Store pagination
  storeRouter.get("/", store.pagination);
  // Create a new Store
  storeRouter.post("/", store.create);
  // Update a Store with id
  storeRouter.put("/:id", store.update);
  // Delete a Store with id
  storeRouter.delete("/:id", store.delete);

  app.use('/api/store', storeRouter);
};