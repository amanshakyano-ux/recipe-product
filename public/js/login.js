const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const loginBtnText = loginBtn.textContent;
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";
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
  finally{
    loginBtn.disabled = false;
    loginBtn.textContent = loginBtnText;
  }
});