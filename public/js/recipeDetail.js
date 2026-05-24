const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
if (!token) {
  window.location.href = "/login";
}

const logoutBtn = document.getElementById("logoutBtn");
const collectionSelect =
  document.getElementById("collectionSelect");

const addToCollectionBtn =
  document.getElementById("addToCollectionBtn");
const recipeDetails =
  document.getElementById("recipeDetails");

const reviewsContainer =
  document.getElementById("reviewsContainer");

const reviewForm =
  document.getElementById("reviewForm");

const recipeId =
  new URLSearchParams(window.location.search).get("id");

const loadRecipeDetails = async () => {
  try {

    const response = await axios.get(
      `/api/recipes/get/${recipeId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const recipe = response.data.recipe;
    

    recipeDetails.innerHTML = `
      <div class="recipe-card">

        <img src="${recipe.imageUrl}" alt="${recipe.title}">

        <h2>${recipe.title}</h2>

        <p>${recipe.description}</p>

        <p><b>Ingredients:</b></p>
        <p>${recipe.ingredients}</p>

        <p><b>Instructions:</b></p>
        <p>${recipe.instructions}</p>

        <p><b>Cooking Time:</b> ${recipe.cookingTime} min</p>

        <p><b>Difficulty:</b> ${recipe.difficulty}</p>

        <p><b>Diet:</b> ${recipe.dietType}</p>

        <button onclick="addToFavorites()">
          Add To Favorites
        </button>

      </div>
    `;

    showReviews(recipe.reviews);

  } catch (err) {

    console.log(err.response?.data || err.message);

    recipeDetails.innerHTML =
      "<h3>Failed to load recipe</h3>";
  }
};

const showReviews = (reviews) => {

  reviewsContainer.innerHTML = "";

  if (!reviews || reviews.length === 0) {

    reviewsContainer.innerHTML =
      "<h3>No reviews yet</h3>";

    return;
  }

  reviews.forEach((review) => {

    const div = document.createElement("div");

    div.className = "recipe-card";

    
 div.innerHTML = `
  <p><b>Reviewer:</b> ${review.user?.name || "Unknown User"}</p>

  <p><b>Rating:</b> ${review.rating}</p>

  <p>${review.comment}</p>

  ${
    user.role === "admin" || review.userId === user.id
      ? `
        <button
          style="
            width:auto;
            padding:6px 12px;
            font-size:14px;
            cursor:pointer;
            display:inline-block;
          "
          onclick="deleteReview(${review.id})"
          id="deleteReviewBtn"
        >
          Delete
        </button>
      `
      : ""
  }
`;
    reviewsContainer.appendChild(div);
  });
};

deleteReview = async (reviewId) => {

  if(!reviewId)
  {
    return alert("Invalid review ID");
  }
  if (!confirm("Are you sure you want to delete this review?")) {
    return;
  }
  try{
if(user.role === "admin")
{
  const response = await axios.delete(`/api/admin/deleteReview/${reviewId}`,{
      headers: {
        Authorization: token,
      },  
    })
    showReviews(response.data.reviews);
}else
{

  const response = await axios.delete(`/api/reviews/delete/${reviewId}`,{
    headers: {
      Authorization: token,
    },  
  })
  showReviews(response.data.reviews);
}

  }catch(err)
  {
    next(err)
  }
   
}
reviewForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    try {

      const rating =
        document.getElementById("rating").value;

      const comment =
        document.getElementById("comment").value;

      const response = await axios.post(
        `/api/reviews/create/${recipeId}`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(response.data.message);

      reviewForm.reset();

      loadRecipeDetails();

    } catch (err) {

      console.log(err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
        "Failed to add review"
      );
    }
  }
);
const loadCollections = async () => {

  try {

    const response = await axios.get(
      "/api/collections/mycollections",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const collections = response.data.collections;

    collections.forEach((collection) => {

      const option = document.createElement("option");

      option.value = collection.id;

      option.innerText = collection.name;

      collectionSelect.appendChild(option);

    });

  } catch (err) {

    console.log(err.response?.data || err.message);

  }
};
addToCollectionBtn.addEventListener(
  "click",
  async () => {

    try {

      const collectionId =
        collectionSelect.value;

      if (!collectionId) {
        return alert("Please select a collection");
      }

      const response = await axios.post(
  `/api/collections/add/${collectionId}/${recipeId}`,
  {},
  {
    headers: {
      Authorization: token,
    },
  }
);

      alert(response.data.message);

    } catch (err) {

      console.log(err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
        "Failed to add recipe to collection"
      );
    }
  }
);
const addToFavorites = async () => {

  try {

    const response = await axios.post(
      `/api/favorites/add/${recipeId}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );

    alert(response.data.message);

  } catch (err) {

    console.log(err.response?.data || err.message);

    alert(
      err.response?.data?.message ||
      "Failed to add favorite"
    );
  }
};

logoutBtn.addEventListener("click", () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
});

loadRecipeDetails();
loadCollections();