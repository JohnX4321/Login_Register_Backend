const express = require("express");
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth=require('../middleware/auth');

const User = require("../model/User");

router.post("/signup",[
    check("username","Please Enter a valid username")
        .not()
        .isEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password',"Please Enter a valid password").isLength({
        min: 8
    }),
    check('usn',"Please Enter USN").isAlphanumeric(),
    check('sem',"Enter SEM").not().isEmpty(),
    check('branch','Enter branch').not().isEmpty(),
    check('college','Enter College').not().isEmpty()
],
    async(req,res)=>{
        const errors=validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {username,email,password,usn,sem,branch,college}=req.body;
        try {
            let user=await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User ALready Exists"
                });
            }
            user=new User({
                username,
                email,
                password,
                usn,
                sem,
                branch,
                college
            });
            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(password,salt);

            await user.save();

            const payload={
                user:{
                    id: user.id
                }
            };
            jwt.sign(
                payload,
                "randomString",{
                    expiresIn: 10000
                },
                (err,token)=>{
                    if(err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.log(e.message);
            res.status(500).send({errors: 'Error in Saving. Try Again'});

        }
    });


router.post("/login",[
    check("email","Please enter a valid Email").isEmail(),
    check('password',"Please enter a valid password").isLength({
    min: 8
    })
],
    async(req,res)=>{
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {email,password}=req.body;
    try {
        let user=await User.findOne({
            email
        });
        if(!user)
            return res.status(400).json({
                message: "User does not exist"
            });

            const matchPw=await bcrypt.compare(password,user.password);
            if (!matchPw) {
                return res.status(400).json({
                    message: 'Incorrect Password'
                });
            }
            const payload={
                user:{
                    id:user.id
                }
            };
            jwt.sign(
                payload,"randomString",
                {
                    expiresIn: 3600
                },
                (err,token)=>{
                    if(err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
    } catch (e) {
        console.error(e);
        res.status(500).json({
            errors: "Server Error"
        });
    }
    });

router.post('/update',[],async (req,res)=>{
    const {name,email,usn,sem,branch,college}=req.body;

    const user=await User.findOne({
        email
    });

    User.findOneAndUpdate({
        id: user.id
    },{
        name: name,
        usn: usn,
        sem: sem,
        branch: branch,
        college: college
    },{upsert: false},(err,doc)=>{
        if (err)
            return res.status(500).send({errors: 'Server Error'});
        return res.send({message: 'Successfully updated'});
    });

})


router.get("/me",auth,async (req,res)=>{
    try {
        const user=await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({errors: "Error Fetching User"})
    }
});


module.exports=router;
