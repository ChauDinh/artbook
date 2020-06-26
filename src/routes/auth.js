import express from "express";
import passport from "passport";

const authRouter = express.Router();
// @desc auth with google
// @route GET /auth/google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] })
);

// @desc google auth callback
// @route GET /auth/google/callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/" }),
  (req, res) => res.redirect("/api/v1/dashboard/")
);

// @desc logout user account
// @route GET /auth/logout
authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/api/v1/");
});

export default authRouter;
