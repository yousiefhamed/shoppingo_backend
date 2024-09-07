const express = require("express");
const cors = require("cors");
const studentRoutes = require("./studentRoute");
const productRoutes = require("./productRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/products", productRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
