// index.js
import "./styles.css";
import "./reset.css";
import clearDayIcon from "../images/clear-day.svg";
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
  { temp: 81, conditions: "Clear", icon: "clear", dateTime: "2026-02-07" },
  {
    temp: 65,
    conditions: "Partially Cloudy",
    icon: "partly-cloudy-day",
    dateTime: "2026-02-08",
  },
  {
    temp: 72,
    conditions: "Partially Cloudy",
    icon: "partly-cloudy-night",
    dateTime: "2026-02-09",
  },
  { temp: 73, conditions: "Foggy", icon: "fog", dateTime: "2026-02-10" },
];

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

createMain("Oceanside", currentWeather, weekWeather);

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

function createMain(address, currentWeather, weekWeather) {
  
  // const content = document.querySelector(".content");

  const main = document.querySelector(".main");
  const location = main.querySelector(".location-header");
  const icon = main.querySelector(".current-icon");
  const temp = main.querySelector(".current-temp");
  const condition = main.querySelector(".current-condition");
  const currentDay = main.querySelector(".current-day");
  const currentHour = main.querySelector(".current-hour");

  location.textContent = address;
  icon.src = clearDayIcon;
  temp.textContent = currentWeather.temp + "°F";
  condition.textContent = currentWeather.conditions;
  currentDay.textContent = getCurrentDayName();
  currentHour.textContent = formatTime(currentWeather.dateTime);

  // const mainTop = document.createElement("div");
  // mainTop.classList.add("main__top");

  // const mainTopLeft = document.createElement("div");
  // mainTopLeft.classList.add("main__top-left");

  // const locationHeader = document.createElement("h1");
  // locationHeader.classList.add("location-header");
  // locationHeader.textContent = address;

  // const icon = document.createElement("img");
  // icon.classList.add("current-icon");
  // icon.src = clearDayIcon;

  // const temp = document.createElement("div");
  // temp.classList.add("current-temp");
  // temp.textContent = currentWeather.temp + "°F";

  // const condition = document.createElement("div");
  // condition.classList.add("current-condition");
  // condition.textContent = currentWeather.conditions;

  // const currentDay = document.createElement("div");
  // currentDay.classList.add("current-day");
  // currentDay.textContent = getCurrentDayName();

  // const currentHour = document.createElement("div");
  // currentHour.classList.add("current-hour");
  // currentHour.textContent = formatTime(currentWeather.dateTime);

  // content.append(main);
  // main.append(mainTop);
  // mainTop.append(mainTopLeft);
  // mainTopLeft.append(
  //   locationHeader, 
  //   icon, 
  //   temp, 
  //   condition, 
  //   currentDay, 
  //   currentHour);

  console.log(farenheitToCelsius(42) + "°C");
  console.log(celsiusToFarenheit(farenheitToCelsius(42)) + "°F");
}

function getCurrentDayName() {
  return format(new Date(), "EEEE");
}

function formatTime(time) {
  //Create Date object given string. HH: 24 hour time, mm: minutes, ss: seconds
  const date = parse(time, "HH:mm:ss", new Date());
  const rounded = startOfHour(date); //round down to start of hour
  const formatted = format(rounded, "h:mm a"); //h: 12 hour time, mm: minutes  a: AM/PM
  return formatted;
}

//°C
function farenheitToCelsius(temp){
  const result = (temp - 32) * 5 / 9;
  return Number(result.toFixed(1));
}

//°F
function celsiusToFarenheit(temp){
  const result = (temp * 9 / 5) + 32;
  return Number(result.toFixed(1));
}