const express = require("express");
// const { authMiddleware } = require("../middleware");
const authMiddleware = require("../middleware");
const { Account } = require("../database/db");

const router = express.Router();

    router.get("/balance",authMiddleware, async (req,res)=>{

        const account = await Account.findOne({
            userId: req.userId
        });

        res.json({
            balance: account.balance 
        })
    })

        router.post("/transfer", authMiddleware , async (req,res)=>{
            const session = await mongoose.startSession();

            session.startTransaction();
            const { amount , to } = req.body;

            //fetching amount whithin transcations
            const account = await Account.findOne({ userId: req.userId }).session(session);

                if(!account || account.balance < amount ){
                    await session.abortTransaction();
                    return res.status(400).json({
                        message: "insufficient balance"
                    });

                }
                const toAccount = await Account.findOne({ userId: to}).session(session)
                if(!toAccount){
                    await session.abortTransaction();
                    return res.status(400).json({
                        message: "Invalid account"
                    });

                }
                //performing transfer

                await Account.updateOne({userId: req.userId},{ $inc: { balance : -amount}}).session(session)
                await Account.updateOne({userId: req.to},{ $inc: { balance : amount}}).session(session);

                    //commiting trnx
        await session.commitTransaction();

        res.json({
            message: "Transfer successfull"
            
            });
            });


    



module.exports = router;