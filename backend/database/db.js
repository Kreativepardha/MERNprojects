const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://saradhipardha12:PARDHA123@cluster0.n0euu2z.mongodb.net/paytmApp");

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
        maxlenght:30
    }
},{
    lastname:{
        type:String,
        required:true,
        trime:true,
        maxlenght:30
    }
},{
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:3,
        maxlength:30
    }
},
{
    password:{
        type:String,
        required:true,
        minlength:8,
    }
})

const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    }
});

const Account = mongoose.model("Account",accountSchema)
const User = mongoose.model("User",userSchema)

module.exports = {
    User,
    Account,
};