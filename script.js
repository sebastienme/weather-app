const weatherApi = (() => {
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
                console.log(cityObj.error.message);
                throw new Error(`HTTP error! Status: ${cityApi.status}`);
            }
            console.log(cityObj)
            console.log("ici")
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
                editDom.addText(cityObjCurrent.location.name, '.weather-data__city');
                editDom.addText(cityObjCurrent.location.localtime, '.weather-data__date');
                editDom.addText(cityObjCurrent.location.localtime, '.weather-data__time');
                editDom.addText(cityObjCurrent.current.temp_c + ' °C', '.weather-data__temp');
                editDom.addImage(cityObjCurrent.current.condition.icon, '.weather-data__icon img');

                editDom.addText(cityObjCurrent.current.feelslike_c + ' °C', '.weather-details__item__data__value.feels');
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
        const element = document.querySelector(selector);
        element.innerHTML = data;
    };

    const addImage = (imageSrc, selector) => {
        const img = document.querySelector(selector);
        img.src = imageSrc;
    };

    return {
        addText,
        addImage
    }
})();

const form = (() => {
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

weatherApi.fetchCity('Montreal');
form.SubmitCitySearchQuery();