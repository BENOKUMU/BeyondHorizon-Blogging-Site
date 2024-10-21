import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

/* SCHEMA */
import User from './Schema/User.js';

const server = express();
dotenv.config()
server.use(express.json())


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6000;
mongoose.connect(process.env.MONGO_URL, {
    autoIndex: true
}).then(() => {
    server.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));





/* FORM SUBMITION */
server.post("/signup", (req, res) => {
    
    let { fullname, email, password } = req.body;

    if(fullname.length < 3){
        return res.status(403).json({"error": "Fullname must be at least 3 letters long"});
    }
    if(!email.length){
        return res.status(403).json({"error": "Enter Email"});
    }
    if(!emailRegex.test(email)){
        return res.status(403).json({"error": "Email is invalid"})
    }
    if(!passwordRegex.test(password)){
        return res.status(403).json({"error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase 1 uppercase letters"});
    }

    /* HASHING THE PASSWORD */
    bcrypt.hash(password, 10, (err, hashed_password) => {

        let username = email.split("@")[0];

        let user = new User({
            personal_info: { fullname, email, 
            password: hashed_password, username }
        }) 
        
        user.save().then((u) => {
            return res.status(200).json({ user: u });
        }).catch((err) => {

            if(err.code == 11000){
                return res.status(500).json({ "error": "Email already exists" });
            }

            return res.status(500).json({ "error": err.message });
        })

        console.log(hashed_password);
    })

    return res.status(200).json({"status": "Okay"});
})
