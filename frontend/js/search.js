document.getElementById("searchForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const query = document.getElementById("searchInput").value; // Get search input
    const response = await fetch(`/search?q=${query}`); // Send AJAX request
    const products = await response.json(); // Parse JSON response

    renderProductCards(products); // Render the product cards
});

function renderProductCards(products) {
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = ""; // Clear previous results

    products.forEach(product => {
        // Create product card HTML
        const card = `
            <div class="product-card">
                <img src="${product.image_path}" alt="${product.product_name}">
                <h3>${product.product_name}</h3>
                <p>${product.description}</p>
                <span class="price">$${product.price}</span>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;

        // Append the card to the results container
        resultsContainer.innerHTML += card;
    });
}
