const { User, Recipe, Review, Category } = require("../models");
const getAllUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      attributes: {
        exclude: ["password"],
      },
      limit,
      offset,
    });

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "User count is Zero",
      });
    }
    res.status(200).json({
      success: true,
      totalPage: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count,
      users,
    });
  } catch (err) {
    next(err);
  }
};

const banUser = async (req, res, next) => {
  try {
    const targetUser = Number(req.params.targetUser);

    const user = await User.findOne({
      where: {
        id: targetUser,
      },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not found",
      });
    }
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: `${targetUser} is a admin so admin can't ban eachother`,
      });
    }
    if (user.isBanned) {
      return res.status(400).json({
        success: false,
        message: "User already Banned.",
      });
    }
    user.isBanned = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: `You Banned ${user.name}`,
    });
  } catch (err) {
    next(err);
  }
};

const unBanUser = async (req, res, next) => {
  try {
    const targetUser = Number(req.params.targetUser);

    const user = await User.findOne({
      where: {
        id: targetUser,
      },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: `${targetUser} is a admin`,
      });
    }
    if (!user.isBanned) {
      return res.status(400).json({
        success: false,
        message: "User already Active.",
      });
    }
    user.isBanned = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: `You Unbanned ${user.name}`,
    });
  } catch (err) {
    next(err);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const users = await User.count();
    const reviews = await Review.count();
    const recipes = await Recipe.count();
    const categories = await Category.count();
    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers: users,
        totalRecipes: recipes,
        totalReviews: reviews,
        totalCategories: categories,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const recipe = await Recipe.findOne({ where: { id: recipeId } });
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe is not exists with this id - ${recipeId}`,
      });
    }
    await recipe.destroy();
    res
      .status(200)
      .json({ success: true, message: "Recipe deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const reviewId = Number(req.params.reviewId);
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: `There is no review with your review Id (${reviewId})`,
      });
    }
    await review.destroy();
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllUsers,
  banUser,
  unBanUser,
  deleteRecipe,
  deleteReview,
  getDashboardStats,
};
