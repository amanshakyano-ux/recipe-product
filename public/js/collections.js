const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

const collectionForm = document.getElementById("collectionForm");
const collectionName = document.getElementById("collectionName");
const collectionsContainer = document.getElementById("collectionsContainer");
const logoutBtn = document.getElementById("logoutBtn");

const loadCollections = async () => {
  try {
    const response = await axios.get("/api/collections/mycollections", {
      headers: {
        Authorization: token,
      },
    });

    showCollections(response.data.collections);
  } catch (err) {
    console.log(err.response?.data || err.message);
    collectionsContainer.innerHTML = "<h3>Failed to load collections</h3>";
  }
};

const showCollections = (collections) => {
  collectionsContainer.innerHTML = "";

  if (!collections || collections.length === 0) {
    collectionsContainer.innerHTML = "<h3>No collections found</h3>";
    return;
  }

  collections.forEach((collection) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <h3>${collection.name}</h3>

      <a href="/collection-detail?id=${collection.id}">
        View Recipes
      </a>

      <button onclick="deleteCollection(${collection.id})">
        Delete Collection
      </button>
    `;

    collectionsContainer.appendChild(card);
  });
};

collectionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const response = await axios.post(
      "/api/collections/create",
      {
        name: collectionName.value,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    alert(response.data.message);

    collectionForm.reset();
    loadCollections();
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to create collection");
  }
});

const deleteCollection = async (collectionId) => {
  try {
    const confirmDelete = confirm("Delete this collection?");

    if (!confirmDelete) return;

    const response = await axios.delete(
      `/api/collections/delete/${collectionId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    alert(response.data.message);

    loadCollections();
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to delete collection");
  }
};

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
});

loadCollections();