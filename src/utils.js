import { parse, format, startOfHour } from "date-fns";

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


export {
  getNameOfDay, 
  getNameOfToday, 
  formatTimeRounded, 
  formatTime, 
  farenheitToCelsius, 
  celsiusToFarenheit,
  kilometerToMiles, 
  milesToKilometer,
}
