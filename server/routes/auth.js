import express, { Router } from 'express'
import User from '../module/userModule.js'
import multer from 'multer';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
const router = express.Router()


// const storage = multer.memoryStorage(); // Store the file in memory

// const upload = multer({ storage });
// router.post("/register", upload.single('pic'),async (req,res)=> {
    router.post('/register', async (req, res) => {

    console.log("this is req file:",req.file)
    console.log(req.body.password)
    try {
    
    //   const { filename, mimetype, buffer } = req.file;
    
        const existingUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        // console.log(existingUser)
        if (existingUser) {
        // Check if the username already exists
                
        // Check if the email already exists
        // console.log(existingUser.email === req.body.email)
        // console.log(req.body.email)
        if (existingUser.email === req.body.email) {
            // console.log({ error: 'Email already exists' })
            return res.status(400).json({ error: 'Email already exists' });
        }
        }
        console.log(req.body.password)
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashPassword, req.password)
        
        const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        // pic: req.file ? req.file.filename : "default_url_for_pic",
        pic: req.body.pic
        });
        
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
    });

    router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // console.log("user", user); // Check if user is found in the database
        // console.log(user)
        if (!user) {
        res.status(401).json("Wrong credentials");
        }
    
        let check = await bcrypt.compare(req.body.password, user.password);
        // console.log(check)
        if (!check) {
        res.status(401).json("Wrong credentials");
        } else {
        // console.log(check); // This will log the result of password comparison
    
        // Generate and log the accessToken
        
        const accessToken = jwt.sign(
            {
              id: user._id,
              isAdmin: user.isAdmin,
            },
            process.env.JWT_KEY,
            { expiresIn: "5d" }
          );
            // console.log("accessToken", accessToken);
        
            
        // Remove the password field from the user object before sending it in the response
        const { password, ...other } = user._doc;
        // console.log(user._doc)
    
        // Send the user data and accessToken in the response
        // console.log("hello",other,accessToken)
        res.status(200).json({other,accessToken});
        }
    } catch (err) {
        res.status(500).json(err);
    }
    });

      
export default router