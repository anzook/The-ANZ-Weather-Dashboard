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
    //     // let urlTest = "https://api.openweathermap.org/data/2.5/forecast?q=Baltimore&appid=c04cb915be53a048550a73855778b1d9";
    //     // console.log(queryURLcast == urlTest);

    //     $.ajax({
    //         url: queryURLcast,
    //         method: "GET",
    //         dataType: "json"
    //     }).then(function (ForecastData) {
    //         console.log(ForecastData);
    //     });  //call function to build daily forecast
    // }
    function renderCities() {

        var cities = JSON.parse(localStorage.getItem("cityList"));
        if (cities === null) {
            cities = [];
        }

        var cityInput = $("#city-input").val().trim();

        if (cityInput !== "") {
            cities.push(cityInput);
            cities = [...new Set(cities)]
        }
        $("#city-buttons").empty();
        console.log(cities);
        // Looping through the array of cities

        for (var i = 0; i < cities.length; i++) {

            // Then dynamicaly generating buttons for each city in the array.
            var a = $("<button>");
            a.addClass("city-btn");
            // Adding a data-attribute with a value of the movie at index i
            a.attr("city-name", cities[i]);
            // Providing the button's text with a value of the movie at index i
            a.text(cities[i]);
            // Adding the button to the HTML
            $("#city-buttons").append(a);
        }

        localStorage.setItem("cityList", JSON.stringify(cities));

    }

    renderCities();

    //attempt to pull user location  --- never works, feature abandoned for now
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition( function() {;
    //     $("#current-weather").empty().text("Latitude: " + position.coords.latitude +
    //     "<br>Longitude: " + position.coords.longitude);
    //     });
    //   } else {
    //     $("#current-weather").empty().text("Geolocation is not supported. Please search for a location on the left.");
    //   }

    //use favorites to fill search area
    $(document).on("click", ".city-btn", function (event) {
        event.preventDefault();
        $("#city-input").empty();
        $("#city-input").val($(this).attr("city-name"));
    });

    // .on("click") function associated with the Search Button
    $("#search-btn").on("click", function (event) {

        // (in addition to clicks). Prevents the page from reloading on form submit.
        event.preventDefault();
        // Empty the search
        // clear();
        // $.get("https://api.openweathermap.org/data/2.5/forecast?q=Baltimore&appid=c04cb915be53a048550a73855778b1d9").then((response)=>{
        //     console.log(response)
        // });

        // queryURL is the url we'll use to query the first API
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
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
            var queryURLuvi = "https://api.openweathermap.org/data/2.5/uvi?";
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

                $("#current-weather").empty().append(weather);

                //Build URL for daily forecast
                // var queryURLforecast = "https://api.openweathermap.org/data/2.5/forecast/daily?";
                var queryURLforecast = "https://api.openweathermap.org/data/2.5/forecast?";

                // let lat = WeatherData.coord.lat;
                // let lon = WeatherData.coord.lon;
                let cityId = WeatherData.id;

                var paramsURLforecast = { "appid": appId, "id": cityId, "units": "imperial" };
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
                    var forecast = ForecastData.list;
                    var dayCounter = 0;
                    var forecastWeek = []; // my array of day objects
                    var forecastDay = []; // my array of forecast objects

                    //go through the responses (3-hour) blocks and regroup them into arrays by day
                    //worked really hard to not make a loop within a loop here
                    for (var i = 0; i < forecast.length; i++) {
                        //set time comparison values
                        var day = moment.unix(forecast[i].dt).utc();
                        today = moment.utc().add((dayCounter + 1), 'days');
                        // console.log(day, today);
                        // console.log(forecast[i])

                        if (moment(today).isSame(day, 'day')) {  //if it's the same day, add it to the empty array
                            forecastDay.push(forecast[i]);  //add forecast to the array for that day
                        } else if (moment(today).isBefore(day, 'day')) { //if it's now the next day, kick over to the next array
                            forecastWeek[dayCounter] = forecastDay;  //save new array of forecasts organized by day
                            dayCounter++;  //move to next day
                            forecastDay = [];  //reset day of forecasts
                            forecastDay.push(forecast[i]);  //add forecast to the array for that day for this iteration
                        }

                    }
                    forecastWeek[dayCounter] = forecastDay; //captures remaining values after the loop ends

                    forecastWeek.forEach(renderDay);

                    renderCities();


                    function renderDay(forecastDay, index) {
                        // debugger;
                        var tempArr = [];
                        var tempTot = 0;
                        var humidTot = 0;

                        for (var i = 0; i < forecastDay.length; i++) {
                            tempArr.push(forecastDay[i].main.temp);
                            tempTot += forecastDay[i].main.temp;
                            humidTot += forecastDay[i].main.humidity;
                        }

                        var low = rounder((Math.min.apply(Math, tempArr)), 1);
                        var high = rounder((Math.max.apply(Math, tempArr)), 1);
                        var temp = rounder((tempTot / forecastDay.length), 1);
                        var humid = rounder(humidTot / forecastDay.length)
                        var date = moment.unix(forecastDay[1].dt).utc().format("dddd, MMM Do");  //pull date from any of the objects
                        // description cases: https://openweathermap.org/weather-conditions
                        var weather = (forecastDay[3].weather[0].description);  //grab conditions mid-day
                        // console.log(icon(weather));
                        var iconSym = icon(weather);

                        function rounder(value, decimal) {
                            var multiplier = Math.pow(10, decimal || 0);
                            return Math.round(value * multiplier) / multiplier;
                        }

                        var address = "#box-" + (index + 1);
                        var dayCast = $("<div>");
                        let dateDisp = $("<div>").text(date);
                        // let weatherDisp = $("<div>").text(weather);
                        let weatherDisp = $("<div>").html(iconSym);
                        // let weatherDisp = $("<div>").html("<i class='fas fa-cloud' aria-hidden='true'></i>");

                        console.log(icon(weather));

                        let tempDisp = $("<div>").text("Temp: " + temp + "°F");
                        let humidDisp = $("<div>").text("Humidity: " + humid + "%");

                        let minDisp = $("<div>").text("Low: " + low);
                        let maxDisp = $("<div>").text("High: " + high);
                        dayCast.append(dateDisp).append(weatherDisp).append(tempDisp).append(humidDisp).append(minDisp).append(maxDisp);
                        $(address).empty().append(dayCast);

                    }

                });

            }.bind(WeatherData)); //passes WeatherData object info along with UV info to function

        });
    });

    function icon(desc) {
        let code = "";
        console.log(desc)
        switch (desc) {
            case "clear sky":
                code = "<i class='fas fa-sun' aria-hidden='true'></i>";
                break;
            case "few clouds":
                code = "<i class='fas fa-cloud-sun' aria-hidden='true'></i>";
                break;
            case "scattered clouds":
                code = "<i class='fas fa-cloud' aria-hidden='true'></i>";
                break;
            case "shower rain":
                code = "<i class='fas fa-cloud-rain' aria-hidden='true'></i>";
                break;
            case "rain":
                code = "<i class='fas fa-cloud-showers-heavy' aria-hidden='true'></i>";
                break;
            case "thunderstorm":
                code = "<i class='fas fa-bolt' aria-hidden='true'></i>";
                break;
            case "snow":
                code = "<i class='fas fa-snowflake' aria-hidden='true'></i>";
                break;
            case "mist":
                code = "<i class='fas fa-smog' aria-hidden='true'></i>"
                break;
            case "broken clouds":
                code = "<i class='fas fa-cloud-sun' aria-hidden='true'></i>";
                break;
            default: code = "<i class='fas fa-cloud' aria-hidden='true'></i>";
        
        }
        console.log(code)
        return code;
    }

    //In case a clear button were to be added
    // //  .on("click") function associated with the clear button
    // $("#clear-all").on("click", clear);

    // // Function to empty out the cities
    // function clear() {
    //     $("#article-section").empty();
    // }


});

//greetings stranger ;)