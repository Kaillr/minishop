document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("revokeAdmin")?.addEventListener("click", async (event) => {
        event.preventDefault();

        const queryParams = new URLSearchParams(window.location.search);
        const email = queryParams.get("email");

        if (!email) {
            alert("Email is required to update admin status.");
            return;
        }

        try {
            const response = await fetch("/settings/admin/users/revoke-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Admin privileges revoked successfully.");
                location.reload(); // Reload the page to reflect changes
            } else {
                alert(data.message || "Failed to revoke admin privileges.");
            }
        } catch (error) {
            console.error("Error revoking admin:", error);
            alert("An error occurred while revoking admin privileges.");
        }
    });

    // Add event listener to the make admin button
    document.getElementById("makeAdmin")?.addEventListener("click", async (event) => {
        event.preventDefault();

        const queryParams = new URLSearchParams(window.location.search);
        const email = queryParams.get("email");

        if (!email) {
            alert("Email is required to update admin status.");
            return;
        }

        try {
            const response = await fetch("/settings/admin/users/make-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Admin privileges granted successfully.");
                location.reload(); // Reload the page to reflect changes
            } else {
                alert(data.message || "Failed to grant admin privileges.");
            }
        } catch (error) {
            console.error("Error making admin:", error);
            alert("An error occurred while granting admin privileges.");
        }
    });
});
