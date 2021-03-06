/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 'use strict';

 const functions = require('firebase-functions');
 const nodemailer = require('nodemailer');
 // Configure the email transport using the default SMTP transport and a GMail account.
 // For other types of transports such as Sendgrid see https://nodemailer.com/transports/
 // TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
 const gmailEmail = functions.config().gmail.email;
 const gmailPassword = functions.config().gmail.password;
 const mailTransport = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: gmailEmail,
     pass: gmailPassword,
   },
 });
 
 // Sends an email confirmation when a user changes his mailing list subscription.
 exports.sendEmailConfirmation = functions.database.ref('/users/{uid}/bookings/{fbid}').onCreate((snapshot, context) => {
 
   const val = snapshot.val();
   functions.logger.log('Data Change',val)
 
   const mailOptions = {
     from: '"Desk Request" <noreply@deskrequest.com>',
     to:  val.email
   };

   const bookingref = val.dbookid
 
    // Building Email message.
   mailOptions.subject = 'Desk Request Booking Confirmation ' + val.dbookid;
   mailOptions.text = 'Thanks you for your desk booking. Your booking reference is: ' + val.dbookid +
                      '\nDesk Booked: ' + val.deskid +
                      '\nDate: ' + val.d_date +
                      '\nDuration:  ' + val.d_duration +
                      '\n\n\nRegards \nThe Desk Request Booking Team'
   
   try {
     mailTransport.sendMail(mailOptions);
     functions.logger.log('Confirmation email sent to:', val.email);
   } catch(error) {
     functions.logger.error(
       'There was an error while sending the email:',
       error
     );
   }
   return null;
 });

 exports.sendRoomEmailConfirmation = functions.database.ref('/users/{uid}/roombookings/{fbid}').onCreate((snapshot, context) => {
 
  const val = snapshot.val();
  functions.logger.log('Data Change',val)

  const mailOptions = {
    from: '"Desk Request" <noreply@deskrequest.com>',
    to:  val.email
  };

  const bookingref = val.rbookid

   // Building Email message.
  mailOptions.subject = 'Desk Request Booking Confirmation ' + val.rbookid;
  mailOptions.text = 'Thanks you for your Room booking. Your booking reference is: ' + val.rbookid +
                     '\nRoom Booked: ' + val.roomname +
                     '\nRoom Type: ' + val.roomtype +
                     '\nDate: ' + val.d_date +
                     '\nDuration:  ' + val.d_duration +
                     '\n\n\nRegards \nThe Desk Request Booking Team'
  
  try {
    mailTransport.sendMail(mailOptions);
    functions.logger.log('Confirmation email sent to:', val.email);
  } catch(error) {
    functions.logger.error(
      'There was an error while sending the email:',
      error
    );
  }
  return null;
});