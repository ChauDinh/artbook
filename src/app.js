import express from "express";
import "dotenv/config";
import morgan from "morgan";
import exphbs from "express-handlebars";
import path from "path";

import router from "./routes/index";
import { connectDB } from "./config/db";

connectDB();

const PORT = process.env.PORT || 3000;

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

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/v1/", router);

app.listen(PORT, () =>
  console.log(
    `🚀 the app is running in ${process.env.NODE_ENV} mode on port`,
    PORT
  )
);
