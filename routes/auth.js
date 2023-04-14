const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required

router.post(
    "/createuser",
    [
        body("name", "Enter a valid name").isLength({ min: 3 }),
        body("email", "Enter a valid email").isEmail(),
        body("password", "Password must be at least 4 characters").isLength({
            min: 4,
        }),
    ],
    async (req, res) => {
        
        const errors = validationResult(req);

        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            
            if (user) {
                return res.status(400).json({
                    error: "Sorry a user with this email already exists",
                });
            }
            
            const salt = await bcrypt.genSalt(saltRounds);
            
            const secPass = await bcrypt.hash(req.body.password, salt);

            //create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });

            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);

            res.status(200).json({ authToken });
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
    "/login",
    [
        body("email", "Enter a valid emai").isEmail(),
        body("password", "Password cannot be blank").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array });
        }
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({
                        error: "Please try to login with correct credentials",
                    });
            }
            const passwordCompare = await bcrypt.compare(
                password,
                user.password
            );
            if (!passwordCompare) {
                res.status(400).json({
                    error: "Please try to login with correct credentials",
                });
            }
            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            res.status(200).json({ authToken });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

// ROUTE 3: Get LoggedIn User Details using: POST "/api/auth/getuser". Login required

router.post("/getuser", fetchuser, async (req, res) => {
    try{
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.status(200).send(user)
    }catch(err){
        console.log(err.message);
        res.status(500).send("Internal Server Error")
    }

})
module.exports = router;
