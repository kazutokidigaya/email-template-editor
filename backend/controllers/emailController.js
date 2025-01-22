import EmailTemplate from "../models/emailTemplate.js";
// import nodemailer from "nodemailer";

export const getTemplates = async (req, res) => {
  const { category } = req.query;
  try {
    const query = category ? { category } : {};
    const templates = await EmailTemplate.find(query).select("name layoutHTML");
    res.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error.message);
    res.status(500).json({ error: "Error fetching templates" });
  }
};

// Save email template
export const saveTemplate = async (req, res) => {
  const { name, layoutHTML, layoutCSS, layoutJs, variables } = req.body;
  try {
    const newTemplate = new EmailTemplate({
      name,
      layoutHTML,
      layoutCSS,
      layoutJs: layoutJs || "",
      variables,
    });
    await newTemplate.save();
    res.json({ message: "Template saved successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render final email template
export const renderTemplate = async (req, res) => {
  const { layoutHTML, layoutCSS, layoutJS, variables } = req.body;

  try {
    let renderedHTML = layoutHTML;

    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      renderedHTML = renderedHTML.replace(regex, variables[key]);
    });

    // Combine HTML, CSS, and JS
    const completeHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>${layoutCSS}</style>
        </head>
        <body>
          ${renderedHTML}
          <script>${layoutJS || ""}</script>
        </body>
        </html>
      `;

    res.setHeader("Content-Type", "text/html");
    res.send(completeHTML);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send Mail API

// export const sendMail = async (req, res) => {
//   const { layoutHTML, layoutCSS, layoutJS, variables, to, subject } = req.body;

//   try {
//     // Combine HTML, CSS, and JS into a complete email template
//     let renderedHTML = layoutHTML;

//     // Replace placeholders in the HTML with the variables
//     Object.keys(variables).forEach((key) => {
//       const regex = new RegExp(`{{${key}}}`, "g");
//       renderedHTML = renderedHTML.replace(regex, variables[key]);
//     });

//     const completeHTML = `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>${subject}</title>
//           <style>${layoutCSS}</style>
//         </head>
//         <body>
//           ${renderedHTML}
//           <script>${layoutJS || ""}</script>
//         </body>
//         </html>
//       `;

//     // Configure Nodemailer transport
//     const transporter = nodemailer.createTransport({
//       service: "Gmail", // Use Gmail or any other service
//       auth: {
//         user: process.env.EMAIL_USER, // Your email address
//         pass: process.env.EMAIL_PASS, // Your email password or app password
//       },
//     });

//     console.log(completeHTML);
//     // Define email options
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       html: completeHTML, // The full HTML content
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Error sending email:", error.message);
//     res.status(500).json({ error: "Failed to send email." });
//   }
// };
