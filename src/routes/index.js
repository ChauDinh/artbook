import express from "express";

const router = express.Router();
// @desc login/landing page
// @route GET /
router.get("/", (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// @desc dashboard/landing page
// @route GET /dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

export default router;
