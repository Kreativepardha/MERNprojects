const express = require("express")
const zod = require("zod");
const jwt = require("jsonwebtoken")
const { User, Account } = require("../database/db");
const router = express.Router();
// const {authMiddleware} = require("../middleware")
const authMiddleware = require("../middleware")
const JWT_SECRET =  require("../config")

const signupSchema = zod.object({
    username:zod.string(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string(),
})

router.post("/signup", async (req, res) => {
    const { success } = signupSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

 const signinSchema = zod.object({
                      username: zod.string().email(),
                      password: zod.string()
                            })
    
                            router.post("/signin", async (req, res) => {
                                try {
                                    const { success } = signinSchema.safeParse(req.body);
                            
                                    if (!success) {
                                        return res.status(400).json({
                                            message: "Invalid request body"
                                        });
                                    }
                            
                                    const user = await User.findOne({
                                        username: req.body.username,
                                        password: req.body.password
                                    });
                            
                                    if (user) {
                                        const token = jwt.sign({
                                            userId: user._id
                                        }, JWT_SECRET);
                            
                                        res.json({
                                            token: token
                                        });
                                    } else {
                                        res.status(401).json({
                                            message: "Invalid username or password"
                                        });
                                    }
                                } catch (error) {
                                    console.error(error);
                                    res.status(500).json({
                                        message: "Internal server error"
                                    });
                                }
                            });
                            



        const updateSchema = zod.object({
            password: zod.string().optional(),
            firstname: zod.string().optional(),
            lastname: zod.string().optional(),
        })

            router.put("/", authMiddleware, async(req,res)=>{

                const { success } = updateSchema.safeParse(req.body)
                if(!success){
                    res.status(411).json({
                        message :" error while updating information"
                    })
                }
                await User.updateOne(req.body, {
                    id:req.userId
                })
                res.json({
                    message:" Updated Successfully"
                })
            })


                router.get("/bulk", async(req,res)=>{
                    const filter = req.query.filter || "";

                    const users = [{
                        firstname : {
                            "$regex" : filter
                        }
                    },{
                        lastname : {
                            "$regex": filter
                        }
             
                    }]
                
                    res.json({
                        user: users.map(user =>({
                            username: user.username,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            _id: user._id
                        }))
                    })
                })
        

module.exports = router;    