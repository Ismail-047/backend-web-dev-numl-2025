import express from "express";
import { upload } from "../middlewares/multer.js";
import { addNewEvent, getMyEvents, getAllEvents, searchEvents } from "../controllers/event.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.get("/get-all-events", getAllEvents);
router.get("/get-my-events", authenticateToken, getMyEvents);
router.post("/add-new-event", authenticateToken, upload.array("images", 10), addNewEvent);
router.post("/search-events", searchEvents);

export default router;