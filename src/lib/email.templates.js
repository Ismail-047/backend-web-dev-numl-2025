export const VERIFICATION_EMAIL_TEMPLATE = `<!doctype html>
<html lang="en">

<head>
   <meta charset="UTF-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link rel="preload" href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap"
      as="style" onload="this.rel='stylesheet'">
   <noscript>
      <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap" rel="stylesheet">
   </noscript>
   <title>Verify Email - Chat Nexus</title>
   <style>
      * {
         margin: 0;
         padding: 0;
         box-sizing: border-box;
         font-family: "League Spartan", sans-serif;
      }
   </style>
</head>

<body style="max-width: 500px; margin: 0 auto;">
   <div style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); border-radius: 5px; width: 100%;">
      <h1
         style="width: 100%; text-align: center; font-weight: bold; background-color: #7351F9; color: white;  padding: 20px 0px; font-size: 23px;">
         EMAIL VERIFICATION
      </h1>
      <div style="background-color: rgb(241, 241, 241); padding: 20px; width: 100%; border-radius: 5px;">
         <p style="padding-bottom:5px;">
            Dear User,
         </p>
         <p style="line-height: 1.4;">
            Thank you for creating an account with Chat Nexus. To complete your registration, please verify your
            email.
         </p>
         <div style="margin: 15px 0px; width: 100%; text-align: center;">
            <p style="line-height: 2; font-weight: bold; font-size: 18px;">
               YOUR VERIFICATION CODE
            </p>
            <p style="letter-spacing: 7px; font-size: 30px; font-weight: bold; color: #7351F9;">
               {verificationCode}
            </p>
         </div>
         <p style="line-height: 1.4;">
            Please enter this code in the required field to complete the verification process. This will help us
            ensurethat your account is secure.
         </p>
         <p style="margin: 15px 0px;">
            This code will expire in 30 minutes for security reasons.
         </p>
         <p style="margin-bottom: 15px;">
            If you didn't create an account with us, please ignore this email.
         </p>
         <p style="font-weight:700; line-height: 1.3;">
            Best regards,<br>Support Team - Chat Nexus
         </p>
      </div>
   </div>
   <div style="color: #888; font-size: 12px; text-align: center; margin-top: 12px;">
      <p>This is an automated message, please do not reply to this email.</p>
   </div>
</body>

</html>`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Verify Your Email</title>
   <style>
      p {
         margin: 10px 0px;
      }
   </style>
</head>

<body
   style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333; max-width: 500px; margin: 0 auto; padding: 20px;">

   <div style="background-color:#009c8d; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Password Reset Request</h1>
   </div>

   <div
      style="background-color: #f9f9f9; padding: 20px 30px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <p>Dear User,</p>
      <p>
         We received a request to reset the password for your account. Please click the link below to reset your
         password:
      </p>

      <div style="margin: 30px 0px; width: 100%; display: flex; align-items: center; justify-content: center;">
         <a href="{RESET_PASS_LINK}"
            style="border-radius: 5px; background-color: #009c8d; color: white; text-decoration: none; padding: 12px 25px; font-weight: bold;">
            Reset Password
         </a>
      </div>

      <p>
         For your security, this link will expire in the next 30 minutes. If you did not request a password reset,
         please disregard this email. Your account will remain secure.
      </p>
      <p>
         If you have any questions or need further assistance, feel free to contact us.
      </p>
      <p style="font-weight: bold;">
         Best regards,<br>Mikaz Health Care Support Team
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
      <p>This is an automated message, please do not reply to this email.</p>
   </div>

</body>

</html>
`;