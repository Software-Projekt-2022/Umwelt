let weather = {
    int: displayTime = 0,
    json: currentWeather=null,
    json: currentPollen=null,
    json: currentRiver=null,
    "apiKey": "60918bc5fea5594f5317de56f954851c",
    fetchWeather: function() {
        
        fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat=52.28953&lon=8.91455&exclude=minutely,daily&appid="+this.apiKey+"&units=metric&lang=de"
        )
            .then((response) => response.json())
            .then(data => currentWeather = data)
            .then((currentWeather) => this.displayWeather(currentWeather))
    },
    displayWeather: function(data){
        if(displayTime!=0){
            var {icon, description} = data.hourly[displayTime].weather[0];
            var {dt, temp, humidity, wind_speed, uvi, feels_like} = data.hourly[displayTime];
            milliseconds = dt * 1000
            var date = new Date(milliseconds);
            var time=date.toLocaleString("de-DE", {timeZoneName: "short"})
            document.querySelector(".Datum").innerText = "Am " + time.slice(0,9);
            document.querySelector(".DT").innerText = "Um " + time.slice(10, 19) +" Uhr";
            document.querySelector(".Temperatur").innerText ="Temperatur: " + temp + " °C";
            document.querySelector(".Gefühl").innerText = "Gefühlt: " + feels_like + " °C";
            document.querySelector(".Icon").src = "https://openweathermap.org/img/wn/" + icon +".png";
            document.querySelector(".Beschreibung").innerText = description;
            document.querySelector(".UVI").innerText = "UV Index: "+ uvi;
            document.querySelector(".Luftfeuchtigkeit").innerText = "Luftfeuchtigkeit: " + humidity + "%";
            document.querySelector(".Wind").innerText = "Windgeschwindigkeit: " + wind_speed + "kmh";
        }else{
            var {icon, description} = data.current.weather[0];
            var {dt, temp, humidity, wind_speed, uvi, feels_like} = data.current;
            milliseconds = dt * 1000
            var date = new Date(milliseconds);
            var time=date.toLocaleString("de-DE", {timeZoneName: "short"})
            document.querySelector(".Datum").innerText = "Am " + time.slice(0,9);
            document.querySelector(".DT").innerText = "Um " + time.slice(10, 19) +" Uhr";
            document.querySelector(".Temperatur").innerText ="Temperatur: " + temp + " °C";
            document.querySelector(".Gefühl").innerText = "Gefühlt: " + feels_like + " °C";
            document.querySelector(".Icon").src = "https://openweathermap.org/img/wn/" + icon +".png";
            document.querySelector(".Beschreibung").innerText = description;
            document.querySelector(".UVI").innerText = "UV Index: "+ uvi;
            document.querySelector(".Luftfeuchtigkeit").innerText = "Luftfeuchtigkeit: " + humidity + "%";
            document.querySelector(".Wind").innerText = "Windgeschwindigkeit: " + wind_speed + "kmh";
        }
    },
    previous: function() {
        if(displayTime>0){
            displayTime--;
        }else{
            displayTime=0;
        }
        weather.displayWeather(currentWeather)
    },
    next: function() {
        if(displayTime<47){
            displayTime++;
        }
        weather.fetchWeather(currentWeather)
    }
};


document.getElementById("previous").addEventListener("click", function(){
    console.log("previous");
    weather.previous();
});

document.getElementById("next").addEventListener("click",function(){
    weather.next();
});

let pollen = {

    fetchPollen: function(){
        fetch("https://api.achoo.dev/pollen/subregion/Ostwestfalen")
    .then((response) => response.json())
    .then(data => currentPollen = data)
    .then((currentPollen) => this.displayPollen(currentPollen))
    },

    displayPollen: function(data){
        var Pollen = [];
        Pollen = data.pollen;
        document.querySelector(".Ambrosia").innerText="Ambrosia: "+Pollen[0].today.description;
        document.querySelector(".Beifuss").innerText="Beifuss: "+Pollen[1].today.description;
        document.querySelector(".Birke").innerText="Birke: "+Pollen[2].today.description;
        document.querySelector(".Erle").innerText="Erle: "+Pollen[3].today.description;
        document.querySelector(".Esche").innerText="Esche: "+Pollen[4].today.description;
        document.querySelector(".Gräser").innerText="Gräser: "+Pollen[5].today.description;
        document.querySelector(".Hasel").innerText="Hasel: "+Pollen[6].today.description;
        document.querySelector(".Roggen").innerText="Roggen: "+Pollen[7].today.description;
    }
}

let River= {
    
}


weather.fetchWeather();
pollen.fetchPollen();