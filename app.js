require("dotenv").config();
const express = require("express")
const db = require("./utils/db-connection")
const authRoutes = require("./routes/authRoutes")
const recipeRoutes = require("./routes/recipeRoutes")
const reviewRoutes = require("./routes/review")
 const favoriteRoutes = require("./routes/favorite")
 const collectionRoutes = require("./routes/collection") 
 const followRoutes = require("./routes/follow")
 const adminRoutes = require("./routes/adminRoutes")
 const passwordRoutes = require("./routes/passwordRoutes");

require("./models");
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use("/api",authRoutes)
app.use("/api/password", passwordRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/recipes", recipeRoutes)
app.use("/api/collections", collectionRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/favorites", favoriteRoutes)
app.use("/api/follows",followRoutes)
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


