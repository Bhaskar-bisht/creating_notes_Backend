/** @format */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.Model.js";
import { errorHandler } from "../../utils/error/error.js";

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // check the user provied all field
        if (!username || !email || !password) {
            return next(errorHandler(400, "all field are required"));
        }

        // check user is already exist or not
        const existUser = await User.findOne({ email });
        if (existUser) return next(errorHandler(400, "User already exist"));

        // if new user then hash the user password

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashPassword,
        });

        if (!user) {
            return next(errorHandler(400, "user not create please try again.."));
        }

        res.status(200).json({
            success: true,
            message: `${username} your account created please login...`,
        });
    } catch (error) {
        console.log(`error to register user controller : ${error}`);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(errorHandler(400, "all field are required"));
        }

        //     check the user is exist or not

        let user = await User.findOne({ email });

        if (!user) {
            next(errorHandler(404, "user not found"));
        }

        // if the user is exisst then check there password
        const isCamparePassword = await bcrypt.compare(password, user.password);

        if (!isCamparePassword) {
            next(errorHandler(400, "invalid email or password "));
        }

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        };

        //     if email or password is valid then set a token to user  cookie

        const token = await jwt.sign({ id: user._id }, process.env.SECRATE_KEY, {
            expiresIn: "2d",
        });

        res.cookie("notes_token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 2 * 24 * 60 * 60 * 1000,
        }).json({
            success: true,
            message: `welcome ${user.username}`,
            user,
        });
    } catch (error) {
        console.log(`Login user error : ${error}`);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        res.cookie("notes_token", " ", { maxAge: 0 }).json({
            success: true,
            message: "user logout successfully",
        });
    } catch (error) {
        console.log(`user loggout error : ${error}`);
    }
};
