import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
// import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaClient } from "@prisma/client";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import storeRouter from "./routes/store.route.js";
// import connectDB from "./db/index.js";
dotenv.config();

export const db = new PrismaClient();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = 8080 || process.env.PORT;

// app.get("/api/new-user", async (req, res, next) => {
//   try {
//     const user = await db.user.create({
//       data: {
//         email: "adarsh@gmail.com",
//         name: "adarsh",
//       },
//     });

//     res.json({
//       message: "user fetched",
//       success: true,
//       user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// });

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/store", storeRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Server is Running",
  });
});

// connectDB().then(() => {
app.listen(PORT, () => {
  console.log("Server is running", PORT);
});
// });
