const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const app = express();

const controller = require("./controller");

const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);
app.use(logger("dev"));
app.use(express.static(process.cwd() + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/subscription", controller.handleSubscription);
app.post("/subscription/:id/push", controller.handlePushNotification);
app.get("*", (req, res) => res.sendFile(process.cwd() + "/public/index.html"));

app.listen(port, () => console.log(`Server start at ${port}`));
