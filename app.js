require("dotenv").config();
const express = require("express")
const db = require("./utils/db-connection")
const authRoutes = require("./routes/authRoutes")
const recipeRoutes = require("./routes/recipeRoutes")
const reviewRoutes = require("./routes/review")

require("./models");
const app = express()
app.use(express.json())
app.use("/api/recipes", recipeRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api",authRoutes)
app.use((err,req,res,next)=>{
    return res.status(500).json({
      success:false,
      message:err.message
   })
})
db.sync({alter:true})
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server is running")
    })
});


