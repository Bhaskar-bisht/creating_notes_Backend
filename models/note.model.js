/** @format */

import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    tags: {
        type: [String],
        default: [],
    },

    isPinned: {
        type: Boolean,
        default: false,
    },

    //     userId: {
    //         type: mongoose.Schem.Types.ObjectId,
    //         ref: "User"
    //     },
    userId: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export const Notes = mongoose.model("Notes", noteSchema);
