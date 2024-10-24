document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image); // File input

    try {
        // Make AJAX POST request to upload the product and image
        const response = await fetch("/admin/add", {
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
