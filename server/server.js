import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from 'cors';

/* SCHEMA */
import User from './Schema/User.js';

const server = express();
dotenv.config()
server.use(express.json())


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(cors())

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6000;
mongoose.connect(process.env.MONGO_URL, {
    autoIndex: true
}).then(() => {
    server.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));


const formatDatatoSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}


const generateUsername = async(email) => {
    let username = email.split("@")[0];

    let isUsernameNotUnique = await User.exists({ "personal_info.username": username })
    .then((result) => result)

    isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";

    return username;
}


/* FORM SUBMITION */
// server.post("/signup", (req, res) => {
    
//     let { fullname, email, password } = req.body;

//     if(fullname.length < 3){
//         return res.status(403).json({"error": "Fullname must be at least 3 letters long"});
//     }
//     if(!email.length){
//         return res.status(403).json({"error": "Enter Email"});
//     }
//     if(!emailRegex.test(email)){
//         return res.status(403).json({"error": "Email is invalid"})
//     }
//     if(!passwordRegex.test(password)){
//         return res.status(403).json({"error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase 1 uppercase letters"});
//     }

//     /* HASHING THE PASSWORD */
//     bcrypt.hash(password, 10, async (err, hashed_password) => {

//         let username = await generateUsername(email);

//         let user = new User({
//             personal_info: { fullname, email, 
//             password: hashed_password, username }
//         }) 
        
//         user.save().then((u) => {
//             return res.status(200).json(formatDatatoSend(u));
//         }).catch(err => {

//             if(err.code == 11000){
//                 return res.status(500).json({ "error": "Email already exists" });
//             }

//             return res.status(500).json({ "error": err.message });
//         })
//     })

    server.post("/signup", async (req, res) => {
        let { fullname, email, password } = req.body;

        // Validate the input fields
        if (fullname.length < 3) {
            return res.status(403).json({ "error": "Fullname must be at least 3 letters long" });
        }
        if (!email.length) {
            return res.status(403).json({ "error": "Enter Email" });
        }
        if (!emailRegex.test(email)) {
            return res.status(403).json({ "error": "Email is invalid" });
        }
        if (!passwordRegex.test(password)) {
            return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase 1 uppercase letters" });
        }

        try {
            // Check if the email already exists in the database
            const existingUser = await User.findOne({ "personal_info.email": email });
            if (existingUser) {
                return res.status(400).json({ "error": "Email already exists" });
            }

            // Hash the password
            bcrypt.hash(password, 10, async (err, hashed_password) => {
                if (err) {
                    return res.status(500).json({ "error": "Error while hashing the password" });
                }

                // Generate a unique username based on the email
                let username = await generateUsername(email);

                // Create a new user with the provided details
                let user = new User({
                    personal_info: {
                        fullname,
                        email,
                        password: hashed_password,
                        username
                    }
                });

                // Save the user to the database
                user.save().then((u) => {
                    return res.status(200).json(formatDatatoSend(u));
                }).catch(err => {
                    return res.status(500).json({ "error": err.message });
                });
            });
        } catch (err) {
            return res.status(500).json({ "error": err.message });
        }


    server.post("/signin", async (req, res) => {
        const { email, password } = req.body;

        // // validate if both email and password are provided
        // if (!email || !password) {
        //     return res.status(400).json({ "error": "Email and password are required" })
        // }

        // try {
        //     // Find user email
        //     const user = await User.findOne({ "personal_info.email": email });

        //     // If no user is found return an error
        //     if(!user) {
        //         return res.status(401).json({ "error": "Email not found" });
        //     }

        //     // Compare provided password with the hashed password in the database
        //     const isPasswordValid = await bcrypt.compare(password, user.personal_info.password);

        //     // If password is incorrect return an error
        //     if (!isPasswordValid) {
        //         return res.status(401).json({ "error": "Incorrect password" });
        //     }

        //     // If email and password are correct, return user data and token
        //     return res.status(200).json(formatDatatoSend(user));
        // } catch (error) {
        //     // Catch any other error and return 500 status
        //     console.error("Error during sign-in:", error.message);
        //     return res.status(500).json({ "error": "An error occured while logging in, please try again" });
        // }

        User.findOne({ "personal_info.email": email })
        .then((user) => {
            if(!user){
                return res.status(403).json({ "error": "Email not found" });
            }

            bcrypt.compare(password, user.personal_info.password, (err, result) => {

                if(err){
                    return res.status(403).json({ 'error': 'Error occured while logging please try again' })
                }
                if(!result){
                    return res.status(403).json({ 'error': 'incorrect password' })
                } else {
                    return res.status(200).json(formatDatatoSend(user));
                }
            })
            // console.log(user);
            // return res.json({ "status": "got user document" });
        }).catch(err => {
            console.log(err.message);
            return res.status(403).json({ "error": err.message });
        })
    })

})
