import { getRecentEmails } from "../tools/gmail.tool.js";
import { addNotification } from "../services/notifications/notifications.service.js";
import { getConfigParameter } from "../services/configuration/configuration.service.js";

let lastSeenID = null;

const pollGmail = async () => {
  try {
    const latest = await getRecentEmails(6);
    const index = latest.findIndex(email => email.id === lastSeenID);
    const newEmails = index === -1 ? latest : latest.slice(0, index);
    for (const email of newEmails.reverse()){
      console.log("new email", email);
      addNotification("gmail", "new_mail", email);
    }
    lastSeenID = latest[0].id;
  } catch (error) {
    console.error(error);
  }
}

export const startGmailWatcher = async () =>{
  const latest = await getRecentEmails(1);
  lastSeenID = latest[0].id;
  setInterval(pollGmail, getConfigParameter("gmailInterval") * 1000);
}
