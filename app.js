require("dotenv").config();
const express = require("express")
const db = require("./utils/db-connection")
const authRoutes = require("./routes/authRoutes")
require("./models");
const app = express()
app.use(express.json())


app.use("/api",authRoutes)
db.sync({alter:true})
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server is running")
    })
});


