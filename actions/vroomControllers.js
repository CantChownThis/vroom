"use server"

import { redirect } from "next/navigation";
import { getUserFromCookie } from "../lib/getUser";
import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db";
import cloudinary from 'cloudinary';

const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isAlphaNumericWithSpace(text) {
    const regex = /^[a-zA-Z0-9 .,]*$/
    return regex.test(text)
}

async function sharedVroomLogic(formData, user) {
    const errors = {}

    const ourVroom = {
        line1: formData.get("line1"),
        line2: formData.get("line2"),
        author: ObjectId.createFromHexString(user.userId)
    }

    if (typeof ourVroom.line1 != "string") ourVroom.line1 = ""
    if (typeof ourVroom.line2 != "string") ourVroom.line2 = ""

    ourVroom.line1 = ourVroom.line1.replace(/(\r\n|\n|\r)/g, " ")
    ourVroom.line2 = ourVroom.line2.replace(/(\r\n|\n|\r)/g, " ")

    ourVroom.line1 = ourVroom.line1.trim()
    ourVroom.line2 = ourVroom.line2.trim()

    if (ourVroom.line1.length < 5) errors.line1 = "Must be at least 5"
    if (ourVroom.line1.length > 25) errors.line1 = "Must be less than 25"

    if (ourVroom.line2.length < 7) errors.line2 = "Must be at least 7"
    if (ourVroom.line2.length > 35) errors.line2 = "Must be less than 35"

    if (!isAlphaNumericWithSpace(ourVroom.line1)) errors.line1 = "No special chars"
    if (!isAlphaNumericWithSpace(ourVroom.line2)) errors.line2 = "No special chars"

    if (ourVroom.line1.length == 0) errors.line1 = "Required!"
    if (ourVroom.line2.length == 0) errors.line2 = "Required!"

    // verify signature
    const expectedSignature = cloudinary.utils.api_sign_request({public_id: formData.get("public_id"), version: formData.get("version")}, cloudinaryConfig.api_secret);
    if (expectedSignature === formData.get("signature")) {
        ourVroom.photo = formData.get("public_id")
    }

    return {
        errors,
        ourVroom
    }
}

export const createVroom = async function (prevState, formData) {
    const user = await getUserFromCookie();

    if (!user) {
        return redirect("/")
    }

    const results = await sharedVroomLogic(formData, user)

    if (results.errors.line1 || results.errors.line2) {
        return { errors: results.errors }
    }

    const vroomCollection = await getCollection("vrooms")
    const newVroom = await vroomCollection.insertOne(results.ourVroom)
    return redirect("/")
}

export const deleteVroom = async function (formData) {
    const user = await getUserFromCookie();

    if (!user) {
        return redirect("/")
    }

    const vroomCollection = await getCollection("vrooms")
    let vroomId = formData.get("id")
    if (typeof vroomId != "string") vroomId = ""
    const vroomInQuestion = await vroomCollection.findOne({ _id: ObjectId.createFromHexString(vroomId) })
    if (vroomInQuestion.author.toString() !== user.userId) {
        return redirect("/")
    }
    await vroomCollection.deleteOne({ _id: ObjectId.createFromHexString(vroomId) })
    return redirect("/")
}

export const editVroom = async function (prevState, formData) {
    const user = await getUserFromCookie();

    if (!user) {
        return redirect("/")
    }

    const results = await sharedVroomLogic(formData, user)

    if (results.errors.line1 || results.errors.line2) {
        return { errors: results.errors }
    }

    const vroomCollection = await getCollection("vrooms")
    let vroomId = formData.get("vroomId")
    if (typeof vroomId != "string") vroomId = ""
    const vroomInQuestion = await vroomCollection.findOne({ _id: ObjectId.createFromHexString(vroomId) })
    if (vroomInQuestion.author.toString() !== user.userId) {
        return redirect("/")
    }
    await vroomCollection.findOneAndUpdate({ _id: ObjectId.createFromHexString(vroomId) }, { $set: results.ourVroom })
    return redirect("/")
}