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
 const path = require("path");

require("./models");
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static("public"))
app.use("/api",authRoutes)
app.use("/api/password", passwordRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/recipes", recipeRoutes)
app.use("/api/collections", collectionRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/favorites", favoriteRoutes)
app.use("/api/follows",followRoutes)




//html serving
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/login.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/home.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/profile.html"));
});

app.get("/favorites", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/favorites.html"));
});

app.get("/collections", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/collections.html"));
});

app.get("/create-recipe", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/createRecipe.html"));
});

app.get("/my-recipes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/myRecipes.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/admin.html"));
});

app.get("/forgot-password", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/forgotPassword.html"));
});
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


