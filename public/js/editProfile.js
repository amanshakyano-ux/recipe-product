const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  window.location.href = "/login";
}

const editProfileForm = document.getElementById("editProfileForm");
const logoutBtn = document.getElementById("logoutBtn");

document.getElementById("name").value = user.name || "";
document.getElementById("bio").value = user.bio || "";
const updateProfileBtn = document.getElementById("updateProfileBtn");
const updateProfileBtnText = updateProfileBtn.textContent;

editProfileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const name = document.getElementById("name").value;
    const bio = document.getElementById("bio").value;
    const profileImage = document.getElementById("profileImage").files[0];

    const formData = new FormData();

    formData.append("name", name);
    formData.append("bio", bio);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    updateProfileBtn.disabled = true;
    updateProfileBtn.textContent = "Updating...";
    const response = await axios.put("/api/profile", formData, {
      headers: {
        Authorization: token,
      },
    });

    localStorage.setItem("user", JSON.stringify(response.data.user));

    alert(response.data.message);

    window.location.href = "/profile";
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || "Profile update failed");
  }
  finally{
    updateProfileBtn.disabled = false;
    updateProfileBtn.textContent = updateProfileBtnText;
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
});