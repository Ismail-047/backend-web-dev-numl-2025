import jwt from "jsonwebtoken";
import { sendRes, logError } from "../utils/comman.utils.js";

/**
 * MIDDLEWARE TO AUTHENTICATE THE USER
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function.
 */
export const authenticateToken = (req, res, next) => {
   try {
      const token = req.cookies.token;

      if (!token) return sendRes(res, 401, "Unaurthorized - No token provided."); // Unauthorized

      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
         if (err) return sendRes(res, 403, "Unaurthorized - Invalid token."); // Forbidden

         req.user = user;
         next();
      })
   } catch (error) {
      next(error);
      logError("authenticateToken (authenticateToken.js)", error);
      return sendRes(res, 500, "Internal Server Error.")
   }
}