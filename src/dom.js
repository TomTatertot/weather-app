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