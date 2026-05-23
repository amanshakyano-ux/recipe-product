const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  window.location.href = "/login";
}

const logoutBtn = document.getElementById("logoutBtn");

const profileImage = document.getElementById("profileImage");
const userName = document.getElementById("userName");
const userBio = document.getElementById("userBio");

const followersCount = document.getElementById("followersCount");
const followingCount = document.getElementById("followingCount");
const recipesCount = document.getElementById("recipesCount");

const userRecipesContainer = document.getElementById("userRecipesContainer");

const editProfileBtn = document.getElementById("editProfileBtn");

editProfileBtn.addEventListener("click", () => {
  window.location.href = "/edit-profile";
});

const loadProfile = async () => {
  try {
    userName.innerText = user.name;
    userBio.innerText = user.bio || "No bio added";

    profileImage.src =
      user.profileImage ||
      "https://via.placeholder.com/150";

    const response = await axios.get("/api/recipes/user?page=1&limit=20", {
      headers: {
        Authorization: token,
      },
    });

    const recipes = response.data.recipes;

    recipesCount.innerText = recipes.length;



    showUserRecipes(recipes);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};

const loadFollowStats = async () => {
  try {
    const followersRes = await axios.get("/api/follows/getAllfollowers", {
      headers: {
        Authorization: token,
      },
    });

    const followingRes = await axios.get("/api/follows/getAllfollowing", {
      headers: {
        Authorization: token,
      },
    });

    followersCount.innerText =
      followersRes.data.followers.length;

    followingCount.innerText =
      followingRes.data.following.length;

  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
const showUserRecipes = (recipes) => {
  userRecipesContainer.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    userRecipesContainer.innerHTML = "<h3>No recipes found</h3>";
    return;
  }

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${recipe.imageUrl}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <a href="/recipe-detail?id=${recipe.id}">View Details</a>
      <button onclick="deleteRecipe(${recipe.id})">Delete</button>
    `;

    userRecipesContainer.appendChild(card);
  });
};

deleteRecipe = async (recipeId) => {
  if (!confirm("Are you sure you want to delete this recipe?")) {
    return;
  }
  try {
    await axios.delete(`/api/recipes/delete/${recipeId}`, {
      headers: {
        Authorization: token,
      },
    });
    alert("Recipe deleted successfully");
    await loadProfile();
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Failed to delete recipe");
  }
};
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
});

loadProfile();
loadFollowStats();