import express from "express";

import { ensureAuth } from "../middlewares/auth";
import Story from "../models/Story";

const storyRouter = express.Router();

// @desc Show create page
// @route GET /stories/create
storyRouter.get("/create", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc Process add story
// @route POST /stories/create
storyRouter.post("/create", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/api/v1/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc Show all stories
// @route GET /stories/all
storyRouter.get("/public", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

export default storyRouter;
