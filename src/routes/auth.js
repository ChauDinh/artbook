import express from "express";
import passport from "passport";

const router = express.Router();
// @desc auth with google
// @route GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc google auth callback
// @route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("/api/v1/dashboard")
);

export default router;
