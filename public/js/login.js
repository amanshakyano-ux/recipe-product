const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;

    const response = await axios.post(
      "/api/login",
      {
        email,
        password,
      }
    );

    alert(response.data.message);

    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    window.location.href = "/home";

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Login failed"
    );
  }
});