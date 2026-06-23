const notifications = [];


const notificationParse = notification =>{
    switch(notification.source){
        case "gmail":{
            return `User has new email from ${notification.data.from}\nSubject: ${notification.data.subject}\nID: ${notification.data.id}\n`; break;
        }
        case "todo": {
            const { task } = notification.data.task;
            const { days, hours, minutes } = notification.data.remainingTime;

            const parts = [
                days && `${days} day${days !== 1 ? "s" : ""}`,
                hours && `${hours} hour${hours !== 1 ? "s" : ""}`,
                minutes && `${minutes} minute${minutes !== 1 ? "s" : ""}`,
            ].filter(Boolean);

            return `User has task "${task}" due in ${parts.join(", ")}.`;
        }
    }
}

export const addNotification = (source, type, data) => {
    notifications.push({
        source,
        type,
        timestamp: Date.now(),
        data
    });
    notifications.sort((a, b) => a.type.localeCompare(b.source))
    notifications.sort((a, b) => a.source.localeCompare(b.source))
}

export const returnAllNotifications = () =>{
    let notificationsString = '';
    const result = [...notifications];
    notifications.length = 0;
    for(let notification of result){
        notificationsString += notificationParse(notification)
    }
    console.log(notificationsString);
    return notificationsString; 
}

export const hasNotifications = () => {
    return notifications.length > 0;
}