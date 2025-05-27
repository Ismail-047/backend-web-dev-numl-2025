import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDatabase from "./db/db.js";
import { app, server } from "./sockets.io/socket.js";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }))

app.get("/", (req, res) => {
   res.send("<h1>Hello from Mikaz</h1>");
})

import UserRoutes from "./routes/user.routes.js";

app.use("/api/v1/users", UserRoutes);

connectDatabase().then(() => {
   server.listen(3000, () => {
      console.log(`SERVER IS LISTENING ON PORT : ${process.env.FRONTEND_URL}`);
   });
})