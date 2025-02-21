import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import globalRoutes from "./routes/globalRoute.js";
import authRoutes from "./routes/authRoute.js";
import connectDB from "./utils/database.js";
import paymentRoutes from "./routes/paymentRoute.js";
import contentRoutes from "./routes/contentRoute.js";

const app = express();

dotenv.config();

connectDB();

const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", globalRoutes);
app.use("/api", paymentRoutes);
app.use("/api", authRoutes);
app.use("/api", contentRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
