import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";




const userSchema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: Number
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },
    avatar: {
        type: String, // cloudnary url 
        required: true,
    },
    coverImage: {
        type: String,
    },
    // refresh token for user
    refreshToken: {
        type: String
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
}, { timestamps: true });

// pre used before something for hashing password before saving user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // it checks if the password is modified or not becouse we donts want to bcrypt the password if it is not modified

    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// used to check password is correct after crypting 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); // compare the password with the hashed password
};




// it generates the Access Token for  user
userSchema.methods.genrateAccessToken = function () {
    // this is payload come from DB
    return jwt.sign({
        id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
    )

}

// it generates the Refresh Token for user
userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign({
        id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    )
}





export const User = mongoose.model("User", userSchema);