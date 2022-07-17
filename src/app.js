const express = require("express");
const cors = require("cors");
const app = express();
//middlewares
app.use(cors());
app.use(express.json());
//router
const router = express.Router();
//nodemail
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "joseluissequeirag@gmail.com",
    pass: "ovewlqjeudnkvoiq",
  },
});
//send email
router.post("/email", (req, res) => {
  try {
    if (!req.body.text || !req.body.companyemail || !req.body.subject)
      return res.json({ message: "complete all fields" });
    var mailOptions = {
      from: "joseluissequeirag@gmail.com",
      to: "joseluissequeirag@gmail.com",
      subject: req.body.subject,
      text:
        "\nfrom: " +
        req.body.companyemail +
        "\nsubject: " +
        req.body.subject +
        "\nmessage: " +
        req.body.text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(200).json({ message: "The email could not be sent" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: "Sent email" });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
});

app.use(router);
//server
app.listen("3000", () => {
  console.log("server:3000");
});
