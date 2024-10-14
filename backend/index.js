import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOption = {
  origin: "http//localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));

const PORT = 5000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello from job portal", success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
