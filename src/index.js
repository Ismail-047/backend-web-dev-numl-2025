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
   res.send("<h1>Hello from Web Dev Competition Numl 2025</h1>");
})

import UserRoutes from "./routes/user.routes.js";
import AuthRoutes from "./routes/auth.routes.js";

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/auth", AuthRoutes);

connectDatabase().then(() => {
   server.listen(3000, () => {
      console.log(`SERVER IS LISTENING ON PORT : ${process.env.FRONTEND_URL}`);
   });
})