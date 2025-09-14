require("dotenv").config();
const mongoose = require("mongoose");
// const startAttendanceCorn = require("../cron/attendanceAlert");
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = () => {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true })
    .then(() => {
      console.log("Connected to MongoDB Successfully");
      // startAttendanceCorn();
      // console.log("Attendance cron job started successfully.");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB", error);
    });
};

module.exports = connectToMongo;