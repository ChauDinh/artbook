import express from "express";
import "dotenv/config";
import morgan from "morgan";
import exphbs from "express-handlebars";
import path from "path";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import methodOverride from "method-override";

import router from "./routes/index";
import authRouter from "./routes/auth";
import storyRouter from "./routes/stories";
import { connectDB } from "./config/db";
import MyPassportFactory from "./config/passport";
import {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} from "./helper/hbs";

connectDB();
const MongoStore = require("connect-mongo")(session);

const PORT = process.env.PORT || 3000;

// Passport config
let myPassportInstance = new MyPassportFactory(passport);
new myPassportInstance();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and update (PUT) it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, truncate, stripTags, editIcon, select },
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
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Set express global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/v1", router);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/stories", storyRouter);

app.listen(PORT, () =>
  console.log(
    `🚀 the app is running in ${process.env.NODE_ENV} mode on port ${PORT}: http://localhost:${PORT}/api/v1`
  )
);
