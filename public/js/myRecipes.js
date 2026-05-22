const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

const myRecipesContainer =
  document.getElementById("myRecipesContainer");

const logoutBtn =
  document.getElementById("logoutBtn");

const showMyRecipes = (recipes) => {
  myRecipesContainer.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    myRecipesContainer.innerHTML = "<h3>No recipes found</h3>";
    return;
  }

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${recipe.imageUrl}" alt="${recipe.title}">

      <h3>${recipe.title}</h3>

      <p>${recipe.description}</p>

      <p><b>Difficulty:</b> ${recipe.difficulty}</p>

      <p><b>Diet:</b> ${recipe.dietType}</p>

      <p><b>Cooking Time:</b> ${recipe.cookingTime} min</p>
      <a href="/recipe-detail?id=${recipe.id}">View Details</a>
      <button onclick="deleteRecipe(${recipe.id})">
        Delete
      </button>
    `;

    myRecipesContainer.appendChild(card);
  });
};

const loadMyRecipes = async () => {
  try {
    const response = await axios.get("/api/recipes/user?page=1&limit=20", {
      headers: {
        Authorization: token,
      },
    });

    showMyRecipes(response.data.recipes);
  } catch (err) {
    console.log(err.response?.data || err.message);
    myRecipesContainer.innerHTML = "<h3>Failed to load recipes</h3>";
  }
};

const deleteRecipe = async (recipeId) => {
  try {
    const confirmDelete = confirm("Are you sure you want to delete this recipe?");

    if (!confirmDelete) return;

    const response = await axios.delete(`/api/recipes/delete/${recipeId}`, {
      headers: {
        Authorization: token,
      },
    });

    alert(response.data.message);

    loadMyRecipes();
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to delete recipe");
  }
};

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
});

loadMyRecipes();