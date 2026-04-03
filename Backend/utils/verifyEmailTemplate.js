const verifyEmailTemplate = ({ name, url }) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Dear ${name || 'User'},</p>
      
      <p>Thank you for registering with Harvest Green.</p>
      
      <p>Please click the button below to verify your email address:</p>
      
      <a 
        href="${url}" 
        style="display: inline-block; margin-top: 10px; padding: 12px 20px; background-color: #222; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;"
        target="_blank"
      >
        Verify Email
      </a>

      <p style="margin-top: 20px;">If the button does not work, copy and paste this link into your browser:</p>
      <p><a href="${url}" target="_blank" style="color: #1a73e8; word-break: break-all;">${url}</a></p>

      <p style="margin-top: 20px;">Thanks,<br />Harvest Green</p>
    </div>
  `;
};

export default verifyEmailTemplate;