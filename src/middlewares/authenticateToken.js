import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

import { sendRes } from "../utils/responseHelpers.js";
import { logError } from "../utils/comman.utils.js";

export const authenticateToken = (req, res, next) => {
   try {
      const token = req.cookies.token;

      if (!token) return sendRes(res, 401, "Unaurthorized - No token provided."); // Unauthorized

      jwt.verify(token, process.env.JWT_CUSTOMER_SECRET_KEY, async (err, user) => {
         if (err) return sendRes(res, 403, "Unaurthorized - Invalid token."); // Forbidden

         req.user = user;
         next();
      })
   } catch (error) {
      logError("authenticateToken", error);
      return sendRes(res, 500, "Internal Server Error.")
   }
}