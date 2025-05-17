"use server"

import { getCollection } from "../lib/db";
import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { getUserFromCookie } from "@/lib/getUser";

function isAlphaNumeric(str) {
    // Use regex to check if string contains only alphanumeric characters (letters and numbers)
    const regex = /^[a-zA-Z0-9]*$/;
    return regex.test(str);
}

export const login = async function (prevState, formData) {
    const failAttempt = {
        success: false,
        message: "Invalid username / password"
    }

    const theUser = {
        username: formData.get("username"),
        password: formData.get("password")
    }

    if (typeof theUser.username != "string") { theUser.username = "" }
    if (typeof theUser.password != "string") { theUser.password = "" }

    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({ username: theUser.username })

    if (!user) {
        return failAttempt
    }

    const pmatch = bcrypt.compareSync(theUser.password, user.password);

    if (!pmatch) {
        return failAttempt
    }

    //create jwt value
    const ourToken = jwt.sign({ skyColor: "blue", userId: user._id, role: user.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, process.env.JWTSECRET)

    //create cookie and login user
    cookies().set("vroomapp", ourToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        secure: true
    })

    return redirect("/")

}

export const logout = async function () {
    cookies().delete("vroomapp");
    redirect("/");
}

export const register = async function (prevState, formData) {
    const errors = {}

    //setting the user credentials and trimming
    const theUser = {
        username: formData.get("username"),
        password: formData.get("password"),
        role: "user" //default
    }

    if (typeof theUser.username != "string") { theUser.username = "" }
    if (typeof theUser.password != "string") { theUser.password = "" }

    theUser.username = theUser.username.trim();
    theUser.password = theUser.password.trim();

    //setting credentials criteria
    if (theUser.username.length < 3) { errors.username = "Username should be at least 3 chars." }
    if (theUser.username.length > 30) { errors.username = "Username cannot exceed 30 chars." }
    if (!isAlphaNumeric(theUser.username)) { errors.username = "Username should be letters and numbers only." }
    if (theUser.username == "") { errors.username = "Username cannot be empty." }

    //check for unique username
    const usersCollection = await getCollection("users");
    const existingUser = await usersCollection.findOne({ username: theUser.username })
    if (existingUser) { errors.username = "Username already exists."; }

    const hasLetter = /[A-Za-z]/.test(theUser.password);
    const hasDigit = /\d/.test(theUser.password);
    const hasSpecial = /[!@#$%^&*()_\-+=\[\]{}|;:'",.<>/?`~\\]/.test(theUser.password);

    if (theUser.password.length < 12) { errors.password = "Password should be at least 12 chars." }
    if (theUser.password.length > 50) { errors.password = "Password cannot exceed 50 chars." }
    // if (!isAlphaNumeric(theUser.password)) { errors.password = "Password should be letters and numbers only." }
    if (!hasLetter || !hasDigit || !hasSpecial) { errors.password = "Password must include at least a letter, a number, and a special character."; }
    if (theUser.password == "") { errors.password = "Password cannot be empty." }

    if (errors.username || errors.password) {
        return {
            errors: errors,
            success: false
        }
    }

    //store to mongodb
    const salt = bcrypt.genSaltSync(10);
    theUser.password = bcrypt.hashSync(theUser.password, salt);

    //insert only if username unique
    const newUser = await usersCollection.insertOne(theUser);
    const userId = newUser.insertedId.toString();

    //create jwt value
    const ourToken = jwt.sign({ skyColor: "blue", userId: userId, role: theUser.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, process.env.JWTSECRET)

    //create cookie and login user
    cookies().set("vroomapp", ourToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        secure: true
    })

    return {
        success: true
    }
}

export const changePass = async function (prevState, formData) {
    const errors = {}
    const theUser = {
        username: formData.get("username"),
        password: formData.get("password")
    }

    const usersCollection = await getCollection("users");

    const hasLetter = /[A-Za-z]/.test(theUser.password);
    const hasDigit = /\d/.test(theUser.password);
    const hasSpecial = /[!@#$%^&*()_\-+=\[\]{}|;:'",.<>/?`~\\]/.test(theUser.password);

    if (theUser.password.length < 12) { errors.password = "Password should be at least 12 chars." }
    if (theUser.password.length > 50) { errors.password = "Password cannot exceed 50 chars." }
    // if (!isAlphaNumeric(theUser.password)) { errors.password = "Password should be letters and numbers only." }
    if (!hasLetter || !hasDigit || !hasSpecial) { errors.password = "Password must include at least a letter, a number, and a special character."; }
    if (theUser.password == "") { errors.password = "Password cannot be empty." }

    const loggedUser = await getUserFromCookie();
    if (!loggedUser || loggedUser.role !== "admin") {
        errors.message = "Forbidden: Admins only";
    }

    if (errors.username || errors.password || errors.message) {
        return {
            errors: errors,
            success: false
        }
    }

    //store to mongodb
    const salt = bcrypt.genSaltSync(10);
    theUser.password = bcrypt.hashSync(theUser.password, salt);

     //insert only if username unique
    const myUser = await usersCollection.findOneAndUpdate(
        { username: theUser.username },
        { $set: { password: theUser.password } }
    );

    return {
        success: true,
        message: "Password changed successfully!"
    }
}