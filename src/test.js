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

export {address, currentWeather, weekWeather};