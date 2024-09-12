/** @format */

import { Notes } from "../../models/note.model.js";
import { errorHandler } from "../../utils/error/error.js";

export const createNote = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;

        const userId = req.id;

        // console.log("req id se aayi user ki is ", id);
        // console.log("req id ki value note controller main ", req.id);

        if (!title || !content) {
            return next(errorHandler(400, "all field are require"));
        }

        const note = await Notes.create({
            title,
            content,
            userId,
            tags: tags || [],
        });

        if (!note) {
            return next(errorHandler(400, "note's not created pleae try again"));
        }

        res.status(200).json({
            success: true,
            message: "note create successfully..",
            note,
        });
    } catch (error) {
        console.log(`note's create error : ${error}`);
    }
};

export const editNote = async (req, res, next) => {
    try {
        const { title, content, tags, isPinned } = req.body;

        const noteId = req.params.id;

        const note = await Notes.findByIdAndUpdate(noteId);

        if (!title && !content && !tags) {
            return next(errorHandler(400, "no changes"));
        }

        if (!note) {
            return next(errorHandler(404, " edit note not found "));
        }

        //     check the user only update our own notes

        if (req.id !== note.userId) {
            return next(errorHandler(401, "you are not a note admin"));
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        // if all ok then save the notes new data

        await note.save();

        res.status(200).json({
            success: true,
            message: "note updated..",
            note,
        });
    } catch (error) {
        console.log(`error to edit note : ${error}`);
    }
};

export const getAllNotes = async (req, res, next) => {
    try {
        // find all note with the user id
        const userId = req.id;

        // if the isPinned is true then show the note first
        const note = await Notes.find({ userId }).sort({ isPinned: -1 });

        if (!note) {
            return next(errorHandler(400, " can not get all note "));
        }

        res.status(200).json({
            success: true,
            message: "all note are here..",
            notes: note,
        });
    } catch (error) {
        next(errorHandler());
        console.log(`error to get all notes ${error}`);
    }
};

export const deleteNote = async (req, res, next) => {
    try {
        const noteId = req.params.id;
        const userId = req.id;

        if (!noteId) {
            next(errorHandler(400, "provide a note id"));
        }

        // find the notes in database

        const note = await Notes.findOne({ _id: noteId, userId: userId });

        if (!note) {
            return next(errorHandler(404, "deleted note not found"));
        }

        await Notes.deleteOne({ _id: noteId, userId: userId });

        res.status(200).json({
            success: true,
            message: "note delete successfully..",
        });
    } catch (error) {
        console.log(`delete note error : ${error}`);
        next(errorHandler());
    }
};

export const updateIsPinned = async (req, res, next) => {
    try {
        const noteId = req.params.id;

        const userId = req.id;

        const { isPinned } = req.body;

        // find the note
        const note = await Notes.findByIdAndUpdate(noteId);

        if (!note) {
            return next(errorHandler(404, "note not found"));
        }

        // check if user are author of note

        if (userId !== note.userId) {
            return next(errorHandler(401, "only author can update note"));
        }

        note.isPinned = isPinned;

        note.save();

        res.status(200).json({
            success: true,
            message: "note updated",
            notes: note,
        });
    } catch (error) {
        console.log(`note pin error : ${error}`);
        next(errorHandler());
    }
};

export const searchNote = async (req, res, next) => {
    const { query } = req.query;

    if (!query) {
        return next(errorHandler(400, " please search.."));
    }

    try {
        const matchingNote = await Notes.find({
            userId: req.id,
            $or: [{ title: { $regex: new RegExp(query, "i") } }, { content: { $regex: new RegExp(query, "i") } }],
        });

        if (matchingNote.length === 0) {
            return next(errorHandler(404, "Please create a note first."));
        }

        res.status(200).json({
            success: true,
            message: "matching note's...",
            notes: matchingNote,
        });
    } catch (error) {
        next(errorHandler());
    }
};
