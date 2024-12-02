// Handle AJAX for user details form
document.getElementById('userDetailsForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const formData = { email, phone };

    try {
        const response = await fetch('/settings/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            this.querySelector('#error').innerText = "";
            this.querySelector('#message').innerText = 'Updated successfully!';
            setTimeout(() => {
                this.querySelector('#message').innerText = "";
            }, 2000);
        } else {
            console.error('Error from server:', result.error); // Log the error
            this.querySelector('#error').innerText = result.error; // Display error message
            this.querySelector('#message').innerText =  "";
            setTimeout(() => {
                this.querySelector('#error').innerText = "";
            }, 2000);
        }

    } catch (error) {
        console.error('An error occurred during user details update:', error);
        this.querySelector('#error').innerText = 'An error occurred. Please try again';
    }
});

// Handle AJAX for address details form
document.getElementById('addressDetailsForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const address_line1 = document.getElementById('address_line1').value;
    const address_line2 = document.getElementById('address_line2').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const postal_code = document.getElementById('postal_code').value;
    const country = document.getElementById('country').value;

    const formData = {
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
    };

    try {
        const response = await fetch('/settings/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            this.querySelector('#message').innerText = 'Updated successfully!';
            this.querySelector('#error').innerText = "";
            setTimeout(() => {
                this.querySelector('#message').innerText = "";
            }, 2000);
        } else {
            console.error('Error from server:', result.error); // Log the error
            this.querySelector('#error').innerText = result.error; // Display error message
            setTimeout(() => {
                this.querySelector('#error').innerText = "";
            }, 2000);
        }

    } catch (error) {
        console.error('An error occurred during address details update:', error);
        this.querySelector('#error').innerText = 'An error occurred. Please try again';
    }
});
