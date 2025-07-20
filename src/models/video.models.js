import mongoose from "mongoose";
const { Schema } = mongoose;
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // Importing the pagination plugin for aggregation

// use aggreation pipeline 

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: true, // cloudinary url for the video file
    },
    thumbnail: {
        type: String, // cloudinary url for the thumbnail
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        type: Number, // duration in seconds from the cloudinary video metadata
        required: true,
    },
    views: {
        type: Number,
        default: 0, // default views count
    }, 
    isPublished: {
        type: Boolean,
        default: false
    },

}, { timestamps: true }); 


videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);