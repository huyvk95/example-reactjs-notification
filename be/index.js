const express = require("express");
const app = express();

const port = process.env.PORT || 4000;

app.get("*", (req, res) => res.send("Hello world!"));

app.listen(port, () => console.log(`Server start at ${port}`));
