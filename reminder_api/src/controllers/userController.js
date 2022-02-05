import _ from "lodash";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, refreshAccessToken } from "../auth.js";
import {
    queryAllUsers, 
    queryUserById,
    createUser,
    updateUser
} from "../services/userService.js";


const getAllUsers = async (req, res) => {
    const users = await queryAllUsers();

    if (users) {
        return res.send(users);
    } else  {
        return res.send("No users found")
    }
} 


const addUser = async (req, res) => {
    const user = {
        _id: _.snakeCase(req.body.username),
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 15),
    }
    const result = await createUser(user);
    
    if (result.error) {
        if (result.error.message.includes("E11000 duplicate key error collection")) {
            res.status(500).send("A user with this username already exists.")
        } else {
            res.status(500).send(result.error.message)
        }
    } else {
        res.status(201).send(result);
    }
}


const loginUser = async (req, res) => {
    const id = _.snakeCase(req.body.username)
    const user = (await queryUserById(id))[0];

    if (user === null) {
        res.status(400).send("Unable to find user")
    } else {
        if (!await bcrypt.compare(req.body.password, user.password)) {
            res.send("The password is not correct.")
        } else {
            console.log("The password is correct.");
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            user["refreshToken"] = refreshToken
            await updateUser(user)
            res.json({ accessToken: accessToken, refreshToken: refreshToken });
        }
    }    
}


const refreshUserToken =  async (req, res) => {
    const user = (await queryUserById(req.body.userId))[0];
    const refreshToken = req.body.token;

    if (refreshToken === null) {
        res.sendStatus(401).send("No token found.")
    } 
    
    if (user['refreshToken'] !== refreshToken) {
        res.sendStatus(403).send("User tokens do not match.")
    }

    const accessToken = refreshAccessToken(refreshToken)
    res.json({accessToken : accessToken});
}


export {
    getAllUsers,
    addUser,
    loginUser,
    refreshUserToken
}