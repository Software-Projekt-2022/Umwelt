import fetch from 'node-fetch';

apikey = "e0061af8aed641bc2d516594bff85d3b"
lat = "52.28"
lon = "8.91"

function fetchAir(){
    return fetch("https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat="+this.lat+"&lon="+this.lon+"&appid="+this.apiKey)
    .then(response => response.json())
    .then(data => {
        return data;
    })
}