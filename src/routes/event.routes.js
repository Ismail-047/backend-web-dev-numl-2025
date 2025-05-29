import express from "express";
import { upload } from "../middlewares/multer.js";
import { addNewEvent, getMyEvents, getAllEvents, searchEvents, registerForEvent, unregisterForEvent, getRegisteredEvents, getEventDetails } from "../controllers/event.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.get("/get-all-events", getAllEvents);
router.get("/get-event-details/:eventId", getEventDetails);
router.get("/get-my-events", authenticateToken, getMyEvents);
router.get("/get-registered-events", authenticateToken, getRegisteredEvents);
router.post("/add-new-event", authenticateToken, upload.array("images", 10), addNewEvent);
router.post("/search-events", searchEvents);
router.post("/register-for-event/:eventId", authenticateToken, registerForEvent);
router.post("/unregister-for-event/:eventId", authenticateToken, unregisterForEvent);


export default router;