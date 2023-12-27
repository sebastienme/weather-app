import './style.css';
import { weatherApi, form } from './script';

// Initialise the homepage with weather data of the city of Montreal 
weatherApi.fetchCity('Montreal');
// Initialise the city search input from the homepage
form.SubmitCitySearchQuery();

