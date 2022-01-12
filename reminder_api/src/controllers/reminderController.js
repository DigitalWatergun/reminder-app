import _ from "lodash"; 
import { 
    queryAllReminders, 
    createReminder, 
    removeReminder,
    findReminderById,
    filterReminders,
    updateReminder
} from "../services/reminderService.js";


const getAllReminders = async (req, res) => {
    let reminders = await queryAllReminders();
    
    return res.send(reminders);
};


const getReminderById = async (req, res) => {
    const _id = _.toLower(req.query.title);
    const reminder = await findReminderById(_id);

    if (reminder) {
        return res.send(reminder);
    } else {
        return res.send("No reminders found with that title.");
    };
};


const getReminderByFilter = async (req, res) => {
    const data = {};

    for (let [key, value] of Object.entries(req.query)) {
        if (key.includes("id") && key !== "_id") {
            key = "_id";
            value = _.toLower(value);
        } else if (key.includes("id")) {
            value = _.toLower(value);
        };
        data[key] = value;
    }

    const reminders = await filterReminders(filter);

    if (reminders) {
        res.send(reminders);
    } else {
        res.send("No reminders found.");
    };
};


const changeReminder = async (req, res) => {
    const data = {
        "update": {}
    };

    for (let [key, value] of Object.entries(req.query)) {
        if (key.includes("id")) {
            if (key.includes("id") && key !== "_id") {
                key = "_id";
                value = _.toLower(value);
            } else  {
                value = _.toLower(value);
            };
            data[key] = value;
        } else {
            data["update"][key] = value;
        };
    };

    const reminder = await updateReminder(data);

    if (reminder) {
        res.send(`Updated ${reminder.title}`);
    } else {
        res.send("Failed to update reminder.")
    }
};


const postReminder = async (req, res) => {
    const data = {
        _id: _.toLower(req.query.title),
        title: req.query.title,
        content: req.query.content,
        minutes: req.query.minutes,
        status: req.query.status,
        email: req.query.email,
        mobile: req.query.mobile,
        repeat: req.query.repeat
    }
    const result = await createReminder(data);

    res.send(result);
};

const deleteReminder = async (req, res) => {
    const title = _.toLower(req.query.title);
    const result = await removeReminder(title);

    res.send(result);
};

export {
    getAllReminders, 
    postReminder, 
    deleteReminder,
    getReminderById,
    getReminderByFilter,
    changeReminder
};