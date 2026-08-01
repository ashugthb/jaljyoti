export function getAdminEmail({ name, email, contact, companyName }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>

      <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

        <table width="100%" cellspacing="0" cellpadding="20">
          <tr>
            <td align="center">

              <table width="600" cellspacing="0" cellpadding="0"
                style="background:#ffffff;border-radius:8px;overflow:hidden;">

                <tr>
                  <td
                    style="background:#0f172a;color:#ffffff;padding:20px;text-align:center;">
                    <h2 style="margin:0;">New Demo Request</h2>
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px;">

                    <p style="font-size:16px;">
                      A new demo request has been submitted from the website.
                    </p>

                    <table
                      width="100%"
                      cellpadding="10"
                      cellspacing="0"
                      style="border-collapse:collapse;border:1px solid #ddd;">

                      <tr>
                        <td style="font-weight:bold;">Name</td>
                        <td>${name}</td>
                      </tr>

                      <tr>
                        <td style="font-weight:bold;">Email</td>
                        <td>${email}</td>
                      </tr>

                      <tr>
                        <td style="font-weight:bold;">Contact</td>
                        <td>${contact}</td>
                      </tr>

                      <tr>
                        <td style="font-weight:bold;">Company</td>
                        <td>${companyName}</td>
                      </tr>

                    </table>

                    <br/>

                    <p>
                      Please contact this lead as soon as possible.
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;
}

export function getCustomerEmail({ name, companyName }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>

      <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

        <table width="100%" cellspacing="0" cellpadding="20">
          <tr>
            <td align="center">

              <table width="600" cellspacing="0" cellpadding="0"
                style="background:#ffffff;border-radius:8px;overflow:hidden;">

                <tr>
                  <td
                    style="background:#2563eb;color:white;padding:20px;text-align:center;">

                    <h2 style="margin:0;">
                      Thank You for Your Demo Request
                    </h2>

                  </td>
                </tr>

                <tr>
                  <td style="padding:30px;">

                    <p>Hi <strong>${name}</strong>,</p>

                    <p>
                      Thank you for your interest in our services.
                    </p>

                    <p>
                      We have successfully received your demo request for
                      <strong>${companyName}</strong>.
                    </p>

                    <p>
                      Our team is reviewing your request and one of our
                      representatives will contact you shortly to schedule
                      a suitable demo.
                    </p>

                    <br/>

                    <p>
                      If you have any urgent questions, simply reply to this
                      email and our team will be happy to help.
                    </p>

                    <br/>

                    <p>
                      Best Regards,
                    </p>

                    <p>
                      <strong>Your Company Name</strong>
                    </p>

                  </td>
                </tr>

                <tr>
                  <td
                    style="background:#f5f5f5;text-align:center;padding:15px;color:#777;font-size:12px;">

                    This is an automated email. Please do not reply unless
                    instructed.

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;
}
