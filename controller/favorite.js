const {Recipe,Favorite} = require("../models")


const addToFavorites = async(req,res,next)=>{
try{
    const recipeId = Number(req.params.recipeId);
    const userId = req.user.id;
    const recipe = await Recipe.findByPk(recipeId);
    if(!recipe){
        return res.status(404).json({
            success:false,
            message:"Recipe not found"
        })
    }
    const isFavorite = await Favorite.findOne({where:{recipeId,userId}});
    if(isFavorite){
        return res.status(400).json({
            success:false,
            message:"Recipe is already in favorites"
        })
    }   
    await Favorite.create({recipeId,userId});
    res.status(201).json({
        success:true,
        message:"Recipe added to favorites"   
    })

}catch(err)
{
    next(err)
}
}

const removeFromFavorites = async(req,res,next)=>{
    try{
        const recipeId = Number(req.params.recipeId);   
        const userId = req.user.id;
        const favorite = await Favorite.findOne({where:{recipeId,userId}});
        if(!favorite){  
            return res.status(404).json({
                success:false,
                message:"Recipe is not in favorites"
            })
        }
        await favorite.destroy();
        res.status(200).json({
            success:true,
            message:"Recipe removed from favorites"
        })
    }catch(err){
        next(err)
    }
}

const getFavoriteRecipes = async(req,res,next)=>{
    try{
        const userId = req.user.id; 
        const favorites = await Favorite.findAll({where:{userId},include:Recipe});
         
        const favoriteRecipes = favorites.map(fav => fav.recipe);
        console.log(favoriteRecipes,"favoriteRecipes");
        res.status(200).json({      
            success:true,
            favoriteRecipes
        })
    }catch(err){
        next(err)
    }   
}
module.exports = {addToFavorites,removeFromFavorites,getFavoriteRecipes}