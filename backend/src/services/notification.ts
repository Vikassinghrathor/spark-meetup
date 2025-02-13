import nodemailer from 'nodemailer';
import { messaging } from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure required environment variables are present
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
  throw new Error(
    'Missing email configuration in environment variables. Please ensure EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS are set in the .env file.'
  );
}

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: parseInt(EMAIL_PORT, 10),
  secure: false, // Use TLS
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

class NotificationService {
  /**
   * Sends an email notification.
   * @param to - Recipient email address.
   * @param subject - Email subject.
   * @param text - Email body (plain text).
   * @param html - Email body (HTML).
   */
  static async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Spark Meetup" <${EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw new Error('Failed to send email notification.');
    }
  }

  /**
   * Sends a push notification.
   * @param token - Device token to send the notification to.
   * @param title - Notification title.
   * @param body - Notification body.
   * @param data - Additional data to include in the notification.
   */
  static async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<void> {
    try {
      const message = {
        token,
        notification: {
          title,
          body,
        },
        data,
      };

      await messaging().send(message);
      console.log(`Push notification sent to token: ${token}`);
    } catch (error) {
      console.error(`Failed to send push notification to token: ${token}`, error);
      throw new Error('Failed to send push notification.');
    }
  }
}

export default NotificationService;
```

---

### Explanation of the Code

1. **Environment Variables**:
   - The `dotenv` package is used to load email configuration from the `.env` file.
   - Required variables: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`.

2. **Email Notifications**:
   - The `nodemailer` library is used to send emails.
   - A transporter is configured using the email credentials from the environment variables.
   - The `sendEmail` method sends an email with the specified recipient, subject, and body (plain text or HTML).

3. **Push Notifications**:
   - The Firebase Admin SDK's `messaging` service is used to send push notifications.
   - The `sendPushNotification` method sends a notification to a specific device token with a title, body, and optional data payload.

4. **Error Handling**:
   - Both methods include `try-catch` blocks to handle errors gracefully.
   - Errors are logged to the console, and a generic error message is thrown.

5. **Logging**:
   - Successful email and push notifications are logged to the console for debugging purposes.

---

### Final Notes

- **Environment Variables**:
  Ensure the `.env` file contains the following variables:
  ```
  EMAIL_HOST=smtp.example.com
  EMAIL_PORT=587
  EMAIL_USER=your-email@example.com
  EMAIL_PASS=your-email-password
  ```

- **Usage**:
  Import the `NotificationService` class and call its methods to send email or push notifications:
  ```typescript
  import NotificationService from './services/notification';

  // Send an email
  await NotificationService.sendEmail(
    'recipient@example.com',
    'Welcome to Spark Meetup',
    'Thank you for joining Spark Meetup!',
    '<p>Thank you for joining <strong>Spark Meetup</strong>!</p>'
  );

  // Send a push notification
  await NotificationService.sendPushNotification(
    'device-token',
    'New Broadcast Available',
    'Join the latest broadcast now!',
    { broadcastId: '12345' }
  );
  ```

- **Dependencies**:
  Ensure `nodemailer` is installed in the backend workspace:
  ```
  npm install nodemailer
  