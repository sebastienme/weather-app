import { parse, format } from 'date-fns';

export const weatherApi = (() => {
    const getApiKey = () => {
        return '7dae99872c724371a9c183525232412'
    }

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
    const getCityForecast = async (city) => {
        try {
            const cityApi = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${getApiKey()}&q=${city}`);
            const cityObj = await cityApi.json();
            return cityObj; 
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCity = async (city) => {
        try {
            const cityObjCurrent = await getCityCurrent(city);
            const cityObjForecast = await getCityForecast(city);

            // if undefined, it's because the user has type and submit a city that is not in database
            if (cityObjCurrent !== undefined) {
                editDom.addText(cityObjCurrent.current.condition.text, '.weather-data__condition');
                editDom.addText(cityObjCurrent.location.name + ', ' + cityObjCurrent.location.region, '.weather-data__city');
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

const editDom = (() => {
    const addText = (data, selector) => {
        document.querySelector(selector).innerHTML = data;
    };

    const addImage = (imageSrc, selector) => {
        document.querySelector(selector).src = imageSrc;
    };

    const clearDiv = (selector) => {
        document.querySelector(selector).innerHTML = '';
    }

    return {
        addText,
        addImage,
        clearDiv
    }
})();

export const form = (() => {
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

const formatString = (() => {
    const formatDate = (inputDateString) => {
        // Parse the input date string
        const parsedDate = parse(inputDateString, 'yyyy-MM-dd HH:mm', new Date());
        // Format the parsed date
        const formattedDate = format(parsedDate, "EEEE, do MMM ''yy");
        
        return formattedDate; 
    }

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

