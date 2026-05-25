const token = localStorage.getItem("token");
const loggedInUser = JSON.parse(localStorage.getItem("user"));
if (!token) {
  window.location.href = "/login";
}

const recipesContainer = document.getElementById("recipesContainer");
const logoutBtn = document.getElementById("logoutBtn");
const searchBtn = document.getElementById("searchBtn");

const searchBtnText = searchBtn.textContent;
const showRecipes = (recipes) => {
  recipesContainer.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    recipesContainer.innerHTML = "<h3>No recipes found</h3>";
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
      <p><b>Created by : </b>${
        recipe.user.id === loggedInUser.id ? "You":recipe.user.name
       }</small></p>
      <button onclick="window.location.href='/recipe-detail?id=${recipe.id}'" style="width:100%; margin-top:10px;">
        View More
      </button>
    `;

    recipesContainer.appendChild(card);
  });
};


const loadRecipes = async () => {
  try {
    const response = await axios.get("/api/recipes/all?page=1&limit=20", {
      headers: {
        Authorization: token,
      }
     
    });
    

    showRecipes(response.data.recipes);
  } catch (err) {
    console.log(err.response?.data || err.message);
    recipesContainer.innerHTML = "<h3>Failed to load recipes</h3>";
  }
};

searchBtn.addEventListener("click", async () => {
  try {
    const keyword = document.getElementById("keyword").value;
    const difficulty = document.getElementById("difficulty").value;
    const dietType = document.getElementById("dietType").value;
    const cookingTime = document.getElementById("cookingTime").value;

    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (difficulty) params.append("difficulty", difficulty);
    if (dietType) params.append("dietType", dietType);
    if (cookingTime) params.append("cookingTime", cookingTime);

    params.append("page", "1");
    params.append("limit", "20");

      // searchBtn.disabled = true;
      // searchBtn.textContent = "Searching...";
    const response = await axios.get(`/api/recipes/search?${params.toString()}`, {
      headers: {
        Authorization: token,
      },
    });

    showRecipes(response.data.recipes);
  } catch (err) {
    console.log(err.response?.data || err.message);
    recipesContainer.innerHTML = "<h3>No recipes found</h3>";
  }
  finally{
    searchBtn.disabled = false;
    searchBtn.textContent = searchBtnText;
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
});

 window.addEventListener("DOMContentLoaded", async () => {
  await loadRecipes();
});
 