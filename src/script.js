import { parse, format } from 'date-fns';

// WeatherApi is the factory function that contains all the function needed to connect and interact with the weatherAPI api (https://www.weatherapi.com/docs/)
export const weatherApi = (() => {
    // my Api Key
    const getApiKey = () => {
        return '7dae99872c724371a9c183525232412'
    }

    // Function that return a city as an object.Current object contains current or realtime weather information for a given city.
    // 'Realtime API' - see weatherAPI doc
    const getCityCurrent = async (city) => {
        try {
            const cityApi = await fetch(`https://api.weatherapi.com/v1/current.json?key=${getApiKey()}&q=${city}`);
            const cityObj = await cityApi.json();

            // Check if the HTTP response status is in the range of 200-299 (indicating success)
            if (!cityApi.ok) {
                editDom.addText(cityObj.error.message, '.weather-data__search-input__alert');
                editDom.addText("Search must be in the form of 'City', 'City, State' or 'City, Country'.", '.weather-data__search-input__alert-2');
                throw new Error(`HTTP error! Status: ${cityApi.status}`);
            }
            editDom.clearDiv('.weather-data__search-input__alert');
            editDom.clearDiv('.weather-data__search-input__alert-2');
            return cityObj;  
        } catch (error) {
            console.log(error);
        }
    }

     /* Function that return a city as an object.Forecast object contains day weather forecast and hourly interval weather information for a given city.
     'Forecast API' - see weatherAPI doc */
    const getCityForecast = async (city) => {
        try {
            const cityApi = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${getApiKey()}&q=${city}`);
            const cityObj = await cityApi.json();
            return cityObj; 
        } catch (error) {
            console.log(error);
        }
    }

     /* Function that play the role of a 'Chef d'Orchestre'. It will gather all the data/details from a given city before
     sending it to the dom and update the dom. */
    const fetchCity = async (city) => {
        try {
            const cityObjCurrent = await getCityCurrent(city);
            const cityObjForecast = await getCityForecast(city);

            // if undefined, it's because the user has type and submit a city that is not in database
            if (cityObjCurrent !== undefined) {
                editDom.addText(cityObjCurrent.current.condition.text, '.weather-data__condition');
                editDom.addText(cityObjCurrent.location.name + ', ' + cityObjCurrent.location.region, '.weather-data__city');
                editDom.addText(cityObjCurrent.location.name + ' Today', 'title');
                editDom.addText(formatString.formatDate(cityObjCurrent.location.localtime), '.weather-data__date');
                editDom.addText(formatString.formatTime(cityObjCurrent.location.localtime), '.weather-data__time');
                editDom.addText(Math.round(cityObjCurrent.current.temp_c) + ' °C', '.weather-data__temp');
                editDom.addImage(cityObjCurrent.current.condition.icon, '.weather-data__icon img');

                editDom.addText(Math.round(cityObjCurrent.current.feelslike_c) + ' °C', '.weather-details__item__data__value.feels');
                editDom.addText(cityObjCurrent.current.humidity  + ' %', '.weather-details__item__data__value.hum');
                editDom.addText(cityObjForecast.forecast.forecastday[0].day.daily_chance_of_rain  + ' %', '.weather-details__item__data__value.rain');
                editDom.addText(cityObjCurrent.current.wind_mph + ' mp/h', '.weather-details__item__data__value.wind');
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    return {
        fetchCity    
    }
})();

// Factory function to edit/modified the dom
const editDom = (() => {
    // Function to add a string to the dom
    const addText = (data, selector) => {
        document.querySelector(selector).innerHTML = data;
    };

    // Function to add an image to the dom
    const addImage = (imageSrc, selector) => {
        document.querySelector(selector).src = imageSrc;
    };

    // Function that clears the dom
    const clearDiv = (selector) => {
        document.querySelector(selector).innerHTML = '';
    }

    return {
        addText,
        addImage,
        clearDiv
    }
})();

// Factory function that return functions for the search input form
export const form = (() => {
    // Functions that send the user search query for the city he is looking for. A search bar!
    const SubmitCitySearchQuery = () => {
        const userForm = document.getElementById('user-search');
        userForm.addEventListener('submit', (e) => {
            const inputResponse = document.querySelector('.input-response').value;
            e.preventDefault();
            weatherApi.fetchCity(inputResponse);
        })
    }

    return {
        SubmitCitySearchQuery
    }
})();

// Factory function that return functions for formatting Strings
const formatString = (() => {
    // Function that format the dates
    const formatDate = (inputDateString) => {
        // Parse the input date string
        const parsedDate = parse(inputDateString, 'yyyy-MM-dd HH:mm', new Date());
        // Format the parsed date
        const formattedDate = format(parsedDate, "EEEE, do MMM ''yy");
        
        return formattedDate; 
    }
    // Function that format the time
    const formatTime = (inputDateString) => {
        // Parse the input date string
        const parsedDate = parse(inputDateString, 'yyyy-MM-dd HH:mm', new Date());
        // Format the parsed date
        const formattedTime = format(parsedDate, 'h:mm a');
        
        return formattedTime; 
    }

    return {
        formatDate,
        formatTime
    }
})();

