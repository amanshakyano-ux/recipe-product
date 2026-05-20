const { User } = require("./users");
const { Recipe } = require("./recipes");
const { Review } = require("./reviews");
const { Favorite } = require("./favorites");
const { Collection } = require("./collections");
const { CollectionRecipe } = require("./collectionRecipes");
const { Follow } = require("./follows");
const { Activity } = require("./activities");
const { Category } = require("./categories");
const { RecipeCategory } = require("./recipeCategories");

//one to many
User.hasMany(Recipe, { foreignKey: "userId", onDelete: "cascade" });
Recipe.belongsTo(User, { foreignKey: "userId" });

Recipe.hasMany(Review, { foreignKey: "recipeId", onDelete: "cascade" });
Review.belongsTo(Recipe, { foreignKey: "recipeId" });

User.hasMany(Activity, { foreignKey: "userId", onDelete: "cascade" });
Activity.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Review, { foreignKey: "userId", onDelete: "cascade" });
Review.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Collection, { foreignKey: "userId", onDelete: "cascade" });
Collection.belongsTo(User, { foreignKey: "userId" });

//Many to Many
User.belongsToMany(Recipe, {
  through: Favorite,
  foreignKey: "userId",
});
Recipe.belongsToMany(User, {
  through: Favorite,
  foreignKey: "recipeId",
});

Recipe.belongsToMany(Category, {
  through: RecipeCategory,
});

Category.belongsToMany(Recipe, {
  through: RecipeCategory,
});

Collection.belongsToMany(Recipe, { through: CollectionRecipe });
Recipe.belongsToMany(Collection, { through: CollectionRecipe });

User.belongsToMany(User, {
  through: Follow,
  as: "Followers",
  foreignKey: "followingId",
});

User.belongsToMany(User, {
  through: Follow,
  as: "Following",
  foreignKey: "followerId",
});

module.exports = {
  User,
  Recipe,
  Review,
  Favorite,
  Collection,
  CollectionRecipe,
  Follow,
  Activity,
  Category,
  RecipeCategory,
};
