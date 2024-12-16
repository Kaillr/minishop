document.getElementById('addFaqForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;

    const formData = {
        question: question,
        answer: answer
    };

    try {
        const response = await fetch('/settings/admin/faqs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("message").innerText = "FAQ added successfully!";
            document.getElementById("error").innerText = "";
        } else {
            document.getElementById("message").innerText = "";
            document.getElementById("error").innerText = result.error;
        }
    } catch (err) {
        console.error(err);
        document.getElementById("message").innerText = "";
        document.getElementById("error").innerText = "Failed to add FAQ. Try again later.";
    }
});