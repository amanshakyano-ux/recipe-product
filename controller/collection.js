const { Collection, CollectionRecipe, Recipe } = require("../models");
const createCollection = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Collection name is required",
      });
    }
    const isAvailable = await Collection.findOne({ where: { name, userId } });
    if (isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Collection name already exists",
      });
    }
    const collection = await Collection.create({ name, userId });
    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      collection,
    });
  } catch (err) {
    next(err);
  }
};

const addRecipeToCollection = async (req, res, next) => {
  try {
    const collectionId = Number(req.params.collectionId);
    const recipeId = Number(req.params.recipeId);
    const userId = req.user.id;
    const collection = await Collection.findOne({
      where: { id: collectionId, userId },
    });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }
    await CollectionRecipe.create({ collectionId, recipeId });
    res.status(200).json({
      success: true,
      message: "Recipe added to collection",
    });
  } catch (err) {
    next(err);
  }
};
const removeCollection = async (req, res, next) => {
  try {

    console.log(req.params.collectionId,"collectionId")
    const collectionId = Number(req.params.collectionId);
    const userId = req.user.id;
    const collection = await Collection.findOne({
      where: { id: collectionId, userId },
    });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }
    await collection.destroy();
    res.status(200).json({
      success: true,
      message: "Collection removed successfully",
    });
  } catch (err) {
    next(err);
  }
};

const removeRecipeFromCollection = async (req, res, next) => {
  try {
    const collectionId = Number(req.params.collectionId);
    const recipeId = Number(req.params.recipeId);
    const userId = req.user.id;
    const collection = await Collection.findOne({
      where: { id: collectionId, userId },
    });
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }
    const collectionRecipe = await CollectionRecipe.findOne({
      where: { collectionId, recipeId },
    });
    if (!collectionRecipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found in collection",
      });
    }
    await collectionRecipe.destroy();
    res.status(200).json({
      success: true,
      message: "Recipe removed from collection",
    });
  } catch (err) {
    next(err);
  }
};

const getCollectionRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const collectionId = Number(req.params.collectionId);
    const isCollection = await Collection.findOne({
      where: { id: collectionId, userId },
    });
    if (!isCollection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const collection = await Collection.findOne({
      where: {
        id: collectionId,
        userId,
      },
      include: {
        model: Recipe,
        through: { attributes: [] },
      },
    });
    res.status(200).json({
      success: true,
      collectionRecipes: collection.recipes,
    });
  } catch (err) {
    next(err);
  }
};
const getUserCollections = async (req, res, next) => {
  try {
    const userId = req.user.id;
    isCollection = await Collection.findOne({
      where: {  userId },
    });
    if (!isCollection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }
    const collections = await Collection.findAll({ where: { userId } });
    res.status(200).json({
      success: true,
      collections,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCollection,
  addRecipeToCollection,
  removeCollection,
  removeRecipeFromCollection,
  getCollectionRecipes,
  getUserCollections,
};
