
const { response } = require("express");
const fetch = require("node-fetch");
var apiKey = "e0061af8aed641bc2d516594bff85d3b";
var lat = 52.28;
var lon = 8.91;
var currentAir = null;
var currentWeather = null;
var currentHistory = null;
var currentPollen = null;
var currentRiver = null;

/**
 * Fetches Airdata from openweathermap
 */

exports.fetchAir=async function() {
    return fetch(
        "https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=52.28&lon=8.91&appid=" + apiKey
    )
    .then((response)=>response.json())
    .then(data => currentAir = data)
    .then((responseJson)=>{return responseJson})
}

/**
 * Fetches weatherdata from openweathermap
 */
exports.fetchWeather= async function() {
    return fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=52.28953&lon=8.91455&exclude=minutely&appid=" + apiKey + "&units=metric&lang=de"
    )
    .then((response)=>response.json())
    .then(data => currentWeather = data)
    .then((responseJson)=>{return responseJson})
}

/**
 * Fetches historical weatherdata of the last 5 days from openweathermap
 * 
 */

exports.fetchHistoricalWeather=async function() {

    var day5, day4, day3, day2, day1;
    day5 = new Date();
    day4 = new Date();
    day3 = new Date();
    day2 = new Date();
    day1 = new Date();

    day5.setDate(day5.getDate() - 5);
    day5 = (day5.getTime() / 1000).toFixed(0);

    day4.setDate(day4.getDate() - 4);
    day4 = (day4.getTime() / 1000).toFixed(0);

    day3.setDate(day3.getDate() - 3);
    day3 = (day3.getTime() / 1000).toFixed(0);

    day2.setDate(day2.getDate() - 2);
    day2 = (day2.getTime() / 1000).toFixed(0);

    day1.setDate(day1.getDate() - 1);
    day1 = (day1.getTime() / 1000).toFixed(0);

    return Promise.all([
        fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + day5 + "&appid=" + apiKey + "&units=metric&lang=de").then(value => value.json()),
        fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + day4 + "&appid=" + apiKey + "&units=metric&lang=de").then(value => value.json()),
        fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + day3 + "&appid=" + apiKey + "&units=metric&lang=de").then(value => value.json()),
        fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + day2 + "&appid=" + apiKey + "&units=metric&lang=de").then(value => value.json()),
        fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + day1 + "&appid=" + apiKey + "&units=metric&lang=de").then(value => value.json()),
    ])
        .then((value) => {
            currentHistory = value;
            return currentHistory;
        })
        .catch(error => console.log(error));
}


/**
 * fetches pollendata for Ostwestfalen
 */
exports.fetchPollen=async function() {
    return fetch("https://api.achoo.dev/pollen/subregion/Ostwestfalen")
    .then((response)=>response.json())
    .then(data => currentPollen = data)
    .then((responseJson)=>{return responseJson})
}

/**
* Fetches water level from pegelonline
*/
exports.fetchRiver=async function() {
    return fetch("https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/VLOTHO/W/measurements.json?start=P15D")
    .then((response)=>response.json())
    .then(data => currentRiver = data)
    .then((responseJson)=>{return responseJson})
}

exports.getWeatherData = function() {
    return currentWeather;
}

exports.getAirData = function() {
     return currentAir;
}

exports.getHistoryData = function() {
     return currentHistory;
}
 
exports.getPollenData = function() {
    return currentPollen;
}

exports.getRiverData = function() {
    return currentRiver;
}
