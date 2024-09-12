/** @format */

import mongoose from "mongoose";

const connectDB = async (database_uri) => {
    try {
        await mongoose
            .connect(database_uri)
            .then((res) => console.log(`Database connect successfully...`))
            .catch((err) => console.error(`error to database connectivity..${err}`));
    } catch (error) {
        console.error(`error to connect database : ${error}`);
    }
};

export default connectDB;
