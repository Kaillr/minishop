document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form data
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    // Clear previous errors
    document.getElementById('error').innerText = '';
    document.getElementById('message').innerText = '';

    // Prepare the form data to send to the server
    const formData = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm
    };

    try {
        // Send form data using Fetch API
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Convert JS object to JSON string
        });

        const result = await response.json();

        // Check if registration was successful
        if (response.ok) {
            // Redirect to the verification page if successful
            window.location.href = '/verify';
        } else {
            // Show error message from server
            document.getElementById('error').innerText = result.error;
            document.getElementById('message').innerText = '';
        }

    } catch (error) {
        console.error('An error occurred:', error);
        document.getElementById('error').innerText = 'An unexpected error occurred. Please try again.';
    }
});
