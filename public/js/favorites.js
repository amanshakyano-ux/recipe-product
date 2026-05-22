const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

const favoritesContainer =
  document.getElementById("favoritesContainer");

const logoutBtn =
  document.getElementById("logoutBtn");

const showFavorites = (recipes) => {

  favoritesContainer.innerHTML = "";

  if (!recipes || recipes.length === 0) {

    favoritesContainer.innerHTML =
      "<h3>No favorite recipes found</h3>";

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

      <button onclick="removeFavorite(${recipe.id})">
        Remove Favorite
      </button>

      <a href="/recipe-detail?id=${recipe.id}">
        View Details
      </a>
    `;

    favoritesContainer.appendChild(card);
  });
};

const loadFavorites = async () => {

  try {

    const response = await axios.get(
      "/api/favorites/myfavorites",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    showFavorites(response.data.favoriteRecipes);

  } catch (err) {

    console.log(err.response?.data || err.message);

    favoritesContainer.innerHTML =
      "<h3>Failed to load favorites</h3>";
  }
};

const removeFavorite = async (recipeId) => {

  try {

    const response = await axios.delete(
      `/api/favorites/remove/${recipeId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    alert(response.data.message);

    loadFavorites();

  } catch (err) {

    console.log(err.response?.data || err.message);

    alert(
      err.response?.data?.message ||
      "Failed to remove favorite"
    );
  }
};

logoutBtn.addEventListener("click", () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
});

loadFavorites();