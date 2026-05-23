const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const signupBtnText = signupBtn.textContent;
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

    signupBtn.disabled = true;
    signupBtn.textContent = "Signing up...";
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
  finally{
    signupBtn.disabled = false;
    signupBtn.textContent = signupBtnText;
  }
});