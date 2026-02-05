// index.js
import "./styles.css";
import "./reset.css";
import { parse, format, startOfHour } from "date-fns";

//simulated weather data objects to prevent too many API calls being made while testing:
const address = "Oceanside";
const currentWeather = {
  temp: 70,
  conditions: "Clear",
  icon: "clear-day",
  dateTime: "22:10:23",
  humidity: 79.5,
  precip: 0,
  windspeed: 3,
  uvIndex: 0,
  sunset: "06:42:38",
  sunrise: "17:24:15",
};

const weekWeather = [
  { temp: 70, conditions: "Clear", icon: "clear-day", dateTime: "2026-02-04" },
  { temp: 59, conditions: "Cloudy", icon: "cloudy", dateTime: "2026-02-05" },
  { temp: 65, conditions: "Rain", icon: "rain", dateTime: "2026-02-06" },
  { temp: 81, conditions: "Clear", icon: "clear-day", dateTime: "2026-02-07" },
  {
    temp: 65, conditions: "Partially Cloudy", icon: "partly-cloudy-day", dateTime: "2026-02-08",
  },
  {
    temp: 72, conditions: "Partially Cloudy", icon: "partly-cloudy-night", dateTime: "2026-02-09",
  },
  { temp: 73, conditions: "Foggy", icon: "fog", dateTime: "2026-02-10" },
];

const measurementSystem = "Imperial";
let speedUnit = measurementSystem === "Imperial" ? "mph" : "km/h";
let tempUnit = measurementSystem === "Imperial" ? "°F" : "°C";

// getIconSrc(currentWeather.icon);

// const locationForm = document.querySelector(".search-form");
// locationForm.addEventListener("submit", (e)=> {
//   e.preventDefault();
//   let location = locationForm.querySelector("#search-input").value;
//   console.log(location);
//   locationForm.reset();

// fetchWeather("Oceanside").then(weather => {
//   const address = weather.address;
//   const currWeather = getCurrentWeather(weather);
//   const weekWeather = getWeekWeather(weather);
//   console.log(address, weather, currWeather, weekWeather);
// }).catch(err => {
//   console.error(err);
// });

// })
createTopMain("Oceanside", currentWeather);
createBottomMain(weekWeather);

async function fetchWeather(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=K3G2LWP2CFRKQBQBG9G32U75K`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const weatherJSON = await response.json();
  return weatherJSON;
}

//returns object containing data of the current day.
function getCurrentWeather(weather) {
  const currentWeather = weather.currentConditions;

  return {
    temp: currentWeather.temp,
    conditions: currentWeather.conditions,
    icon: currentWeather.icon,
    dateTime: currentWeather.datetime,
    humidity: currentWeather.humidity,
    precip: currentWeather.precip,
    windspeed: currentWeather.windspeed,
    uvIndex: currentWeather.uvindex,
    sunset: currentWeather.sunset,
    sunrise: currentWeather.sunrise,
  };
}

//returns an array containing the objects of data for 7-day weather
function getWeekWeather(weather) {
  let weekWeather = [];
  for (let i = 0; i < 7; i++) {
    let dayWeather = weather.days[i];
    weekWeather[i] = {
      temp: dayWeather.temp,
      conditions: dayWeather.conditions,
      icon: dayWeather.icon,
    };
  }

  return weekWeather;
}

async function createTopMain(address, currentWeather) {
  // const content = document.querySelector(".content");
  const main = document.querySelector(".main");

  const location = main.querySelector(".location-header");
  const icon = main.querySelector(".current-icon");
  const temp = main.querySelector(".current-temp");
  const conditions = main.querySelector(".current-conditions");
  const currentDay = main.querySelector(".current-day");
  const currentHour = main.querySelector(".current-hour");
  const humidity = main.querySelector(".humidity");
  const precip = main.querySelector(".precipitation");
  const windspeed = main.querySelector(".windspeed");
  const uvIndex = main.querySelector(".uv-index");
  const sunrise = main.querySelector(".sunrise");
  const sunset = main.querySelector(".sunset");

  location.textContent = address;
  setIcon(icon, currentWeather.icon);
  temp.textContent = currentWeather.temp + tempUnit;
  conditions.textContent = currentWeather.conditions;
  currentDay.textContent = getNameOfToday();
  currentHour.textContent = formatTimeRounded(currentWeather.dateTime);
  humidity.textContent = currentWeather.humidity + "%";
  precip.textContent = currentWeather.precip + "%";
  windspeed.textContent = currentWeather.windspeed + speedUnit;
  uvIndex.textContent = currentWeather.uvIndex;
  sunrise.textContent = formatTime(currentWeather.sunrise);
  sunset.textContent = formatTime(currentWeather.sunset);
}

function createBottomMain(weekWeather) {
  const mainBottom = document.querySelector(".main__bottom");

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

  const temp = document.createElement("div");
  temp.classList.add("temp");

  const conditions = document.createElement("div");
  conditions.classList.add("conditions");

  day.textContent = getNameOfDay(dayWeather.dateTime);
  setIcon(icon, dayWeather.icon);
  temp.textContent = dayWeather.temp;
  conditions.textContent = dayWeather.conditions;
  card.append(day, icon, temp, conditions);
  return card;
}

async function setIcon(icon, iconName) {
  const module = await import(`../images/${iconName}.svg`)
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
  return Number(result.toFixed(1));
}

//°F
function celsiusToFarenheit(temp) {
  const result = (temp * 9) / 5 + 32;
  return Number(result.toFixed(1));
}

// function swapMeasurementSystem() {

// }
