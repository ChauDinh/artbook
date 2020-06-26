import express from "express";

import { ensureAuth } from "../middlewares/auth";
import Story from "../models/Story";

const storyRouter = express.Router();

// @desc Show create page
// @route GET /stories/create
storyRouter.get("/create", ensureAuth, (req, res) => {
  res.render("stories/add");
});

export default storyRouter;
