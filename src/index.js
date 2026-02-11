// index.js
import "./styles.css";
import "./reset.css";
import { parse, format, startOfHour } from "date-fns";
// import { address, currentWeather, weekWeather } from "./test";

let unitSystem = "us";

// getIconSrc(currentWeather.icon);
const loader = document.querySelector(".loader-container");
const locationForm = document.querySelector(".search-form");
const locationInput = document.querySelector("#search-input");
const searchButton = document.querySelector(".search-btn");

searchButton.addEventListener("submit", (e) => {
  e.preventDefault();
  submitSearch();
})
locationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitSearch();
});

const farenheitBtn = document.querySelector(".farenheit");
const celsiusBtn = document.querySelector(".celsius");

farenheitBtn.addEventListener("click", (e) => {
  if (farenheitBtn.classList.contains("selected")) return;

  farenheitBtn.classList.add("selected");
  celsiusBtn.classList.remove("selected");
  swapMeasurementSystem();
});

celsiusBtn.addEventListener("click", (e) => {
  if (celsiusBtn.classList.contains("selected")) return;

  celsiusBtn.classList.add("selected");
  farenheitBtn.classList.remove("selected");
  swapMeasurementSystem();
});

function submitSearch(){
  fetchWeather(locationInput.value)
  .catch((err) => {
    console.log("in catch");
    const main = document.querySelector(".main");
    const errorEl = document.querySelector(".error-container");
    // loader.classList.add("hidden");
    main.classList.add("hidden");
    errorEl.classList.remove("hidden");
    console.error(err);
  })
  .finally(()=>{
    //whether we receive a resolve/reject, remove the loader and reset the form.
      loader.classList.add("hidden");
      locationForm.reset();
  })

  loader.classList.remove("hidden");
  locationForm.reset();
}

async function fetchWeather(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=${unitSystem}&key=K3G2LWP2CFRKQBQBG9G32U75K`;
  const response = await fetch(url);

  //check for any errors, if any, we will be taken to the .catch of fetchWeather.
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const weatherJSON = await response.json();
  console.log(weatherJSON);
  //show main
  const main = document.querySelector(".main");
  main.classList.remove("hidden");

  //hide error if visible
  const errorEl = document.querySelector(".error-container");
  errorEl.classList.add("hidden");

  //update main info
  const address = weatherJSON.address;
  const currentWeather = getCurrentWeatherObject(weatherJSON);
  const weekWeather = getWeekWeatherArray(weatherJSON);
  updateTodayWeather(address, currentWeather);
  createBottomMain(weekWeather);

  //fade loader out
  loader.classList.add("hidden");
  return weatherJSON;
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
    precip: data.precip,
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
  const mainTop = document.querySelector(".main__top");

  const location = mainTop.querySelector(".location-name");
  const icon = mainTop.querySelector(".current-icon");
  const temp = mainTop.querySelector(".temp");
  const tempUnit = mainTop.querySelector(".temp-unit");
  const conditions = mainTop.querySelector(".current-conditions");
  const currentDay = mainTop.querySelector(".current-day");
  const currentHour = mainTop.querySelector(".current-hour");
  const humidity = mainTop.querySelector(".humidity");
  const precip = mainTop.querySelector(".precipitation");
  const windspeed = mainTop.querySelector(".windspeed");
  const speedUnit = mainTop.querySelector(".speed-unit");
  const uvIndex = mainTop.querySelector(".uv-index");
  const sunrise = mainTop.querySelector(".sunrise");
  const sunset = mainTop.querySelector(".sunset");

  location.textContent = address;
  setIcon(icon, currentWeather.icon);
  temp.textContent = currentWeather.temp;
  tempUnit.textContent = unitSystem === "us" ? "°F" : "°C";
  conditions.textContent = currentWeather.conditions;
  currentDay.textContent = getNameOfToday();
  currentHour.textContent = formatTimeRounded(currentWeather.dateTime);
  humidity.textContent = currentWeather.humidity + "%";
  precip.textContent = currentWeather.precip + "%";
  windspeed.textContent = currentWeather.windspeed;
  speedUnit.textContent = unitSystem === "us" ? "mph" : "km/h"
  uvIndex.textContent = currentWeather.uvIndex;
  sunrise.textContent = formatTime(currentWeather.sunrise);
  sunset.textContent = formatTime(currentWeather.sunset);
}

function createBottomMain(weekWeather) {
  const mainBottom = document.querySelector(".main__bottom");
  mainBottom.replaceChildren(); //reset mainBottom
  weekWeather.forEach((day) => {
    const card = createDayCard(day);
    mainBottom.append(card);
  });
}

//creates a card for each day in 7 day forecast
function createDayCard(dayWeather) {
  const card = document.createElement("div");
  card.classList.add("card");

  const day = document.createElement("div");
  day.classList.add("day");

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

function toggleMain(){
  const mainEl = document.querySelector(".main");
  mainEl.classList.toggle("hidden");
}

function toggleLoader(){
  const errorEl = document.querySelector(".error-container");
  errorEl.classList.toggle("hidden");
}

function toggleError(){
  const loaderEl = document.querySelector(".loader-container");
  loaderEl.classList.toggle("hidden");
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
