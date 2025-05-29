import express from "express";
import {
    subscribeToNewsletters,
    unsubscribeToNewsletters,
    updateFcmToken
} from "../controllers/user.controllers.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.post("/subscribe-to-newsletters", subscribeToNewsletters);
router.post("/update-fcm-token", authenticateToken, updateFcmToken);

router.delete("/unsubscribe-to-newsletters", unsubscribeToNewsletters);

export default router;