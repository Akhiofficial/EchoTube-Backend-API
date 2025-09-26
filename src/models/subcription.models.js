import mongoose, { Schema, Types } from "mongoose";

const subcriptionSchema = ({
    subscriber:{
        type: Schema.Types.ObjectId, // one who subscribing 
        ref: "User"
    }, 
    channel: {
        type: Schema.Types.ObjectId, // one whom subcriber subcribing
        ref: "User"
    },
}, { timestamps: true })


export const SubcriptionSchema = mongoose.model("subcription",subcriptionSchema)