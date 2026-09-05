const products = [
    { id: "artisan-bread", name: "Artisan Bread", category: "Bread" },
    { id: "pastries", name: "Pastries", category: "Pastry" },
    { id: "celebration-cake", name: "Celebration Cakes", category: "Cake" }
];

let favoriteIds = [];

function loadFavorites() {
    const savedFavorites = localStorage.getItem("northStarFavorites");
    favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
}

function saveFavorites() {
    localStorage.setItem("northStarFavorites", JSON.stringify(favoriteIds));
}

function toggleFavorite(productId) {
    const index = favoriteIds.indexOf(productId);

    if (index === -1) {
        favoriteIds.push(productId);
    } else {
        favoriteIds.splice(index, 1);
    }

    saveFavorites();
    displayFavorites();
}

function displayFavorites() {
    const list = document.getElementById("favorites-list");
    const count = document.getElementById("favorites-count");

    if (!list || !count) {
        return;
    }

    list.innerHTML = "";
    count.textContent = favoriteIds.length;

    if (favoriteIds.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-message";
        emptyItem.textContent = "No favorites saved yet. Choose an item above to start your list.";
        list.appendChild(emptyItem);
    } else {
        favoriteIds.forEach((id) => {
            const product = products.find((item) => item.id === id);
            if (product) {
                const item = document.createElement("li");
                item.textContent = `${product.name} (${product.category})`;
                list.appendChild(item);
            }
        });
    }

    document.querySelectorAll(".favorite-btn").forEach((button) => {
        const isFavorite = favoriteIds.includes(button.dataset.productId);
        button.classList.toggle("is-favorite", isFavorite);
        button.textContent = isFavorite ? "✓ Saved to Favorites" : "♡ Add to Favorites";
        button.setAttribute("aria-pressed", String(isFavorite));
    });
}

function setupFavoriteButtons() {
    document.querySelectorAll(".favorite-btn").forEach((button) => {
        button.addEventListener("click", () => {
            toggleFavorite(button.dataset.productId);
        });
    });
}

function showError(field, message) {
    const error = document.getElementById(`${field.id}-error`);
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
    if (error) {
        error.textContent = message;
    }
}

function clearError(field) {
    const error = document.getElementById(`${field.id}-error`);
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
    if (error) {
        error.textContent = "";
    }
}

function validateName(nameField) {
    const value = nameField.value.trim();
    if (value === "") {
        showError(nameField, "Please enter your full name.");
        return false;
    }
    if (value.length < 2) {
        showError(nameField, "Your name must be at least 2 characters long.");
        return false;
    }
    clearError(nameField);
    return true;
}

function validateEmail(emailField) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = emailField.value.trim();
    if (value === "") {
        showError(emailField, "Please enter your email address.");
        return false;
    }
    if (!emailPattern.test(value)) {
        showError(emailField, "Please enter a valid email address, such as name@example.com.");
        return false;
    }
    clearError(emailField);
    return true;
}

function validateQuantity(quantityField) {
    const quantity = Number(quantityField.value);
    if (quantityField.value === "" || quantity < 1 || quantity > 100) {
        showError(quantityField, "Please enter a quantity from 1 to 100.");
        return false;
    }
    clearError(quantityField);
    return true;
}

function validateDetails(detailsField) {
    const value = detailsField.value.trim();
    if (value.length < 10) {
        showError(detailsField, "Please provide at least 10 characters of order details.");
        return false;
    }
    clearError(detailsField);
    return true;
}

function setupFormValidation() {
    const form = document.getElementById("preorder-form");
    if (!form) {
        return;
    }

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const quantityField = document.getElementById("quantity");
    const detailsField = document.getElementById("details");
    const successMessage = document.getElementById("form-success");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        successMessage.textContent = "";

        const checks = [
            validateName(nameField),
            validateEmail(emailField),
            validateQuantity(quantityField),
            validateDetails(detailsField)
        ];

        if (checks.every(Boolean)) {
            successMessage.textContent = "Your request is ready to send. Thank you for contacting North Star Bakery!";
        }
    });

    nameField.addEventListener("input", () => validateName(nameField));
    emailField.addEventListener("input", () => validateEmail(emailField));
    quantityField.addEventListener("input", () => validateQuantity(quantityField));
    detailsField.addEventListener("input", () => validateDetails(detailsField));
}

function initializePage() {
    loadFavorites();
    setupFavoriteButtons();
    displayFavorites();
    setupFormValidation();
}

document.addEventListener("DOMContentLoaded", initializePage);
