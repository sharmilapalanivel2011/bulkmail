const express = require("express")
const cors = require("cors")
const app = express()
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/passkey").then(function(){
    console.log("Connected to DB ")
}).catch(function(){
    console.log("Failed to Connect")
})

const credential = mongoose.model("credenial",{},"bulkmail")

app.post("/sendmail",function(req,res){

    var msg = req.body.msg
    var emailList = req.body.emailList

credential.find().then(function(data)
{
    const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{

        user:data[0].toJSON().user,
        pass:data[0].toJSON().pass,
    },
});

    
    new Promise(async function(resolve,reject){
    try{
        for(var i=0;i<emailList.length;i++)
    {
         await  transporter.sendMail(
    {
        from:"spsharmi05@gmail.com",
        to:emailList[i],
        subject:"A msg from bulkmail app",
        text:msg

    }
)
    console.log("Email send to :"  +emailList[i])

    }
    resolve("Success")
    }
    catch(error){
        reject("Failed")
     }

}).then(function(){
    res.send(true)
}).catch(function(){
    res.send(false)
})



}).catch(function(error)
{
    console.log(error)
})


    
})

app.listen(5000,function(){
    console.log("Server Started........")
})


