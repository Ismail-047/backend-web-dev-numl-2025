import express from "express";
import {
    subscribeToNewsletters,
    unsubscribeToNewsletters
} from "../controllers/user.controllers.js";

const router = express.Router();


router.post("/subscribe-to-newsletters", subscribeToNewsletters);
router.delete("/unsubscribe-to-newsletters", unsubscribeToNewsletters);

export default router;