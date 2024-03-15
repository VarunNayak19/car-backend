import express from "express";
import { PORT, mongodbURL } from "./config.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer"
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();
const gmailPin = process.env.GMAIL_PIN

const app = express();

//middle ware for parsing request body
app.use(express.json());


//middleware for handling cors
//option 1 allow all origins
app.use(cors());
// option 2 allow custom origin
// app.use(cors({
//     origin:'*',
//     methods:['GET','POST','DELETE','PUT'],
// }));

app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome to the server");

});


mongoose.connect(mongodbURL).then(() => {
  console.log("Connected to database");
  app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
  });
}).catch((error) => {
  console.log(error)
})


//nodemailer

app.post('/send-email', async (req, res) => {
  console.log(req.body);
  const { email, name, date, mobile, car, carRent } = req.body;

  // Create a nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'varunrunrunrun@gmail.com', // Replace with your Gmail email address
      pass: gmailPin // Replace with your Gmail password or application-specific password if using 2FA
    }
  });
  console.log(email)
  let mailOptions = {
    from: 'varunrunrunrun@gmail.com',
    to: email,
    subject: 'Car Rental Booking Confirmation',
    html: `
          <p>Dear ${name},</p>
          <p>Thank you for choosing our car rental service. Your booking has been confirmed for the following details:</p>
          
          <table style="border-collapse: collapse; width: 100%;">
              <tr>
                  <th style="border: 1px solid #ddd; padding: 8px;"><strong>Attribute</strong></th>
                  <th style="border: 1px solid #ddd; padding: 8px;"><strong>Value</strong></th>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Make</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.make}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Model</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.model}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Year</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.year}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Class</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.class}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Fuel Type</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.fuel_type}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Transmission</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.transmission}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Drive</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.drive}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Cylinders</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.cylinders}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Displacement</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.displacement}L</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>City MPG</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.city_mpg}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Highway MPG</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.highway_mpg}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Combined MPG</strong></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${car.combination_mpg}</td>
              </tr>
          </table>
          
          <p><strong>Rental Cost:</strong> ₹${carRent}</p>
          
          <p>Thank you for your booking. Please let us know if you have any further questions.</p>
          
          <p>Best regards,<br>Car Hub</p>
      `,
  };



  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
      res.status(500).json({ error: 'Error sending email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));






