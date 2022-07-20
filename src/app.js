const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var nodemailer = require("nodemailer");
require("dotenv").config();
//router
const router = express.Router();
//middlewares
app.use(cors());
app.use(express.json());
//nodemail config
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const projectSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  link: { type: String },
  github: { type: String },
  photo: { type: String },
});
const model = mongoose.model("project", projectSchema);
//send email
router.post("/email", (req, res) => {
  try {
    if (!req.body.text || !req.body.companyemail)
      return res.json({ message: "complete all fields" });
    var mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: req.body.companyemail,
      text: "\nfrom: " + req.body.companyemail + "\nmessage: " + req.body.text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res
          .status(200)
          .json({ message: "The email could not be sent", emailStatus: false });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: "Sent email", emailStatus: true });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
});
//get projects
router.get("/projects", async (req, res) => {
  const projects = await model.find();
  res.status(200).json(projects);
});

app.use(router);


//server and database connection
mongoose
  .connect(process.env.MONGO)
  .then((res) => {
    app.listen(process.env.PORT || "3000", () => {
      console.log("server:3000");
    });
  })
  .catch((e) => {
    console.log(e);
  });
