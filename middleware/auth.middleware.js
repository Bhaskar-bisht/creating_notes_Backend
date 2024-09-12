/** @format */

import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error/error.js";

export const userAuthentication = async (req, res, next) => {
    try {
        const token = req.cookies.notes_token;

        if (!token) {
            return next(errorHandler(401, "user not login..!"));
        }

        //     if token is get form frontend then check is valid or not

        const verifyToken = await jwt.verify(token, process.env.SECRATE_KEY);

        // console.log("verifyToken value is ", verifyToken);

        if (!verifyToken) {
            next(errorHandler(404, "user token is not valid"));
        }

        req.id = verifyToken.id;

        // console.log("middleware main req.id  ki value ", req.id);

        next();
    } catch (error) {
        console.log(`User Authentication Error : ${error}`);
    }
};
