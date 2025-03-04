import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendEmail {
  constructor(private readonly mailerService: MailerService) {}

  forgetPassword(user, resetCode) {
    return this.mailerService.sendMail({
      to: user.email,
      from: 'Orders API',
      subject: 'Reset Your Password',
      html: `
     <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            margin: auto;
        }
        h2 {
            color: #333;
        }
        p {
            color: #555;
            font-size: 16px;
        }
        .reset-code {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>

<div class="email-container">
    <h2>Password Reset Request</h2>
    <p>Dear <strong>${user.username}</strong>,</p>
    <p>You recently requested to reset your password. To complete the process, please use the following reset code:</p>
    <div class="reset-code">${resetCode}</div>
    <p>If you did not request this change, you can safely ignore this email. Your account security is important to us, so please do not share this code with anyone.</p>
    <p class="footer">Best regards,<br><strong>${user.username}</strong></p>
</div>

</body>
</html>
`,
    });
  }
  orderStatus(user, status) {
    return this.mailerService.sendMail({
      to: user.email,
      from: 'Orders API',
      subject: 'Order Status',
      html: `
 <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Status Update</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            margin: auto;
            text-align: left;
        }
        h2 {
            color: #333;
            text-align: center;
        }
        p {
            color: #555;
            font-size: 16px;
            line-height: 1.6;
        }
        .status-box {
            background-color: #007BFF;
            color: #ffffff;
            padding: 12px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
            text-align: center;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
            text-align: center;
        }
        .contact-info {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
            text-align: center;
        }
        .company-name {
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
<body>

<div class="email-container">
    <h2>Order Status Update</h2>
    <p>Dear <strong>${user.username}</strong>,</p>
    
    <p>We hope this email finds you well. We wanted to update you on the current status of your order:</p>

    <div class="status-box">${status}</div>

    <p>If you have any questions or need further assistance, please feel free to contact our support team.</p>

    <p class="footer">Best regards,<br><span class="company-name">Order API</span></p>

    <p class="contact-info">📧 diaa@diaaqassem.com | 📞 +20 1027188682</p>
</div>

</body>
</html>`,
    });
  }
}
