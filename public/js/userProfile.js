const token = localStorage.getItem("token");
const loggedInUser = JSON.parse(localStorage.getItem("user"));

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
const followBtn = document.getElementById("followBtn");
const unfollowBtn = document.getElementById("unfollowBtn");
const profileTitle = document.getElementById("profileTitle");

const userId = new URLSearchParams(window.location.search).get("id");

let currentUser = null;
let isFollowing = false;

const loadUserProfile = async () => {
  try {
    const response = await axios.get(`/api/user/${userId}`, {
      headers: {
        Authorization: token,
      },
    });

    currentUser = response.data.user;
    const recipes = response.data.recipes;

    userName.innerText = currentUser.name;
    userBio.innerText = currentUser.bio || "No bio added";
    profileTitle.innerText = `${currentUser.name}'s Profile`;

    profileImage.src =
      currentUser.profileImage ||
      "https://via.placeholder.com/150";

    recipesCount.innerText = recipes.length;

    showUserRecipes(recipes);
  } catch (err) {
    console.log(err.response?.data || err.message);
    userName.innerText = "User not found";
  }
};

const loadFollowStats = async () => {
  try {
    const followersRes = await axios.get(`/api/follows/getUserFollowers/${userId}`, {
      headers: {
        Authorization: token,
      },
    });

    const followingRes = await axios.get(`/api/follows/getUserFollowing/${userId}`, {
      headers: {
        Authorization: token,
      },
    });

    followersCount.innerText = followersRes.data.followers ? followersRes.data.followers.length : 0;
    followingCount.innerText = followingRes.data.following ? followingRes.data.following.length : 0;

  } catch (err) {
    console.log(err.response?.data || err.message);
    followersCount.innerText = "0";
    followingCount.innerText = "0";
  }
};

const checkIfFollowing = async () => {
  try {
    const response = await axios.get("/api/follows/getAllfollowing", {
      headers: {
        Authorization: token,
      },
    });

    const following = response.data.following || [];
    isFollowing = following.some(f => f.followingId === parseInt(userId));

    updateFollowButtonUI();
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};

const updateFollowButtonUI = () => {
  if (parseInt(userId) === loggedInUser.id) {
    followBtn.style.display = "none";
    unfollowBtn.style.display = "none";
  } else {
    if (isFollowing) {
      followBtn.style.display = "none";
      unfollowBtn.style.display = "block";
    } else {
      followBtn.style.display = "block";
      unfollowBtn.style.display = "none";
    }
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
    `;

    userRecipesContainer.appendChild(card);
  });
};

const followUser = async () => {
  try {
    const response = await axios.post(
      `/api/follows/followUser/${userId}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );

    isFollowing = true;
    updateFollowButtonUI();
    await loadFollowStats();
    alert(response.data.message);
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to follow user");
  }
};

const unfollowUser = async () => {
  try {
    const response = await axios.post(
      `/api/follows/unfollowUser/${userId}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );

    isFollowing = false;
    updateFollowButtonUI();
    await loadFollowStats();
    alert(response.data.message);
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to unfollow user");
  }
};

followBtn.addEventListener("click", followUser);
unfollowBtn.addEventListener("click", unfollowUser);

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
});

loadUserProfile();
loadFollowStats();
checkIfFollowing();
