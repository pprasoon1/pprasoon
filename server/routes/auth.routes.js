import express, { json } from "express";
import jwt from "jsonwebtoken";
// import bcrypt from 'bcryptjs';

import User from "../models/User.model.js";

const router = express.Router()

router.post('/signup', async(req, res) => {
    const {username, email, password} = req.body;

    try {
        const existing = await User.findOne({email});
        if (existing) return res.status(500).json({message: 'User already exists'})
        
            // const hash = await bcrypt.hash(password, 10);
            // const user = new User({username, email, password:hash})
            const user = new User({username, email, password})
            await user.save()

            const token = jwt.sign({id: user._id}, "prasoon")
            res.status(200).json({message:"Signup successful", token})

    } catch (error) {
        res.status(500).json({ message: 'Signup failed', error: error.message });   
    }
})

router.post('/login', async(req, res) => {
    const{email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: "User not found"})

            // const match = await bcrypt.compare(password, user.password)
            
            if(password !== user.password) return res.status(401).json({message: "Invalid password"})
            
                const token = jwt.sign({id: user._id}, "prasoon")
                res.status(200).json({message:"Login successful", token})

    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
})

export default router