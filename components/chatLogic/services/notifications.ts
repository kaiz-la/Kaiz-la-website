import { Resend } from 'resend';
import type { Lead } from '@prisma/client'
import {
  isWhatsAppConfigured,
  sendWhatsAppText,
  sendWhatsAppTemplate,
} from '@/lib/whatsapp';

const resend = new Resend(process.env.RESEND_API_KEY);

const recipients = () =>
  (process.env.RECIPIENT_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Emails the sales team a full summary of a chat lead: an AI summary, the
 * structured details, the preferred contact channel, and the transcript.
 */
export async function sendLeadSummaryEmail(
  lead: Lead,
  summary: string,
  transcript: string
): Promise<void> {
  try {
    const to = recipients();
    if (!process.env.SENDER_EMAIL || to.length === 0) {
      console.warn('[email] SENDER_EMAIL / RECIPIENT_EMAILS not set — skipping lead summary');
      return;
    }

    const row = (label: string, value?: string | null) =>
      value
        ? `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">${label}</td><td style="padding:4px 0;color:#111;font-weight:600;">${value}</td></tr>`
        : '';

    const transcriptHtml = transcript
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const isCustomer = line.startsWith('Customer:');
        const text = line.replace(/^(Customer|KaiExpert):\s*/, '');
        return `<div style="margin-bottom:8px;"><span style="font-weight:700;color:${
          isCustomer ? '#cc3433' : '#555'
        };">${isCustomer ? 'Customer' : 'KaiExpert'}:</span> <span style="color:#333;">${text}</span></div>`;
      })
      .join('');

    const { data, error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to,
      subject: `New sourcing lead${lead.name ? ` — ${lead.name}` : ''}${
        lead.productInterest ? ` (${lead.productInterest})` : ''
      }`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;background:#faf7f3;">
          <h1 style="color:#cc3433;margin:0 0 4px;">New Sourcing Lead</h1>
          <p style="color:#6b7280;margin:0 0 20px;">Captured by KaiExpert on the Kaiz La website.</p>

          <div style="background:#fff;border:1px solid #e7ddd1;border-radius:12px;padding:20px;margin-bottom:16px;">
            <h2 style="font-size:15px;color:#555;margin:0 0 8px;">Summary</h2>
            <p style="color:#333;line-height:1.6;margin:0;">${summary || 'No summary available.'}</p>
          </div>

          <div style="background:#fff;border:1px solid #e7ddd1;border-radius:12px;padding:20px;margin-bottom:16px;">
            <h2 style="font-size:15px;color:#555;margin:0 0 8px;">Details</h2>
            <table style="border-collapse:collapse;font-size:14px;">
              ${row('Name', lead.name)}
              ${row('Email', lead.email)}
              ${row('Phone / WhatsApp', lead.phone)}
              ${row('Preferred contact', lead.preferredContact)}
              ${row('Product', lead.productInterest)}
              ${row('Volume', lead.orderVolume)}
              ${row('Destination', lead.preferredRegion)}
              ${row('Timeline', lead.sourcingTimeline)}
            </table>
          </div>

          <div style="background:#fff;border:1px solid #e7ddd1;border-radius:12px;padding:20px;">
            <h2 style="font-size:15px;color:#555;margin:0 0 12px;">Transcript</h2>
            <div style="font-size:13px;line-height:1.5;">${transcriptHtml}</div>
          </div>
        </div>`,
    });
    if (error) {
      console.error('Resend rejected the lead summary email:', error);
      return;
    }
    console.log('Lead summary email sent. id:', data?.id);
  } catch (error) {
    console.error('Failed to send lead summary email:', error);
  }
}

/**
 * Barrier-free WhatsApp handoff. Sends the lead a WhatsApp message via Meta's
 * Cloud API (approved template) and notifies the Kaiz La executive team.
 * No-ops gracefully when WhatsApp env credentials are not set.
 */
export async function notifyLeadOnWhatsApp(lead: Lead): Promise<void> {
  if (!isWhatsAppConfigured()) {
    console.warn('[whatsapp] credentials missing — lead handoff skipped');
    return;
  }

  const firstName = (lead.name || 'there').split(' ')[0];
  const product = lead.productInterest || 'your sourcing needs';

  // 1) Message the customer (business-initiated → must use an approved template)
  if (lead.phone) {
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
    const templateLang = process.env.WHATSAPP_TEMPLATE_LANG || 'en';
    if (templateName) {
      await sendWhatsAppTemplate(lead.phone, templateName, templateLang, [firstName, product]);
    } else {
      // Fallback (only delivers inside an open 24h session window)
      await sendWhatsAppText(
        lead.phone,
        `Hi ${firstName}! This is Kaiz La. Thanks for your interest in sourcing ${product}. ` +
          `A sourcing executive will continue right here on WhatsApp shortly.`
      );
    }
  }

  // 2) Notify the executive team
  const teamNumber = process.env.WHATSAPP_TEAM_NUMBER;
  if (teamNumber) {
    await sendWhatsAppText(
      teamNumber,
      `🟢 New sourcing lead\n` +
        `Name: ${lead.name || 'N/A'}\n` +
        `Phone: ${lead.phone || 'N/A'}\n` +
        `Product: ${lead.productInterest || 'N/A'}\n` +
        `Volume: ${lead.orderVolume || 'N/A'}\n` +
        `Region: ${lead.preferredRegion || 'N/A'}\n` +
        `Timeline: ${lead.sourcingTimeline || 'N/A'}`
    );
  }
}

export async function sendNewLeadNotification(leadData: Lead) {
    try {
        const formattedCallDate = leadData.callDate
            ? new Date(leadData.callDate).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })
            : 'N/A';

        await resend.emails.send({
            from: process.env.SENDER_EMAIL!,
            to: process.env.RECIPIENT_EMAILS!,
            subject: `New Sourcing Lead: ${leadData.company || 'Unknown Company'}`,
            html: `
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="20" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td align="center" style="border-bottom: 2px solid #eeeeee;">
                      <h1 style="color: #333333; margin: 0;">New Sourcing Lead Captured</h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h2 style="color: #555555; border-bottom: 1px solid #dddddd; padding-bottom: 5px;">Contact Details</h2>
                      <p style="color: #333; line-height: 1.6;">
                        <strong>Name:</strong> ${leadData.name || 'N/A'}<br>
                        <strong>Company:</strong> ${leadData.company || 'N/A'}<br>
                        <strong>Email:</strong> ${leadData.email || 'N/A'}<br>
                        <strong>Phone:</strong> ${leadData.phone || 'N/A'}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h2 style="color: #555555; border-bottom: 1px solid #dddddd; padding-bottom: 5px;">Sourcing Requirements</h2>
                      <p style="color: #333; line-height: 1.6;">
                        <strong>Product Interest:</strong> ${leadData.productInterest || 'N/A'}<br>
                        <strong>Order Volume:</strong> ${leadData.orderVolume || 'N/A'}<br>
                        <strong>Preferred Region:</strong> ${leadData.preferredRegion || 'N/A'}<br>
                        <strong>Sourcing Timeline:</strong> ${leadData.sourcingTimeline || 'N/A'}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f9f9f9; border-top: 2px solid #eeeeee;">
                      <h2 style="color: #555555; border-bottom: 1px solid #dddddd; padding-bottom: 5px;">Call Status</h2>
                      <p style="color: #333; line-height: 1.6;">
                        <strong>Call Scheduled:</strong> <span style="font-weight: bold; color: ${leadData.scheduledCall ? '#28a745' : '#dc3545'};">${leadData.scheduledCall ? 'Yes' : 'No'}</span><br>
                        <strong>Call Date:</strong> ${formattedCallDate}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
             `
        });
        console.log("New lead notification email sent successfully.");
    } catch (error) {
        console.error("Failed to send notification email:", error);
    }
}