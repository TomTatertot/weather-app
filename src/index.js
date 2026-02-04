// index.js
import "./styles.css";
import "./reset.css";

const locationForm = document.querySelector(".location-form");
locationForm.addEventListener("submit", (e)=> {
  e.preventDefault();

  let location = locationForm.querySelector("#location").value;
  console.log(location);
  locationForm.reset();

  fetchWeather(location).then(weather => {
    console.log(getCurrentWeather(weather));
    console.log(getWeekWeather(weather));
  }).catch(err => {
    console.error(err);
  });
  
})

async function fetchWeather(location){
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=K3G2LWP2CFRKQBQBG9G32U75K`
  const response = await fetch(url);
  if (!response.ok){
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const weatherJSON = await response.json();
  return weatherJSON;
}

//returns object containing data of the current day.
function getCurrentWeather(weather){
  const currentWeather = weather.currentConditions;

  return {
    temp: currentWeather.temp,
    conditions: currentWeather.conditions,
    humidity: currentWeather.humidity,
    precip: currentWeather.precip,
    windspeed: currentWeather.windspeed,
    uvIndex: currentWeather.uvindex,
    sunset: currentWeather.sunset,
    sunrise: currentWeather.sunrise,
  }
}

//returns an array containing the objects of data for 7-day weather
function getWeekWeather(weather) {
  let weekData = [];
  for (let i = 0; i < 7; i++) {
    let dayData = weather.days[i];
    weekData[i] = {temp: dayData.temp, conditions: dayData.conditions};
  }

  return weekData;
}
