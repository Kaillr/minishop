const filterInput = document.getElementById('filterInput');
const table = document.getElementById('productsTable');
const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

// Add an event listener for input events
filterInput.addEventListener('keyup', function() {
    const filter = filterInput.value.toLowerCase();

    // Loop through all table rows, and hide those that don’t match the query
    for (let row of rows) {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(filter)) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    }
});

document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const brand = document.getElementById("brand").value;
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").files[0];

    const formData = new FormData();
    formData.append("brand", brand);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image); // File input

    try {
        // Make AJAX POST request to upload the product and image
        const response = await fetch("https://minishop.mikaelho.land/settings/admin/products/add", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        
        if (response.ok) {
            alert(result.message); // Success message
        } else {
            alert("Error: " + result.error); // Error message
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred. Please try again.");
    }
});

document.querySelectorAll("button[data-id]").forEach(button => {
    button.addEventListener("click", async function () {
        const productId = button.getAttribute("data-id");

        if (button.id === "delete-product-button") {
            if (confirm("Are you sure you want to delete this product?")) {
                try {
                    // Make AJAX POST request to delete the product
                    const response = await fetch(`/settings/admin/products/delete`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ product_id: productId }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert(result.message); // Success message

                        // Optionally, remove the row from the table without reloading
                        const row = button.closest("tr");
                        if (row) row.remove();
                    } else {
                        alert("Error: " + result.error); // Error message
                    }
                } catch (error) {
                    console.error("Error deleting product:", error);
                    alert("An error occurred. Please try again.");
                }
            }
        } else if (button.id === "edit-product-button") {
            // Add your edit functionality here
            console.log(`Edit button clicked for product with ID: ${productId}`);
            // Example: Redirect to edit page
            window.location.href = `/settings/admin/products/edit/${productId}`;
        }
    });
});
