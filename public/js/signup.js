const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const bio = document.getElementById("bio").value;

    const profileImage =
      document.getElementById("profileImage").files[0];

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("bio", bio);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const response = await axios.post(
      "/api/register",
      formData
    );

    alert(response.data.message);

    window.location.href = "/login";

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Signup failed"
    );
  }
});