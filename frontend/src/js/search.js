document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior
    
    const query = this.querySelector('input[name="query"]').value;
 
    if (query.length < 1) { // Only search if the input has minimum 1 character
        document.getElementById("search-results").innerHTML = '';
        location.reload();
    }
    window.location.href = `/search?query=${encodeURIComponent(query).replace(/%20/g, '+')}`;
});
