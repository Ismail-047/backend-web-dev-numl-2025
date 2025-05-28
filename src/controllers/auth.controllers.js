import { User } from "../models/user.model.js";
import { sendRes, logError, generateVerificationCode, getExpiryTime } from "../utils/comman.utils.js";
import { generateTokenAndSetCookie } from "../utils/auth.utils.js";
import { sendEmailVerificationCode } from "../lib/emails.js";

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
        const { name, email, password, phoneNumber } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.isVerified)
                return sendRes(res, 400, "An account with this email already exists.");
            else
                await User.findByIdAndDelete({ _id: existingUser._id });
        }

        const emailVerificationCode = generateVerificationCode();
        await User.create({
            name,
            email,
            password,
            phoneNumber,
            emailVerificationCode,
            verificationCodeExpiresAt: getExpiryTime(10)
        });

        sendEmailVerificationCode(email, emailVerificationCode);
        return sendRes(res, 200, "User created successfully. Please verify your email to login.");
    }
    catch (error) {
        logError("signupUser (auth.controllers.js)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}

export const verifyUserEmail = async (req, res) => {
    try {
        const { email, emailVerificationCode } = req.body;

        if (!email) return sendRes(res, 400, "Email is required.");

        let existingUser = await User.findOne({ email });
        if (!existingUser) return sendRes(res, 400, "No account found. Try signing up.");

        const isMatched = await existingUser.compareVerificationCode(emailVerificationCode);
        if (!isMatched) return sendRes(res, 400, "The verification code entered is incorrect. Please try again.");

        if (existingUser.verificationCodeExpiresAt < Date.now())
            return sendRes(res, 400, "Verification code expired. Try Signingup Again.");

        existingUser = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true, select: "-password -isVerified -emailVerificationCode -verificationCodeExpiresAt -resetPassToken -resetPassTokenExpiresAt" }
        );

        generateTokenAndSetCookie(res, existingUser._id);
        return sendRes(res, 200, "Email verified successfully. Login Successfull.", existingUser);
    }
    catch (error) {
        logError("verifyUserEmail (auth.controllers.js)", error);
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