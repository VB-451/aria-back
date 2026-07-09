import { notificationEvents } from "../../events/notifications.events.js"
import { dateTimeDiff } from "../../utils/dateTimeDiff.js";

const notifications = [];

const notificationParse = notification =>{
    switch(notification.source){
        case "gmail":{
            return `User has new email from ${notification.data.from}\nSubject: ${notification.data.subject}\nID: ${notification.data.id}\n`; break;
        }
        case "todo": {
            const { task } = notification.data;
            const { days, hours, minutes } = dateTimeDiff(notification.data.due);

            const parts = [
                days && `${days} day${days !== 1 ? "s" : ""}`,
                hours && `${hours} hour${hours !== 1 ? "s" : ""}`,
                minutes && `${minutes} minute${minutes !== 1 ? "s" : ""}`,
            ].filter(Boolean);

            return `User has task "${task}" due in ${parts.join(", ")}.\n`;
        }
    }
}

export const addNotification = (source, type, data) => {
    const newNotification = {
        source,
        type,
        timestamp: Date.now(),
        data
    }

    // console.log(newNotification);

    notifications.push(newNotification);
    
    notificationEvents.emit(
        "notification",
        newNotification
    );
    
    notifications.sort((a, b) => a.type.localeCompare(b.source))
    notifications.sort((a, b) => a.source.localeCompare(b.source))
    console.log(returnAllNotifications());
}

export const returnAllNotifications = () =>{
    let notificationsString = '';
    const result = [...notifications];
    notifications.length = 0;
    for(let notification of result){
        notificationsString += notificationParse(notification)
    }
    return notificationsString; 
}

export const hasNotifications = () => {
    return notifications.length > 0;
}