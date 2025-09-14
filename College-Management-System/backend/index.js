const connectToMongo = require("./Database/db");
const express = require("express");
const app = express();
const path = require("path")
connectToMongo();
const port =  process.env.PORT;
var cors = require("cors");

app.use(cors({
  origin: process.env.CLIENT_URL || "*",

  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],  
}));

app.use(express.json()); //to convert request data to json

app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀")
})

app.use('/media', express.static(path.join(__dirname, 'media')));


// Credential Apis
app.use("/api/student/auth", require("./routes/Student Api/credential.route"));
app.use("/api/faculty/auth", require("./routes/Faculty Api/credential.route"));
app.use("/api/admin/auth", require("./routes/Admin Api/credential.route"));
// Details Apis
app.use("/api/student/details", require("./routes/Student Api/details.route"));
app.use("/api/faculty/details", require("./routes/Faculty Api/details.route"));
app.use("/api/admin/details", require("./routes/Admin Api/details.route"));
// Other Apis
app.use("/api/timetable", require("./routes/Other Api/timetable.route"));
app.use("/api/material", require("./routes/Other Api/material.route"));
app.use("/api/notice", require("./routes/Other Api/notice.route"));
app.use("/api/subject", require("./routes/Other Api/subject.route"));
app.use("/api/marks", require("./routes/Other Api/marks.route"));
app.use("/api/branch", require("./routes/Other Api/branch.route"));
// app.use("/api/curriculum", require("./routes/Other Api/curriculum.route"));
// app.use("/api/assignments", require("./routes/Other Api/assignments.route"));

// app.use("/api/notify-security" , require("./routes/Other Api/notifysecurity.route"));
// app.use("/api/attendance" , require("./routes/Other Api/attendance.route"));
// app.use("/api/result", require("./routes/Other Api/result.route"));

app.listen(process.env.PORT, () => {
  console.log(`Server Listening On ${port}`);
});

// app.listen(port, () => {
//   console.log(`Server Listening On http://localhost:${port}`);
// });