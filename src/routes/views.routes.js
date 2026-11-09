import express from "express";

const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
  try {
    res.render("home");
  } catch (error) {}
});

export default viewsRouter;
