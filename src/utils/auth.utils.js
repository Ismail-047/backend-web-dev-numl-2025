import jwt from "jsonwebtoken";

/**
 * GENERATES A JSON WEB TOKEN FOR THE GIVEN USER ID, SETS IT AS A COOKIE.
 * 
 * @param {Object} res - THE RESPONSE OBJECT FROM THE EXPRESS.JS SERVER.
 * @param {string} userId - THE ID OF THE USER FOR WHOM THE TOKEN IS GENERATED.
 * 
 * @returns {string} - THE GENERATED JWT TOKEN.
 */
export const generateTokenAndSetCookie = async (res, userId) => {

    // SIGN TOKEN
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

    // SET COOKIE
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 DAYS
    })

    return token;
}