import _ from "lodash"; 
import {v4 as uuid} from "uuid";
import { 
    queryAllRemindersByUserId,
    createReminder, 
    removeReminder,
    findReminderById,
    filterReminders,
    updateReminder
} from "../services/reminderService.js";
import { validateReminderForm } from "../validator/validator.js";
import { eventEmitter } from "../emitter/reminderEmitter.js";


const parseReqBody = body => {
    const data = {};

    if (body.dateEnable && "date" in body) {
        data["date"] = body.date
        const dateValue = body.date.split("-")
		data["month"] = dateValue[1]
        data["day"] = dateValue[2]
        data["repeat"] = 1
    }

    if (body.timeEnable && "time" in body) {
        data["time"] = body.time
        const timeValue = body.time.split(":")
        data["hour"] = timeValue[0]
        data["minutes"] = timeValue[1]
    } else if (body.dateEnable && !body.timeEnable) {
        data["hour"] = "*"
        data["minutes"] = "*"
    }

    if (body.repeatEnable) {
        if (body.minutes === "1") {
            data["minutes"] = "*";
        } else {
            data["minutes"] = body.minutes
        }

        data["hour"] = "*";
        data["day"] = "*";
        data["month"] ="*";
        data["repeat"] = body.repeat
    }

    if (body.enableEmail) {
        data["email"] = body.email; 
    }

    if (body.enableSMS) {
        data["mobile"] = body.mobile;
    }

    data["_id"] = body._id;
    data["title"] = body.title;
    data["content"] = body.content; 
    data["dateEnable"] = body.dateEnable;
    data["timeEnable"] = body.timeEnable;
	data["utcDateTime"] = body.utcDateTime;
    data["weekday"] = "*";
    data["status"] = "INACTIVE";
    data["repeatEnable"] = body.repeatEnable;
    data["enableEmail"] = body.enableEmail;
    data["enableSMS"] = body.enableSMS;
    data["userId"] = body.userId

    return data;
};


const getAllRemindersForUser = async (req, res) => {
    const id = req.user._id
    const reminders = await queryAllRemindersByUserId(id);
    
    res.send(reminders);
};


const getReminderById = async (req, res) => {
    const _id = req.body.id;
    const reminder = await findReminderById(_id);

    if (reminder) {
        return res.send(reminder);
    } else {
        return res.send("No reminders found with that title.");
    };
};


const getActiveReminders = async () => {
    const reminders = await filterReminders({status: "ACTIVE"});

    return reminders;
};


const changeReminderStatus = async (reminder, status) => {
    const data = reminder
    data["status"] = status
    const result = await updateReminder(data);

    if (result) {
        return `Updated ${reminder.title} status to ${status}.`
    } else {
        return "Failed to change reminder status."   
    };
};


const changeReminder = async (req, res) => {
    const validateStatus = validateReminderForm(req.body)
    if (!validateStatus.status) {
        res.status(500).send(validateStatus.error)
    } else {
        const data = parseReqBody(req.body)
        const reminder = await updateReminder(data);
        
        if (reminder) {
            res.send(`Updated ${reminder.title}`);
        } else {
            res.send("Failed to update reminder.")
        }
    }
};


const postReminder = async (req, res) => {
    const validateStatus = validateReminderForm(req.body)
    if (!validateStatus.status) {
        res.status(500).send(validateStatus.error)
    } else {
        req.body["_id"] = uuid();
        const data = parseReqBody(req.body)
        const result = await createReminder(data);
    
        res.send(result);
    }
};


const deleteReminder = async (req, res) => {
    const id = req.body._id;
    const result = await removeReminder(id);

    res.send(result);
};


const runReminder = async (req, res) => {
    const _id = req.body._id;
    const reminder = await findReminderById(_id);

    if (reminder) {
        if (reminder.status === "INACTIVE") {
            eventEmitter.emit("RUN", reminder)
            return res.send(`Reminder ${reminder.title} has started running.`);
        } else {
            return res.send("Reminder is already running.");
        }
    } else {
        return res.send("No reminders found with that title.");
    };
};


const stopReminder = async (req, res) => {
    const _id = req.body._id;
    const reminder = await findReminderById(_id);

    if (reminder) {
        eventEmitter.emit("STOP", reminder)
        console.log(`Reminder ${reminder.title} has stopped.`)
        return res.send(`Reminder ${reminder.title} has stopped.`)
    } else {
        console.log("No reminders found with that title")
        return res.send("No reminders found with that title.")
    };
};


const listRunningReminders = async (req, res) => {
    const runningReminders = eventEmitter.emit("LIST")
    return res.send(runningReminders)
}


export {
    getAllRemindersForUser, 
    postReminder, 
    deleteReminder,
    getReminderById,
    changeReminder,
    getActiveReminders,
    changeReminderStatus,
    runReminder,
    stopReminder,
    listRunningReminders
};