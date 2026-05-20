require("dotenv").config();
const express = require("express")
const db = require("./utils/db-connection")
const app = express()

db.sync({alter:true})
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server is running")
    })
});


