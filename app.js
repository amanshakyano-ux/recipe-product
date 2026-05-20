require("dotenv").config();
const express = require("express")
const db = require("./utils/db-connection")
require("./models");
const app = express()
app.use(express.json())

db.sync({alter:true})
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server is running")
    })
});


