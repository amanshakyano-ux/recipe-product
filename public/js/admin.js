const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (user.role !== "admin") {
  window.location.href = "/home";
}
if (!token) {
  window.location.href = "/login";
}

const logoutBtn = document.getElementById("logoutBtn");
const dashboardStats = document.getElementById("dashboardStats");
const usersContainer = document.getElementById("usersContainer");
const adminRecipesContainer = document.getElementById("adminRecipesContainer");

const config = {
  headers: {
    Authorization: token,
  },
};

const loadDashboardStats = async () => {
  const res = await axios.get("/api/admin/getDashboard", config);
  const stats = res.data.dashboard;

  dashboardStats.innerHTML = `
    <div class="stat-card">Users: ${stats.totalUsers}</div>
    <div class="stat-card">Recipes: ${stats.totalRecipes}</div>
    <div class="stat-card">Reviews: ${stats.totalReviews}</div>
    <div class="stat-card">Categories: ${stats.totalCategories}</div>
  `;
};

const loadUsers = async () => {
  const res = await axios.get("/api/admin/getAllUsers?page=1&limit=50", config);

  usersContainer.innerHTML = "";

  res.data.users.forEach((user) => {
    const div = document.createElement("div");
    div.className = "admin-user-card";

    div.innerHTML = `
      <p><b>${user.name}</b> - ${user.email}</p>
      <p>Role: ${user.role} | Banned: ${user.isBanned}</p>

      ${
        user.isBanned
          ? `<button onclick="unbanUser(${user.id})">Unban</button>`
          : `<button onclick="banUser(${user.id})">Ban</button>`
      }
    `;

    usersContainer.appendChild(div);
  });
};

const loadRecipes = async () => {
  
  const res = await axios.get("/api/admin/getAllRecipes?page=1&limit=50", config);

  adminRecipesContainer.innerHTML = "";

  res.data.recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${recipe.imageUrl}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <a  style="margin-bottom: 10px;" href="/recipe-detail?id=${recipe.id}">View Details</a>
      <button onclick="deleteRecipe(${recipe.id})">Delete Recipe</button>
    `;

    adminRecipesContainer.appendChild(card);
  });
};

const banUser = async (userId) => {
  await axios.patch(`/api/admin/banUser/${userId}`, {}, config);
  loadUsers();
};

const unbanUser = async (userId) => {
  await axios.patch(`/api/admin/unBanUser/${userId}`, {}, config);
  loadUsers();
};

const deleteRecipe = async (recipeId) => {
  await axios.delete(`/api/admin/deleteRecipe/${recipeId}`, config);
  loadRecipes();
  loadDashboardStats();
};

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
});

loadDashboardStats();
loadUsers();
loadRecipes();