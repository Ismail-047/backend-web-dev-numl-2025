import { Newsletter } from "../models/newsletters.model.js";
import { sendRes, logError } from "../utils/comman.utils.js";
import { User } from "../models/user.model.js";

export const updateFcmToken = async (req, res) => {
    try {
        const { fcmToken } = req.body;
        const { userId: loggedInUserId } = req.user;

        if (!fcmToken) return sendRes(res, 400, "FCM Token Is Required.");

        const user = await User.findByIdAndUpdate(loggedInUserId, { fcmToken }, { new: true });

        if (!user) return sendRes(res, 400, "User Not Found.");

        return sendRes(res, 200, "FCM Token Updated Successfully.", user);
    }
    catch (error) {
        logError("updateFcmToken", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}

// SUBSCRIBE TO NEWSLETTERS
export const subscribeToNewsletters = async (req, res) => {
    try {
        const { email } = req.body;

        const isAlreadySubscribed = await Newsletter.findOne({ email });
        if (isAlreadySubscribed) return sendRes(res, 400, "This Email Is Already Registered.");

        await Newsletter.create({ email });

        return sendRes(res, 200, "Subscription Successfull. Thanks For Joining Us.");
    }
    catch (error) {
        logError("subscribeToNewsletters (user.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}

// UNSUBSCRIBE TO NEWSLETTERS
export const unsubscribeToNewsletters = async (req, res) => {
    try {
        const { email } = req.body;

        const deletedEmail = await Newsletter.findOneAndDelete({ email });

        if (!deletedEmail) return sendRes(res, 400, "No Subscription Found.");

        return sendRes(res, 200, "Unsubscribed Successfully.");
    }
    catch (error) {
        logError("unsubscribeToNewsletters (user.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}