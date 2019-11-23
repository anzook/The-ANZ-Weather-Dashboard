/*

*/


document.addEventListener("DOMContentLoaded", function (event) {  //waits for page load

    function buildQueryURL() {
        //     // queryURL is the url we'll use to query the API
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?";

        var queryParams = {
            "APPID": "c04cb915be53a048550a73855778b1d9"
            , "units": "imperial"
        };

        // Grab text the user typed into the search input, add to the queryParams object
        queryParams.q = $("#city-input")
            .val()
            .trim();

        // Logging the URL so we have access to it for troubleshooting
        console.log("---------------\nURL: " + queryURL + "\n---------------");
        console.log(queryURL + $.param(queryParams));
        return queryURL + $.param(queryParams);
    }

    function buildUviUrl(WeatherData) {
        var queryURLuvi = "http://api.openweathermap.org/data/2.5/uvi?";
        let lat = WeatherData.coord.lat;
        let lon = WeatherData.coord.lon;
        var queryParamsUvi = { "APPID": "c04cb915be53a048550a73855778b1d9", "lat": lat, "lon": lon };

        return queryURLuvi + $.param(queryParamsUvi);
    }

    /**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} UviData - object containing NYT API data
 */
    function getUVI(WeatherData) {
        var queryURLuvi = buildUviUrl(WeatherData);

        $.ajax({
            url: queryURLuvi,
            method: "GET"
        }).then(UviInfo);
    }


    function UviInfo(UviData) {
        console.log(" ------------ UVI Data ----------------- ")
        console.log(UviData);
        // return UviData.value;
    }

    // Function to empty out the articles
    function clear() {
        $("#article-section").empty();
    }

    // .on("click") function associated with the Search Button
    $("#search-btn").on("click", function (event) {
        // This line allows us to take advantage of the HTML "submit" property
        // This way we can hit enter on the keyboard and it registers the search
        // (in addition to clicks). Prevents the page from reloading on form submit.
        event.preventDefault();
        // Empty the search
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

    /**
     * takes API data (JSON/object) and turns it into elements on the page
     * @param {object} WeatherData - object containing NYT API data
     */
    function updatePage(WeatherData) {
        console.log(WeatherData);
        var weather = $("<div>");
        //City name
        let cityName = WeatherData.name;
        //Temperature
        let temp = WeatherData.main.temp;
        //Humidity
        let humidity = WeatherData.main.humidity;
        //Wind speed
        let wind = WeatherData.wind.speed;
        //UV index
        let uv = getUVI(WeatherData);
        weather.text("City: " + WeatherData.name + "\n");


        $("#current-weather").append(weather);
    }

});