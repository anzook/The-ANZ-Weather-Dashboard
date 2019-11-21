/*

*/


document.addEventListener("DOMContentLoaded", function (event) {  //waits for page load

    function buildQueryURL() {
        // queryURL is the url we'll use to query the API
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

        // Begin building an object to contain our API call's query parameters
        // Set the API key
        var queryParams = { "api-key": "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M" };

        // Grab text the user typed into the search input, add to the queryParams object
        queryParams.q = $("#search-term")
            .val()
            .trim();

        // Logging the URL so we have access to it for troubleshooting
        console.log("---------------\nURL: " + queryURL + "\n---------------");
        console.log(queryURL + $.param(queryParams));
        return queryURL + $.param(queryParams);
    }


    // Function to empty out the articles
    function clear() {
        $("#article-section").empty();
    }

    // .on("click") function associated with the Search Button
$("#run-search").on("click", function(event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();
  
    // Empty the region associated with the articles
    clear();
  
    // Build the query URL for the ajax request to the NYT API
    var queryURL = buildQueryURL();
  
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(updatePage);
  });
  
  //  .on("click") function associated with the clear button
  $("#clear-all").on("click", clear);

  function updatePage(NYTData) {
  
}

});