const express = require("express");
const cors = require("cors");
const router = require("./routes/index.js");
const chalk = require("chalk");
require("dotenv").config();

const port = process.env.PORT || 8090;

const app = express();
app.use(cors());
app.use("/", router);

app.listen(port, () => {
  console.log(chalk.yellow(`Main server started on port ${port}`));
});
