document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    document.getElementById('error').innerText = '';

    const formData = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('/login', { // Fixed the URL here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) { // if HTTP status code is 200
            window.location.href = '/'; // Redirect to home on successful login
        } else {
            document.getElementById('error').innerText = result.error; // Display error message from server
        }

    } catch (error) {
        console.error('An error occurred', error);
        document.getElementById('error').innerText = 'An error occurred. Please try again';
    }
});
