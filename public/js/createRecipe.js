const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

const createRecipeForm =
  document.getElementById("createRecipeForm");

const logoutBtn =
  document.getElementById("logoutBtn");

createRecipeForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    try {

      const title =
        document.getElementById("title").value;

      const description =
        document.getElementById("description").value;

      const ingredients =
        document.getElementById("ingredients").value;

      const instructions =
        document.getElementById("instructions").value;

      const cookingTime =
        document.getElementById("cookingTime").value;

      const servings =
        document.getElementById("servings").value;

      const difficulty =
        document.getElementById("difficulty").value;

      const dietType =
        document.getElementById("dietType").value;

      const prepTime =
        document.getElementById("prepTime").value;

      const category =
        document.getElementById("category").value;

      const recipeImage =
        document.getElementById("recipeImage").files[0];

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("ingredients", ingredients);
      formData.append("instructions", instructions);
      formData.append("cookingTime", cookingTime);
      formData.append("servings", servings);
      formData.append("difficulty", difficulty);
      formData.append("dietType", dietType);
      formData.append("prepTime", prepTime);
      formData.append("category", category);

      if (recipeImage) {
        formData.append("recipeImage", recipeImage);
      }

      const response = await axios.post(
        "/api/recipes/create",
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(response.data.message);

      window.location.href = "/home";

    } catch (err) {

      console.log(err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
        "Failed to create recipe"
      );
    }
  }
);

logoutBtn.addEventListener("click", () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
});