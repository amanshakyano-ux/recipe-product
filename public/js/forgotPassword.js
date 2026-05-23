const forgotPasswordForm = document.getElementById("forgotPasswordForm");

forgotPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const email = document.getElementById("email").value;

    const response = await axios.post("/api/password/forgot", {
      email,
    });

    alert(response.data.message);
  } catch (err) {
    console.log(err.response?.data || err.message);

    alert(
      err.response?.data?.message ||
      "Failed to send reset link"
    );
  }
});