/** @format */

import express from "express";
import {
    createNote,
    deleteNote,
    editNote,
    getAllNotes,
    searchNote,
    updateIsPinned,
} from "../controllers/notesController/note.controller.js";
import { userAuthentication } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/create").post(userAuthentication, createNote);
router.route("/edit/:id").put(userAuthentication, editNote);
router.route("/all").get(userAuthentication, getAllNotes);
router.route("/delete/:id").delete(userAuthentication, deleteNote);
router.route("/update-note-pinned/:id").put(userAuthentication, updateIsPinned);
router.route("/search").get(userAuthentication, searchNote);

export default router;
