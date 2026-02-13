// index.js
import "./styles.css";
import "./reset.css";
import { fetchWeather, fetchAddress } from "./api.js";
import {
  getNameOfDay,
  getNameOfToday,
  formatTimeRounded,
  formatTime,
  farenheitToCelsius,
  celsiusToFarenheit,
  kilometerToMiles,
  milesToKilometer,
} from "./utils.js";

const state = {
  lastQuery: "",
  address: "", 
  unitSystem: "us",
  currentWeather: {},
  weekWeather: []
}

let unitSystem = "us";

const locationForm = document.querySelector(".search-form");
const locationInput = document.querySelector("#search-input");
const searchButton = document.querySelector(".search-btn");

searchButton.addEventListener("submit", (e) => {
  e.preventDefault();
  submitSearch(locationInput.value);
});
locationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitSearch(locationInput.value);
});

const farenheitBtn = document.querySelector(".farenheit");
const celsiusBtn = document.querySelector(".celsius");

farenheitBtn.addEventListener("click", () => {
  if (farenheitBtn.classList.contains("selected")) return;

  farenheitBtn.classList.add("selected");
  celsiusBtn.classList.remove("selected");
  swapMeasurementSystem();
});

celsiusBtn.addEventListener("click", () => {
  if (celsiusBtn.classList.contains("selected")) return;

  celsiusBtn.classList.add("selected");
  farenheitBtn.classList.remove("selected");
  swapMeasurementSystem();
});

function submitSearch(location) {
  const main = document.querySelector(".main");
  const errorEl = document.querySelector(".error-container");
  const loader = document.querySelector(".loader-container");

  //show main and loader
  loader.classList.remove("hidden");

  //hide error if visible
  errorEl.classList.add("hidden");

  fetchWeather(location) //get location info
    .then((weatherJSON) => {
      console.log(weatherJSON);
      /*THEN get the properly formatted name using latitude and longitude 
      in the case they enter a typo (which can still be valid)
      OR they use geolocation API to get their current longitude and latitude
      */
      fetchAddress(weatherJSON.latitude, weatherJSON.longitude).then(
        (locationJSON) => {
          //THEN update weather information
          updateUI(weatherJSON, locationJSON);
          main.classList.remove("hidden");
        },
      );
    })
    .catch((err) => {
      //show error
      main.classList.add("hidden");
      errorEl.classList.remove("hidden");
      console.error(err);
    })
    .finally(() => {
      //whether we receive a resolve/reject, remove loader, and reset the form.
      loader.classList.add("hidden");
      locationForm.reset();
    });
}


function updateUI(weatherJSON, locationJSON) {
  const address = getFormattedAddress(locationJSON);
  const currentWeather = getCurrentWeatherObject(weatherJSON);
  const weekWeather = getWeekWeatherArray(weatherJSON);

  updateTodayWeather(address, currentWeather);
  createWeekWeather(weekWeather);
}

//creates and returns formatted address given from
function getFormattedAddress(locationJSON) {
  console.log(locationJSON);
  let city = locationJSON[0].name;
  let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  let country = regionNames.of(locationJSON[0].country);

  if (country === "United States") {
    let state = locationJSON[0].state;
    return `${city}, ${state}`;
  } else {
    return `${city}, ${country}`;
  }
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

function updateTodayWeather(address, currentWeather) {
  // const content = document.querySelector(".content");
  const todayContainer = document.querySelector(".today-container");

  const location = todayContainer.querySelector(".location-name");
  const icon = todayContainer.querySelector(".today-icon");
  const temp = todayContainer.querySelector(".temp");
  const tempUnit = todayContainer.querySelector(".temp-unit");
  const conditions = todayContainer.querySelector(".today-conditions");
  const dayName = todayContainer.querySelector(".day");
  const currentHour = todayContainer.querySelector(".hour");
  const humidity = todayContainer.querySelector(".humidity");
  const precip = todayContainer.querySelector(".precipitation");
  const windspeed = todayContainer.querySelector(".windspeed");
  const speedUnit = todayContainer.querySelector(".speed-unit");
  const uvIndex = todayContainer.querySelector(".uv-index");
  const sunrise = todayContainer.querySelector(".sunrise");
  const sunset = todayContainer.querySelector(".sunset");

  location.textContent = address;
  setIcon(icon, currentWeather.icon);
  temp.textContent = currentWeather.temp;
  tempUnit.textContent = unitSystem === "us" ? "°F" : "°C";
  conditions.textContent = currentWeather.conditions;
  dayName.textContent = getNameOfToday();
  currentHour.textContent = formatTimeRounded(currentWeather.dateTime);
  humidity.textContent = currentWeather.humidity + "%";
  precip.textContent = currentWeather.precip + "%";
  windspeed.textContent = currentWeather.windspeed;
  speedUnit.textContent = unitSystem === "us" ? "mph" : "km/h";
  uvIndex.textContent = currentWeather.uvIndex;
  sunrise.textContent = formatTime(currentWeather.sunrise);
  sunset.textContent = formatTime(currentWeather.sunset);
}

function createWeekWeather(weekWeather) {
  const mainBottom = document.querySelector(".week-grid-container");
  mainBottom.replaceChildren(); //reset mainBottom
  weekWeather.forEach((day) => {
    const card = createWeekCard(day);
    mainBottom.append(card);
  });
}

//creates a card for each day in 7 day forecast
function createWeekCard(dayWeather) {
  const card = document.createElement("div");
  card.classList.add("week-card");

  const day = document.createElement("div");
  day.classList.add("day-name");

  const icon = document.createElement("img");
  icon.classList.add("icon");

  const tempContainer = document.createElement("div");
  tempContainer.classList.add("temp-container");

  const temp = document.createElement("span");
  temp.classList.add("temp");

  const tempUnit = document.createElement("span");
  tempUnit.classList.add("temp-unit");

  const conditions = document.createElement("div");
  conditions.classList.add("conditions");

  day.textContent = getNameOfDay(dayWeather.dateTime);
  setIcon(icon, dayWeather.icon);
  temp.textContent = dayWeather.temp;
  tempUnit.textContent = unitSystem === "us" ? "°F" : "°C";
  conditions.textContent = dayWeather.conditions;

  tempContainer.append(temp, tempUnit);
  card.append(day, icon, tempContainer, conditions);
  return card;
}

async function setIcon(icon, iconName) {
  const module = await import(`./images/${iconName}.svg`);
  icon.src = module.default;
}

function swapMeasurementSystem() {
  let tempUnit;
  let speedUnit;

  const tempUnits = document.querySelectorAll(".temp-unit");
  const speedUnits = document.querySelectorAll(".speed-unit");
  const tempValues = document.querySelectorAll(".temp");
  const windspeed = document.querySelector(".windspeed");

  if (unitSystem === "us") {
    unitSystem = "metric";
    tempUnit = "°C";
    speedUnit = "km/h";
    windspeed.textContent = milesToKilometer(Number(windspeed.textContent));
    tempValues.forEach((value) => {
      value.textContent = farenheitToCelsius(Number(value.textContent));
    });
  } else {
    unitSystem = "us";
    tempUnit = "°F";
    speedUnit = "mph";
    windspeed.textContent = kilometerToMiles(Number(windspeed.textContent));
    tempValues.forEach((value) => {
      value.textContent = celsiusToFarenheit(Number(value.textContent));
    });
  }

  tempUnits.forEach((unit) => {
    unit.textContent = tempUnit;
  });

  speedUnits.forEach((unit) => {
    unit.textContent = speedUnit;
  });
}
