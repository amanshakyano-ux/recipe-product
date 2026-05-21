const {Review,Recipe} = require("../models")
const isStrInvalid = require("../utils/strValidation")
const createReview = async(req,res,next)=>{
 try{
    
    const recipeId = Number(req.params.recipeId);
    
    const userId = req.user.id;
    const { rating, comment } = req.body;
    
    if((rating < 1 )||( rating> 5)){
            return res.status(400).json({
                success:false,
                message:"Rating should be between 1 and 5"
            })      
           }

        if(isStrInvalid(rating) || isStrInvalid(comment)){
        return res.status(400).json({
            success:false,
            message:"Invalid input data"
        })
    }   
    console.log(recipeId,"recipeId");
    const recipe = await Recipe.findByPk(recipeId);
    if(!recipe){
        return res.status(404).json({
            success:false,
            message:"Recipe not found"
        })
    }
    console.log(recipe,"recipe");
    const isReviewed = await Review.findOne({where:{recipeId,userId}});
    if(isReviewed){
        return res.status(400).json({
            success:false,
            message:"You have already reviewed this recipe"
        })
    }
    const review = await Review.create({
        rating,comment,recipeId,userId
    })
    res.status(201).json({
        success:true,
        message:"Review created successfully",
        review
    })
 }catch(err)
 {
    next(err)
 }
}
const deleteReview = async(req,res,next)=>{
    try{
        const reviewId = Number(req.params.reviewId);
        const userId = req.user.id;
        const review = await Review.findByPk(reviewId);
        if(!review){
            return res.status(404).json({
                success:false,
                message:"Review not found"
            })
        }
        if(review.userId !== userId){
            return res.status(403).json({
                success:false,
                message:"You are not the owner of this review"
            })
        }
        await review.destroy();
        res.status(200).json({
            success:true,
            message:"Review deleted successfully"
        })
    }catch(err){
        next(err)
    }
}

const getReviewsByRecipe = async(req,res,next)=>{
    try{
        const recipeId = Number(req.params.recipeId); 
        const reviews = await Review.findAll({where:{recipeId}});
        res.status(200).json({
            success:true,
            totalReviews:reviews.length,
            reviews
        })
    }catch(err){
        next(err)
    }
}
const updateReview = async(req,res,next)=>{
    try{
        const reviewId = Number(req.params.reviewId);
        const userId = req.user.id;
        const { rating, comment } = req.body;
if((rating < 1 )||( rating> 5)){
            return res.status(400).json({
                success:false,
                message:"Rating should be between 1 and 5"
            })      
           }
        const review = await Review.findByPk(reviewId);
        if(!review){
            return res.status(404).json({
                success:false,
                message:"Review not found"
            })
        }
        if(review.userId !== userId){
            return res.status(403).json({
                success:false,
                message:"You are not the owner of this review"
            })
        }
        await review.update({ rating, comment });
        res.status(200).json({
            success:true,
            message:"Review updated successfully",
            review
        })
    }catch(err){
        next(err)
    }
}
module.exports = {createReview, deleteReview, getReviewsByRecipe, updateReview}