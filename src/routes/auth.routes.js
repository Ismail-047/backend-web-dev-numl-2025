import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
    checkAuth,
    continueWithGoogle,
    loginUser,
    logoutUser,
    signupUser,
    verifyUserEmail
} from "../controllers/auth.controllers.js";

const router = express.Router();

// GET REQUESTS
router.get("/check-auth", authenticateToken, checkAuth);
router.get("/logout", logoutUser);

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/continue-with-google", continueWithGoogle);

router.patch("/verify-email", verifyUserEmail);

// router.post("/request-reset-password", requestPasswordReset);
// router.patch("/reset-password", resetUserPassword);
// router.delete("/delete-user", deleteUser);

export default router;