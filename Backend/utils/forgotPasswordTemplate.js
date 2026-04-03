const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Dear ${name || 'User'},</p>

      <p>You requested a password reset. Please use the following OTP to reset your password:</p>

      <div style="background: #fff3cd; color: #222; font-size: 28px; padding: 16px; text-align: center; font-weight: 700; letter-spacing: 4px; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>

      <p>This OTP is valid for 1 hour only. Enter this OTP in the Harvest Green website to continue resetting your password.</p>

      <p>If you did not request this, please ignore this email.</p>

      <br />

      <p>Thanks,<br />Harvest Green</p>
    </div>
  `;
};

export default forgotPasswordTemplate;