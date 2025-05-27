import { User } from "../models/user.model.js";
import { sendRes, logError } from "../utils/comman.utils.js";
import { generateTokenAndSetCookie } from "../utils/auth.utils.js";

// CHECK AUTHENTICATED USER
export const checkAuth = async (req, res) => {
    try {
        const { userId: loggedInUserId } = req.user;

        const existingUser = await User.findById(loggedInUserId);
        if (!existingUser) return sendRes(res, 400, "No user found.");

        return sendRes(res, 200, "User found.", existingUser);
    }
    catch (error) {
        logError("checkAuth (user.controllers.js)", error);
        return sendRes(res, 500, "Internal Server Error.");
    }
}

// SIGNUP USER
export const signupUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, picture } = req.body;

        return sendRes(res, 200, "");
    }
    catch (error) {
        logError("signupUser (auth.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}

// LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email })
            .select("-emailVerificationCode -verificationCodeExpiresAt -resetPassToken -resetPassTokenExpiresAt");
        if (!existingUser) return sendRes(res, 400, "No account found. Try signing up.");

        if (!existingUser.password) return sendRes(res, 400, "No password found. Try logging in with Google.");
        if (!existingUser.isVerified) return sendRes(res, 400, "Please verify your email to login.");

        const isPasswordCorrect = await existingUser.comparePassword(password, existingUser.password);
        if (!isPasswordCorrect) return sendRes(res, 400, "Password is incorrect.");

        generateTokenAndSetCookie(res, existingUser._id);
        delete existingUser.password; // TEST THIS
        return sendRes(res, 200, "Login Successfull.", existingUser);
    }
    catch (error) {
        logError("loginUser (auth.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}
// CONTINUE WITH GOOGLE
export const continueWithGoogle = async (req, res) => {
    try {
        const { email, name, picture, phoneNumber } = req.body;

        const isUserAlreadyExists = await User.findOne({ email });

        if (isUserAlreadyExists) {
            generateTokenAndSetCookie(res, isUserAlreadyExists._id);
            return sendRes(res, 200, "Login Successfull.", isUserAlreadyExists);
        }

        const newUser = await User.create({ email, name, picture, phoneNumber, isVerified: true });

        generateTokenAndSetCookie(res, newUser._id);

        return sendRes(res, 200, "Login Successfull.", newUser);
    }
    catch (error) {
        logError("continueWithGoogle (user.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        return sendRes(res, 200, "Logout Successful.");
    }
    catch (error) {
        logError("logoutUser (auth.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
}