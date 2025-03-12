const express = require("express");
const connectDB = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const rescuesRouter = require("./routes/rescuesRoutes");

const app = express();

//Connect to the database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("tiny"));

app.use("/rescues", rescuesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}...`);
});
