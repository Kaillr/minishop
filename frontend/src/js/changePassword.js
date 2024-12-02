document.getElementById("changePasswordForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const formData = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    }

    try {
        const response = await fetch("/settings/security", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("message").innerText = "Password changed successfully!";
            document.getElementById("error").innerText = "";
        } else {
            document.getElementById("message").innerText = "";
            document.getElementById("error").innerText = result.error;
        }
    } catch (error) {
        console.error('An error occurred', error);
        document.getElementById('error').innerText = 'An error occurred. Please try again';
    }
});