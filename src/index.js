// index.js
import "./styles.css";
import "./reset.css";
import { parse, format, startOfHour } from "date-fns";

//ask user for current location
navigator.geolocation.getCurrentPosition((position) => {
  let location = `${position.coords.latitude}, ${position.coords.longitude}`;
  submitSearch(location);
});

let unitSystem = "us";

// getIconSrc(currentWeather.icon);
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
      reverseGeocode(weatherJSON.latitude, weatherJSON.longitude).then(
        (reverseJSON) => {
          //THEN update weather information
          const address = `${reverseJSON[0].name}, ${reverseJSON[0].state}`;
          const currentWeather = getCurrentWeatherObject(weatherJSON);
          const weekWeather = getWeekWeatherArray(weatherJSON);
          updateTodayWeather(address, currentWeather);
          createWeekWeather(weekWeather);
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
      //whether we receive a resolve/reject, show main, remove loader, and reset the form.
      main.classList.remove("hidden");
      loader.classList.add("hidden");
      locationForm.reset();
    });
}

//uses Visual Crossing's API to receive weather information
async function fetchWeather(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=${unitSystem}&key=K3G2LWP2CFRKQBQBG9G32U75K`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const weatherJSON = await response.json();
  return weatherJSON;
}

//gets the city and state name using longitude and latitude
async function reverseGeocode(lat, lon) {
  const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=b80e80f2e3764460d2b1eb8f60a59cf2`;
  const response = await fetch(url);

  if (!response.ok) 
    throw new Error(`HTTP error! Status: ${response.status}`);

  const reverseJSON = await response.json();

  return reverseJSON;
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

function getNameOfDay(dateString) {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  const dayName = format(parsedDate, "EEEE");
  return dayName;
}

function getNameOfToday() {
  return format(new Date(), "EEEE");
}

function formatTimeRounded(time) {
  //Create Date object given string. HH: 24 hour time, mm: minutes, ss: seconds
  const date = parse(time, "HH:mm:ss", new Date());
  const rounded = startOfHour(date); //round down to start of hour
  const formatted = format(rounded, "h:mm a"); //h: 12 hour time, mm: minutes  a: AM/PM
  return formatted;
}

function formatTime(time) {
  const date = parse(time, "HH:mm:ss", new Date());
  const formatted = format(date, "h:mm a");
  return formatted;
}
//°C
function farenheitToCelsius(temp) {
  const result = ((temp - 32) * 5) / 9;
  return result.toFixed(1);
}

//°F
function celsiusToFarenheit(temp) {
  const result = (temp * 9) / 5 + 32;
  return result.toFixed(1);
}

function kilometerToMiles(speed) {
  const result = speed / 1.609;
  return result.toFixed(1);
}

function milesToKilometer(speed) {
  const result = speed * 1.609;
  return result.toFixed(1);
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
