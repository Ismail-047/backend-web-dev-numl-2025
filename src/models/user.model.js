import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        default: ""
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    userPassword: {
        type: String,
        required: true,
        minlength: 8
    },
    userLastSeen: {
        type: Date,
        default: null
    },
    isUserVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    userProfilePic: {
        type: String,
        default: ""
    },
    emailVerificationCode: String,
    verificationCodeExpiresAt: Date,
    resetPassToken: String,
    resetPassTokenExpiresAt: Date,

},
    { timestamps: true });

userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("userPassword")) {
            this.userPassword = await bcryptjs.hash(this.userPassword, 10);
        }
        if (this.isModified("emailVerificationCode")) {
            this.emailVerificationCode = await bcryptjs.hash(this.emailVerificationCode, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcryptjs.compare(enteredPassword, this.userPassword);
};

userSchema.methods.compareVerificationCode = async function (emailVerificationCode) {
    return bcryptjs.compare(emailVerificationCode, this.emailVerificationCode);
};

export const User = mongoose.model("User", userSchema);