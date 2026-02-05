// index.js
import "./styles.css";
import "./reset.css";
import clearDayIcon from "../images/clear-day.svg";

//simulated weather data objects to prevent too many API calls being made while testing:
const address = "Oceanside";  
const currentWeather = {
  temp: 70,
  conditions: "Clear",
  icon: "clear-day",
  humidity: 79.5,
  precip: 0,
  windspeed: 3,
  uvIndex: 0,
  sunset: "06:42:38",
  sunrise: "17:24:15",
};

const weekWeather = [
  {temp: 70, conditions: "Clear", icon: "clear-day",},
  {temp: 59, conditions: "Cloudy", icon: "cloudy",},
  {temp: 65, conditions: "Rain", icon: "rain",},
  {temp: 81, conditions: "Clear", icon: "clear",},
  {temp: 65, conditions: "Partially Cloudy", icon: "partly-cloudy-day",},
  {temp: 72, conditions: "Partially Cloudy", icon: "partly-cloudy-night",},
  {temp: 73, conditions: "Foggy", icon: "fog",},
]

// const locationForm = document.querySelector(".search-form");
// locationForm.addEventListener("submit", (e)=> {
//   e.preventDefault();
//   let location = locationForm.querySelector("#search-input").value;
//   console.log(location);
//   locationForm.reset();

  fetchWeather("Oceanside").then(weather => {
    const address = weather.address;
    const currWeather = getCurrentWeather(weather);
    const weekWeather = getWeekWeather(weather);
    console.log(address, weather, currWeather, weekWeather);
  }).catch(err => {
    console.error(err);
  });

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
  const content = document.querySelector(".content");

  const main = document.createElement("main");
  main.classList.add("main");

  const mainTop = document.createElement("div");
  mainTop.classList.add("main__top");

  const mainTopLeft = document.createElement("div");
  mainTopLeft.classList.add("main__top-left");

  const locationHeader = document.createElement("h1");
  locationHeader.classList.add("location-header");
  locationHeader.textContent = address;

  const icon = document.createElement("img");
  icon.classList.add("current-icon");
  icon.src = clearDayIcon;

  const temp = document.createElement("div");
  temp.classList.add("current-temp");
  temp.textContent = currentWeather.temp;

  const condition = document.createElement("div");
  condition.classList.add("current-condition");
  condition.textContent = currentWeather.conditions;

  content.append(main);
  main.append(mainTop);
  mainTop.append(mainTopLeft);
  mainTopLeft.append(locationHeader, icon, temp, condition);
}
