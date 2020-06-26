export const ensureAuth = (req, res, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/api/v1/");
  }
};

export const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/api/v1/dashboard/");
  } else {
    return next();
  }
};
