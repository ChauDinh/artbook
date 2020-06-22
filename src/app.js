import express from "express";
import "dotenv/config";
import morgan from "morgan";
import exphbs from "express-handlebars";
import path from "path";
import passport from "passport";
import session from "express-session";

import router from "./routes/index";
import authRouter from "./routes/auth";
import { connectDB } from "./config/db";

connectDB();

const PORT = process.env.PORT || 3000;

// Passport config
import Passport from "./config/passport";
Passport(passport);

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars
app.engine(".hbs", exphbs({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");
app.set("views", "./src/views");

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/v1/", router);
app.use("/api/v1/auth/", authRouter);

app.listen(PORT, () =>
  console.log(
    `🚀 the app is running in ${process.env.NODE_ENV} mode on port`,
    PORT
  )
);
