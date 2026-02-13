// index.js
import "./styles.css";
import "./reset.css";
import { fetchWeather, fetchAddress } from "./api.js";
import {
  farenheitToCelsius,
  celsiusToFarenheit,
  kilometerToMiles,
  milesToKilometer,
  getFormattedAddress,
} from "./utils.js";
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
fetchAddress(33.1977, -117.3788);

const locationForm = document.querySelector(".search-form");
const searchButton = document.querySelector(".search-btn");
const farenheitBtn = document.querySelector(".farenheit");
const celsiusBtn = document.querySelector(".celsius");

searchButton.addEventListener("submit", (e) => {
  const searchInputEl = document.querySelector("#search-input");
  e.preventDefault();
  //set all the state values
  submitSearch(searchInputEl.value);
  // submitSearch(locationInput.value);
});

locationForm.addEventListener("submit", (e) => {
  const searchInputEl = document.querySelector("#search-input");
  submitSearch(searchInputEl.value);
  e.preventDefault();
  // submitSearch(locationInput.value);
});

farenheitBtn.addEventListener("click", () => {
  // if (unitSystem === "us") return;
  setUnitBtnToFarenheit();
  swapMeasurementSystem();
  submitSearch(state.lastQuery);
  // renderUI();
});

celsiusBtn.addEventListener("click", () => {
  // if (celsiusBtn.classList.contains("selected")) return;

  setUnitBtnToCelsius();
  swapMeasurementSystem();
  submitSearch(state.lastQuery);
});

function submitSearch(location) {
  showLoader();
  hideError();

  fetchWeather(location, state.unitSystem) //get location info
    .then((weatherJSON) => {
      console.log(weatherJSON);
      /*THEN get the properly formatted name using latitude and longitude 
      in the case they enter a typo (which can still be valid)
      OR they use geolocation API to get their current longitude and latitude
      */
      fetchAddress(weatherJSON.latitude, weatherJSON.longitude).then(
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
  // const address = state.address;
  updateTodayWeather(state.address, state.currentWeather, state.unitSystem);
  createWeekWeather(state.weekWeather, state.unitSystem);
  // const address = getFormattedAddress(locationJSON);
  // const currentWeather = getCurrentWeatherObject(weatherJSON);
  // const weekWeather = getWeekWeatherArray(weatherJSON);
  // updateTodayWeather(address, currentWeather);
  // createWeekWeather(weekWeather);
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

// function swapMeasurementSystem() {
//   let tempUnit;
//   let speedUnit;

//   const tempUnits = document.querySelectorAll(".temp-unit");
//   const speedUnits = document.querySelectorAll(".speed-unit");
//   const tempValues = document.querySelectorAll(".temp");
//   const windspeed = document.querySelector(".windspeed");

//   if (state.unitSystem === "us") {
//     unitSystem = "metric";
//     tempUnit = "°C";
//     speedUnit = "km/h";
//     windspeed.textContent = milesToKilometer(Number(windspeed.textContent));
//     tempValues.forEach((value) => {
//       value.textContent = farenheitToCelsius(Number(value.textContent));
//     });
//   } else {
//     unitSystem = "us";
//     tempUnit = "°F";
//     speedUnit = "mph";
//     windspeed.textContent = kilometerToMiles(Number(windspeed.textContent));
//     tempValues.forEach((value) => {
//       value.textContent = celsiusToFarenheit(Number(value.textContent));
//     });
  // tempUnits.forEach((unit) => {
  //   unit.textContent = tempUnit;
  // });

  // speedUnits.forEach((unit) => {
  //   unit.textContent = speedUnit;
  // });
//   }

function swapMeasurementSystem(){
  console.log(state.unitSystem);
  state.unitSystem = state.unitSystem === "us" ? "metric" : "us";
  console.log(state.unitSystem);

}
