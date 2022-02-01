
const BASEURL = "http://localhost:3001/reminders"


const getAllReminders = async () => {
    const response = await fetch(BASEURL)
    if (response.ok) {
        return response.json();
    } else {
        console.log("RESPONSE CODE IS NOT OKAY")
        console.log(response.status)
        console.log(response.statusText)
        throw Error()
    }
}


const createReminder = async (data) => {
    const fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }

    const response = await fetch(BASEURL, fetchOptions)
    if (response.ok) {
        return response
    } else {
        console.log("RESPONSE CODE IS NOT OKAY")
        console.log(response.status)
        console.log(response.statusText)
        throw Error()
    }
}


const deleteReminder = async (data) => {
    const fetchOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }

    const response = await fetch(BASEURL, fetchOptions)
    if (response.ok) {
        console.log("Response is okay.")
        window.location.reload();
    } else {
        console.log("Response code is not okay.")
        throw Error()
    }
}


const editReminder = async (data) => {
    const fetchOptions = {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }

    const response = await fetch(BASEURL + "/update", fetchOptions)
    if (response.ok) {
        console.log("Response is ok. Successfully updated the reminder.")
        return response
    } else {
        console.log("Response code is not okay.")
        throw Error()
    }
}


const runReminder = async (data) =>{
    const query = `?_id=${data._id}`

    const response = await fetch(BASEURL + "/run" + query)
    if (response.ok) {
        console.log("Response is okay.")
        window.location.reload();
    } else {
        console.log("Response code is not okay.")
        throw Error()
    }
}


const stopReminder = async (data) => {
    const query = `?_id=${data._id}`

    const response = await fetch(BASEURL + "/stop" + query)
    console.log(response);
    if (response.ok){
        window.location.reload();
        console.log("Response is ok")
        return "Response is okay"
    } else {
        console.log("Response codei s not okay.")
        throw Error();
    }
}


export const api = {
    getAllReminders,
    createReminder,
    deleteReminder,
    editReminder,
    runReminder,
    stopReminder
}