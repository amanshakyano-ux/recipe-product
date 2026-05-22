const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

const logoutBtn =
  document.getElementById("logoutBtn");

const collectionRecipesContainer =
  document.getElementById("collectionRecipesContainer");

const collectionId =
  new URLSearchParams(window.location.search).get("id");

const loadCollectionRecipes = async () => {

  try {

    const response = await axios.get(
      `/api/collections/${collectionId}/recipes`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

   showRecipes(response.data.collectionRecipes);

  } catch (err) {

    console.log(err.response?.data || err.message);

    collectionRecipesContainer.innerHTML =
      "<h3>Failed to load recipes</h3>";
  }
};

const showRecipes = (recipes) => {

  collectionRecipesContainer.innerHTML = "";

  if (!recipes || recipes.length === 0) {

    collectionRecipesContainer.innerHTML =
      "<h3>No recipes found in this collection</h3>";

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

      <a href="/recipe-detail?id=${recipe.id}">
        View Details
      </a>
    `;

    collectionRecipesContainer.appendChild(card);

  });
};

logoutBtn.addEventListener("click", () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
});

loadCollectionRecipes();