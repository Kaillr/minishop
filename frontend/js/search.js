document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior
    
    const query = this.querySelector('input[name="query"]').value;

    console.log(query);

    // Only search if the input has a minimum length (e.g., 2 characters)
    if (query.length < 2) {
        document.getElementById("search-results").innerHTML = '';
        return;
    }

    // Redirect to the search page with the query
    window.location.href = `/search?query=${encodeURIComponent(query)}`;
});
