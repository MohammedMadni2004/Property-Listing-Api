import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    await resend.emails.send({
      from: `Property Listing <${process.env.EMAIL_FROM || 'default@example.com'}>`,
      to: to,
      subject: subject,
      html: `<p>${text}</p>`, 
    });
    
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error("Failed to send email");
  }
}
