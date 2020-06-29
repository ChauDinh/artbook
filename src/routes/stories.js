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

// @desc edit page
// @route GET /stories/edit/:id
storyRouter.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user.toString() !== req.user.id.toString()) {
      res.redirect("/api/v1/stories/public");
    } else {
      res.render("stories/edit", {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc Update story
// @route: PUT /stories/edit:id
storyRouter.put("/edit/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user.toString() !== req.user.id.toString()) {
      res.redirect("/api/v1/stories/public");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/api/v1/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc Delete story
// @route DELETE /stories/delete/:id
storyRouter.delete("/delete/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/api/v1/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

export default storyRouter;
