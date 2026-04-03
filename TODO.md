# TODO: Replace Resend with Nodemailer for Forgot Password OTP Email

## Pending Steps:
1. [x] Install nodemailer in Backend (user installed)\n2. [x] Update Backend/config/sendEmail.js to use Nodemailer
3. [ ] User adds SMTP config to Backend/.env (e.g., EMAIL_HOST=smtp.gmail.com, EMAIL_PORT=587, EMAIL_USER=yourgmail@gmail.com, EMAIL_PASS=your_app_password, EMAIL_FROM=no-reply@binkeyit.com)
4. [ ] Run `cd Backend && npm install` to install nodemailer (use cmd for Windows compatibility)
5. [ ] Restart Backend server
6. [ ] Test forgot password flow

## Completed:
- Added "nodemailer":"^7.0.3" to Backend/package.json dependencies
- Rewrote Backend/config/sendEmail.js with Nodemailer (SMTP config, same API signature for {sendTo, subject, html})

Next: Add SMTP details to Backend/.env and run npm install in Backend.

