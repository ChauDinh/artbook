import express from "express";
import "dotenv/config";
import morgan from "morgan";
import exphbs from "express-handlebars";
import path from "path";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";

import router from "./routes/index";
import authRouter from "./routes/auth";
import storyRouter from "./routes/stories";
import { connectDB } from "./config/db";
import MyPassportFactory from "./config/passport";
import { formatDate, truncate, stripTags } from "./helper/hbs";

connectDB();
const MongoStore = require("connect-mongo")(session);

const PORT = process.env.PORT || 3000;

// Passport config
let myPassportInstance = new MyPassportFactory(passport);
new myPassportInstance();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, truncate, stripTags },
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");
app.set("views", "./src/views");

// Express Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/v1", router);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/stories", storyRouter);

app.listen(PORT, () =>
  console.log(
    `🚀 the app is running in ${process.env.NODE_ENV} mode on port`,
    PORT
  )
);
