/*

*/

document.addEventListener("DOMContentLoaded", function (event) {  //waits for page load
    var appId = "c04cb915be53a048550a73855778b1d9"

    /**
   * takes API data (JSON/object) and turns it into elements on the page
   * @param {object} WeatherData - object containing current day weather
   * @param {object} UviData - object containing UV Index info
   * @param {object} ForecastData - object containing 5-day forecast info info
   */


    // function renderViz(WeatherData, UviData) {
    //     console.log(WeatherData);
    //     console.log(UviData);

    // }

    // function getForecast(WeatherData) {
    //     var queryURLforecast = "http://api.openweathermap.org/data/2.5/forecast/daily?";
    //     // var queryURLforecast = "http://api.openweathermap.org/data/2.5/forecast/?";

    //     let lat = WeatherData.coord.lat;
    //     let lon = WeatherData.coord.lon;

    //     var paramsURLforecast = { "appid": appId, "lat": lat, "lon": lon, "cnt": 5 };
    //     // var paramsURLforecast = { "q" : "Baltimore", "appid": appId};
    //     //    console.log(queryURLforecast + $.param(paramsURLforecast));

    //     var queryURLcast = queryURLforecast + $.param(paramsURLforecast);
    //     console.log(queryURLcast);
    //     // let urlTest = "http://api.openweathermap.org/data/2.5/forecast?q=Baltimore&appid=c04cb915be53a048550a73855778b1d9";
    //     // console.log(queryURLcast == urlTest);

    //     $.ajax({
    //         url: queryURLcast,
    //         method: "GET",
    //         dataType: "json"
    //     }).then(function (ForecastData) {
    //         console.log(ForecastData);
    //     });  //call function to build daily forecast
    // }

    // .on("click") function associated with the Search Button
    $("#search-btn").on("click", function (event) {
        // This line allows us to take advantage of the HTML "submit" property
        // This way we can hit enter on the keyboard and it registers the search
        // (in addition to clicks). Prevents the page from reloading on form submit.
        event.preventDefault();
        // Empty the search
        clear();
        // $.get("http://api.openweathermap.org/data/2.5/forecast?q=Baltimore&appid=c04cb915be53a048550a73855778b1d9").then((response)=>{
        //     console.log(response)
        // });

        //     // queryURL is the url we'll use to query the API
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?";
        var queryParams = {
            "APPID": appId
            , "units": "imperial"
        };
        // Grab text the user typed into the search input, add to the queryParams object
        queryParams.q = $("#city-input")
            .val()
            .trim();
        // Logging the URL so we have access to it for troubleshooting
        // console.log("---------------\nURL: " + queryURL + "\n---------------");
        // console.log(queryURL + $.param(queryParams));
        var queryURL = queryURL + $.param(queryParams);
        // // Make the AJAX request to the API - GETs the JSON data at the queryURL.
        // // The data then gets passed as an argument to the updatePage function
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (WeatherData) {
            //build URL for UV call with WeatherData object information
            var queryURLuvi = "http://api.openweathermap.org/data/2.5/uvi?";
            let lat = WeatherData.coord.lat;
            let lon = WeatherData.coord.lon;
            var queryParamsUvi = { "appid": appId, "lat": lat, "lon": lon };

            var queryURLuvi = queryURLuvi + $.param(queryParamsUvi);

            $.ajax({
                url: queryURLuvi,
                method: "GET"
            }).then(function (UviData) {
                // renderViz(WeatherData, UviData);
                var weather = $("<div>");
                //City name
                let cityName = $("<div>").text("City: " + WeatherData.name);
                //Temperature
                let temp = $("<div>").text("Temperature: " + WeatherData.main.temp + " F");
                //Humidity
                let humidity = $("<div>").text("Humidity: " + WeatherData.main.humidity + "%");
                //Wind speed
                let wind = $("<div>").text("Wind: " + WeatherData.wind.speed + " mph");
                //UV index
                let uvIndex = $("<div>").text("UV index: " + UviData.value);

                weather.append(cityName).append(temp).append(humidity).append(wind).append(uvIndex);

                $("#current-weather").append(weather);

                //Build URL for daily forecast
                // var queryURLforecast = "http://api.openweathermap.org/data/2.5/forecast/daily?";
                var queryURLforecast = "http://api.openweathermap.org/data/2.5/forecast/?";

                let lat = WeatherData.coord.lat;
                let lon = WeatherData.coord.lon;

                var paramsURLforecast = { "appid": appId, "lat": lat, "lon": lon, "cnt": 5 };
                // var paramsURLforecast = { "q" : "Baltimore", "appid": appId};
                //    console.log(queryURLforecast + $.param(paramsURLforecast));

                var queryURLcast = queryURLforecast + $.param(paramsURLforecast);
                console.log(queryURLcast);
                // let urlTest = "http://api.openweathermap.org/data/2.5/forecast?q=Baltimore&appid=c04cb915be53a048550a73855778b1d9";
                // console.log(queryURLcast == urlTest);

                $.ajax({
                    url: queryURLcast,
                    method: "GET",
                    dataType: "json"
                }).then(function (ForecastData) {
                    console.log(ForecastData);
                });  //call function to build daily forecast

                // getForecast(WeatherData); //trigger forecast data call
            }.bind(WeatherData)); //passes WeatherData object info along with UV info to function

        });
    });



    //  .on("click") function associated with the clear button
    $("#clear-all").on("click", clear);

    // Function to empty out the cities
    function clear() {
        $("#article-section").empty();
    }


});