document.getElementById('verifyForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get the verification code from the input field
    const verificationCode = document.getElementById('verificationCode').value;

    document.getElementById('error').innerText = '';

    // Log the verification code (not the undefined 'verificationCode' variable)
    console.log(verificationCode);

    const formData = {
        verificationCode: verificationCode,
    };

    try {
        const response = await fetch('/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) { // if HTTP status code is 200
            window.location.href = result.redirectUrl; // Redirect to login on successful verification
        } else {
            document.getElementById('error').innerText = result.error; // Display error message from server
        }

    } catch (error) {
        console.error('An error occurred', error);
        document.getElementById('error').innerText = result.error;
    }
});
