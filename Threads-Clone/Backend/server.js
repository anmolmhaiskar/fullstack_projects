import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import connectDB from "./db/connectDB.js";
import messageRoutes from "./routes/messageRoute.js";
import postRoutes from "./routes/postRoute.js";
import userRoutes from "./routes/userRoute.js";
import { app, server } from "./socket/socket.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const _dirName = path.resolve();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

//Serve React app from static dist folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirName, "/Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirName, "Frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
