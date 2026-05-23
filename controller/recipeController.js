const isStrInvalid = require("../utils/strValidation");
const s3 = require("../utils/s3Service");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { Category, Recipe,User,Review} = require("../models");
const { Op } = require("sequelize");

const searchRecipes = async (req, res, next) => {
  try {
    const { keyword, difficulty, dietType, cookingTime } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (keyword) {
      whereClause.title = {
        [Op.like]: `%${keyword}%`,
      };
    }

    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    if (dietType) {
      whereClause.dietType = dietType;
    }

    if (cookingTime) {
      whereClause.cookingTime = {
        [Op.lte]: Number(cookingTime),
      };
    }

    const { count, rows: recipes } = await Recipe.findAndCountAll({
      where: whereClause,
      include:{
        model:User,
        attributes:['id', 'name']
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalRecipes: count,
      totalPages: Math.ceil(count / limit),
      recipes,
    });
  } catch (err) {
    next(err);
  }
};
const createRecipe = async (req, res, next) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      dietType,
      prepTime,
      category,
    } = req.body;

    if (
      isStrInvalid(title) ||
      isStrInvalid(description) ||
      isStrInvalid(ingredients) ||
      isStrInvalid(instructions) ||
      isStrInvalid(cookingTime) ||
      isStrInvalid(servings) ||
      isStrInvalid(difficulty) ||
      isStrInvalid(dietType) ||
      isStrInvalid(prepTime) ||
      isStrInvalid(category)
    ) {
      return res.status(400).json({
        success: false,
        message: "All recipe fields are mandatory",
      });
    }

    const userId = req.user.id;

    let imageUrl = null;

    if (req.file) {
      const file = req.file;
      console.log(file, "file");

      const fileName = `recipes/${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);

      imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      dietType,
      imageUrl,
      prepTime,
      category,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe,
    });
  } catch (err) {
    next(err);
  }
};

const getAllRecipes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const recipes = await Recipe.findAll({
      include:{
        model: User,
        attributes: ['id', 'name']
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    if (recipes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No recipes found for this user",
      });
    }
    res.status(200).json({
      success: true,
      currentPage: page,
      totalRecipes: recipes.length,
      totalPages: Math.ceil(recipes.length / limit),
      recipes,
    });
  } catch (err) {
    next(err);
  }
};

const getOneRecipe = async (req, res, next) => {
  try {
    const recipeId = Number(req.params.id);
    const recipe = await Recipe.findOne({
      where: {
        id: recipeId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        },
        {
          model: Review,
          include: [User]
        }
      ]
    });
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }
    res.status(200).json({
      success: true,
      recipe,
    });
  } catch (err) {
    next(err);
  }
};

const getRecipesByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const recipes = await Recipe.findAll({ where: { userId }, limit, offset });
    res.status(200).json({
      success: true,
      currentPage: page,
      totalRecipes: recipes.length,
      totalPages: Math.ceil(recipes.length / limit),
      recipes,
    });
  } catch (err) {
    next(err);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const recipeId = Number(req.params.id);
    const userId = req.user.id;
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }
    if (recipe.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this recipe",
      });
    }
    const {
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      dietType,
      prepTime,
      category,
    } = req.body;

    await recipe.update({
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      dietType,
      prepTime,
      category,
    });

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      recipe,
    });
  } catch (err) {
    next(err);
  }
};
const deleteRecipe = async (req, res, next) => {
  try {
    const recipeId = Number(req.params.id);
    const userId = req.user.id;
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }
    if (recipe.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this recipe",
      });
    }
    await recipe.destroy();
    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
const getRecipesByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;

    const categoryData = await Category.findOne({
      where: { name: category },
      include: {
        model: Recipe,
        through: { attributes: [] },
      },
    });

    if (!categoryData || categoryData.recipes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recipes found for this category",
      });
    }

    return res.status(200).json({
      success: true,
      totalRecipes: categoryData.recipes.length,
      recipes: categoryData.recipes,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createRecipe,
  getAllRecipes,
  getOneRecipe,
  getRecipesByUser,
  updateRecipe,
  deleteRecipe,
  getRecipesByCategory,
  searchRecipes
};
