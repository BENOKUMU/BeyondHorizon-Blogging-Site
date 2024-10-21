import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';

const server = express();
dotenv.config()
server.use(express.json())


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
        return res.status(403).json({"error": "Fullname must be at least 3 letters long"})
    }

    return res.status(200).json({"status": "Okay"})
})