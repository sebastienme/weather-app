const weatherApi = (() => {
    const getApiKey = () => {
        return '7dae99872c724371a9c183525232412'
    }

    const getCity = async (city) => {
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

    const fetchCity = async (city) => {
        try {
            const cityObj = await getCity(city);
            if (cityObj !== undefined) {
                editDom.addText(cityObj.current.condition.text, '.weather-data__condition');
                editDom.addText(cityObj.location.name, '.weather-data__city');
                editDom.addText(cityObj.location.localtime, '.weather-data__date');
                editDom.addText(cityObj.location.localtime, '.weather-data__time');
                editDom.addText(cityObj.current.temp_c, '.weather-data__temp');
                editDom.addImage(cityObj.current.condition.icon, '.weather-data__icon img');
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