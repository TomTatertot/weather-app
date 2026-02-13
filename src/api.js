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

//gets the readable region names using longitude and latitude
async function fetchAddress(lat, lon) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=4&appid=b80e80f2e3764460d2b1eb8f60a59cf2`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const locationJSON = await response.json();

  return locationJSON;
}

//ask user for current location
function getGeolocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    let location = `${position.coords.latitude}, ${position.coords.longitude}`;
    return location;
  });
}

export { fetchWeather, fetchAddress, getGeolocation};
