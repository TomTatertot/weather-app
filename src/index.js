// index.js
import "./styles.css";
import "./reset.css";
import { fetchWeatherJSON, fetchAddressJSON, getUserCoordinates } from "./api.js";
import {getFormattedAddress} from "./utils.js";
import {
  updateTodayWeather,
  createWeekWeather,
  setUnitBtnToFarenheit,
  setUnitBtnToCelsius,
  showMain,
  hideMain,
  showLoader,
  hideLoader,
  showError,
  hideError,
} from "./dom.js";

const state = {
  lastQuery: "",
  unitSystem: "us",
  address: "",
  currentWeather: {},
  weekWeather: [],
};

getUserCoordinates().then((location)=>{
  submitSearch(location);
});

const locationForm = document.querySelector(".search-form");
const searchButton = document.querySelector(".search-btn");
const farenheitBtn = document.querySelector(".farenheit");
const celsiusBtn = document.querySelector(".celsius");

searchButton.addEventListener("submit", (e) => {
  const searchInputEl = document.querySelector("#search-input");
  e.preventDefault();
  submitSearch(searchInputEl.value);
});

locationForm.addEventListener("submit", (e) => {
  const searchInputEl = document.querySelector("#search-input");
  submitSearch(searchInputEl.value);
  e.preventDefault();
});

farenheitBtn.addEventListener("click", () => {
  setUnitBtnToFarenheit();
  swapMeasurementSystem();
  submitSearch(state.lastQuery);
});

celsiusBtn.addEventListener("click", () => {
  setUnitBtnToCelsius();
  swapMeasurementSystem();
  submitSearch(state.lastQuery);
});

function submitSearch(location) {
  showLoader();
  hideError();

  fetchWeatherJSON(location, state.unitSystem) //get location info
    .then((weatherJSON) => {
      /*THEN get the properly formatted name using latitude and longitude in the case they enter a typo (which can still be valid)
      OR they use geolocation API to get their current longitude and latitude */
      fetchAddressJSON(weatherJSON.latitude, weatherJSON.longitude).then(
        (locationJSON) => {
          state.lastQuery = location;
          state.address = getFormattedAddress(locationJSON);
          state.currentWeather = getCurrentWeatherObject(weatherJSON);
          state.weekWeather = getWeekWeatherArray(weatherJSON);
          renderUI();
          showMain();
        },
      );
    })
    .catch((err) => {
      hideMain();
      showError();
      console.error(err);
    })
    .finally(() => {
      hideLoader();
      locationForm.reset();
    });
}

function renderUI() {
  updateTodayWeather(state.address, state.currentWeather, state.unitSystem);
  createWeekWeather(state.weekWeather, state.unitSystem);
}

//returns object containing data of the current day.
function getCurrentWeatherObject(dataJSON) {
  const data = dataJSON.currentConditions;

  return {
    temp: data.temp,
    conditions: data.conditions,
    icon: data.icon,
    dateTime: data.datetime,
    humidity: data.humidity,
    precip: data.precipprob,
    windspeed: data.windspeed,
    uvIndex: data.uvindex,
    sunset: data.sunset,
    sunrise: data.sunrise,
  };
}

//returns an array containing the objects of data for 7-day weather
function getWeekWeatherArray(dataJSON) {
  let weekWeather = [];
  for (let i = 0; i < 7; i++) {
    let dayWeather = dataJSON.days[i];
    weekWeather[i] = {
      temp: dayWeather.temp,
      conditions: dayWeather.conditions,
      icon: dayWeather.icon,
      dateTime: dayWeather.datetime,
    };
  }

  return weekWeather;
}

function swapMeasurementSystem(){
  state.unitSystem = state.unitSystem === "us" ? "metric" : "us";
}
