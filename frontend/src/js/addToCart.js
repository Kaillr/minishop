const cartMenu = document.getElementById("cart-menu");
const cartBackdrop = document.getElementById("cart-backdrop");

function showCartMenu() {
    cartMenu.classList.add("show");
    cartBackdrop.classList.add("show");
}

function hideCartMenu() {
    cartMenu.classList.remove("show");
    cartBackdrop.classList.remove("show");
}

function toggleCartMenu() {
    cartMenu.classList.toggle("show");
    cartBackdrop.classList.toggle("show");
}

cartBackdrop.addEventListener("click", function () {
    if (cartBackdrop.classList.contains("show")) {
        hideCartMenu();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Attach an event listener to buttons with the ID 'add-to-cart'
    async function updateCartUI(cart) {
        const cartItemsContainer = document.querySelector(".cart-items");
        const emptyCartMessage = document.querySelector(".cart-menu p");
    
        // Clear existing cart items
        cartItemsContainer.innerHTML = "";
    
        if (cart.items.length > 0) {
            cart.items.forEach(product => {
                const productHTML = `
                <div class="product">
                    <div class="picture-container">
                        <div class="picture" style="background-image: url('https://minishop.mikaelho.land/${product.imagePath.replace(/\\/g, "/")}');" aria-label="${product.productName}"></div>
                    </div>
                    <div class="details">
                        <div class="left">
                            <div class="description">
                                <h3>${product.productName}</h3>
                                <p>${product.brand}</p>
                            </div>
                            <div>
                                <button id="remove-single-item" data-id="${product.productId}"><i class='bx bx-minus'></i></button>
                                <button id="add-single-item" data-id="${product.productId}"><i class='bx bx-plus'></i></button>
                                <button id="remove-from-cart" data-id="${product.productId}"><i class='bx bx-trash'></i></button>
                            </div>
                        </div>
                        <div class="right">
                            <h3>${product.price}</h3>
                            <p>${product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                        </div>
                    </div>
                </div>`;
                cartItemsContainer.insertAdjacentHTML("beforeend", productHTML);
            });
    
            emptyCartMessage.style.display = "none"; // Hide empty cart message
        } else {
            emptyCartMessage.style.display = "block"; // Show empty cart message
        }
    }
    
    document.querySelectorAll("#add-to-cart").forEach(button => {
        button.addEventListener("click", async function (e) {
            e.preventDefault();
    
            const productId = this.getAttribute("data-id");
    
            if (!productId) {
                console.error("Product ID not found in data-id attribute.");
                return;
            }
    
            try {
                const response = await fetch("/add-to-cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ product_id: productId }),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    console.log("Product added to cart:", result);
                    showCartMenu();
    
                    // Update the cart UI with the new data
                    if (result.cart) {
                        updateCartUI(result.cart);
                    }
                } else {
                    console.error("Error adding product to cart:", result.message);
                    alert(result.message || "An error occurred.");
                }
            } catch (error) {
                console.error("An error occurred:", error);
                alert("Failed to add product to cart. Please try again.");
            }
        });
    });
    

    document.querySelectorAll("#remove-from-cart").forEach(button => {
        button.addEventListener("click", async function (e) {
            e.preventDefault(); // Prevent the default action
            // Extract the product ID from the button's data-id attribute
            const productId = this.getAttribute("data-id");

            if (!productId) {
                console.error("Product ID not found in data-id attribute.");
                return;
            }

            // Prepare the data to be sent
            const formData = {
                product_id: productId
            };

            try {
                // Send the POST request to the server
                const response = await fetch("/add-to-cart/remove", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                // Parse the response
                const result = await response.json();

                if (response.ok) {
                    console.log("Product removed from cart:", result);

                    // Remove the product from the DOM
                    const productElement = this.closest(".product");
                    if (productElement) {
                        productElement.remove();
                    }

                    // Optional: Show feedback if needed
                    console.log("Product successfully removed from UI.");
                } else {
                    console.error("Error removing product from cart:", result.message);
                    alert(result.message || "An error occurred.");
                }
            } catch (error) {
                console.error("An error occurred:", error);
                alert("Failed to remove product from cart. Please try again.");
            }
        });
    });
});