const express = require("express");
const cors = require("cors");
const { testConnection } = require("./database/index");
require("dotenv").config();
const creteUserRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", creteUserRoutes);
app.use("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running"
  });
});
testConnection();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
