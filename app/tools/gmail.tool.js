import { google } from "googleapis";
import fs from "fs";
import { htmlToText } from "html-to-text";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

const tokens = JSON.parse(
  fs.readFileSync("./storage/gmail-tokens.json", "utf8")
);

oauth2Client.setCredentials(tokens);

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

const getHeader = (headers, name) => {
  const header = headers.find(
    h => h.name.toLowerCase() === name.toLowerCase()
  );

  return header ? header.value : null;
}

export const getRecentEmails = async (count = 10) => {
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: count,
      q: "in:inbox category:primary"
    });

    const messages = response.data.messages || [];

    const emails = await Promise.all(
      messages.map(async message => {
        const fullMessage = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });

        const headers = fullMessage.data.payload?.headers || [];

        return {
          id: message.id,
          from: getHeader(headers, "From"),
          subject: getHeader(headers, "Subject"),
          date: getHeader(headers, "Date"),
          snippet: fullMessage.data.snippet,
        };
      })
    );

    return emails;
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    throw error;
  }
}


const decodeBase64Url = data => {
  if (!data) return null;

  return Buffer.from(
    data.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString("utf8");
}

const cleanBody = html => {
  if (!html) return null;

  return htmlToText(html, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { hideLinkHrefIfSameAsText: true } }
    ]
  });
}

const extractBody = payload => {
  if (!payload) return null;

  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (payload.parts?.length) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
    }

    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
    }

    for (const part of payload.parts) {
      const result = extractBody(part);
      if (result) return result;
    }
  }

  return null;
}

export const readEmail = async emailId => {
  try {
    const res = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
      format: "full",
    });

    const message = res.data;
    const headers = message.payload?.headers || [];

    return {
      from: getHeader(headers, "From"),
      subject: getHeader(headers, "Subject"),
      date: getHeader(headers, "Date"),
      body: cleanBody(extractBody(message.payload))
    };
  } catch (err) {
    console.error("Failed to read email:", err);
    throw err;
  }
}