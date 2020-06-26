import express from "express";

import { ensureAuth, ensureGuest } from "../middlewares/auth";

const router = express.Router();
// @desc login/landing page
// @route GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// @desc dashboard/landing page
// @route GET /dashboard
router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard");
});

export default router;
