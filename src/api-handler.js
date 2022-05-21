
let weather = {
    int: displayTime = 0,
    int: displayDay = 0,
    int: pollenDay=0,
    int: lat=52.289,
    int: lon=8.91,
    var: airText="",
    json: currentAir=null,
    json: currentWeather=null,
    json: dailyWeather=null,
    json: currentPollen=null,
    json: currentRiver=null,
    "apiKey": "60918bc5fea5594f5317de56f954851c",

    fetchAir: function(){

        fetch(
            "http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=52.28&lon=8.91&appid=60918bc5fea5594f5317de56f954851c"
        )
            .then((response) => response.json())
            .then(data => currentAir = data)
           // .then((currentAir) => this.displayAir(currentAir))
            
    },
    /*
    displayAir: function(data){
        console.log(data);
    },*/

    fetchWeather: function() {

        fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat=52.28953&lon=8.91455&exclude=minutely&appid="+this.apiKey+"&units=metric&lang=de"
        )
            .then((response) => response.json())
            .then(data => currentWeather = data)
            .then((currentWeather) => this.displayWeather(currentWeather))
    },
    
    displayWeather: function(data){
        var weekday=new Array(7);
        weekday[0]="Montag";
        weekday[1]="Dienstag";
        weekday[2]="Mittwoch";
        weekday[3]="Donnerstag";
        weekday[4]="Freitag";
        weekday[5]="Samstag";
        weekday[6]="Sonntag";

        if(displayTime!=0){
            console.log(data);
            console.log(currentAir.list[0].main);
            var {icon, description} = data.hourly[displayTime].weather[0];
            var {dt, temp, humidity, wind_speed, uvi, feels_like} = data.hourly[displayTime];
            var airQuality = currentAir.list[displayTime].main.aqi;
            this.airQualityText(airQuality);
            milliseconds = dt * 1000
            var date = new Date(milliseconds);
            var time=date.toLocaleString("de-DE", {timeZoneName: "short"})
            document.querySelector(".date").innerText = "Am " + time.slice(0,9);
            document.querySelector(".dt").innerText = "Um " + time.slice(10, 19) +" Uhr";
            document.querySelector(".temperaturNow").innerText ="Temperatur: " + temp + " °C";
            document.querySelector(".feels_like").innerText = "Gefühlt: " + feels_like + " °C";
            document.querySelector(".Nachts").innerText = "Nachts: "+data.daily[date.getDay()].temp.night + "°C";
            document.querySelector(".iconNow").src = "https://openweathermap.org/img/wn/" + icon +".png";
            document.querySelector(".description").innerText = description;
            document.querySelector(".uvi").innerText = "UV Index: "+ uvi;
            document.querySelector(".humidity").innerText = "Luftfeuchtigkeit: " + humidity + "%";
            document.querySelector(".wind").innerText = "Windgeschwindigkeit: " + wind_speed + "kmh";
            document.querySelector(".air-quality").innerText = "Luftqualität:"+ airQuality + "("+this.airText+")";
        }else{
            var {icon, description} = data.current.weather[0];
            var {dt, temp, humidity, wind_speed, uvi, feels_like} = data.current;
            var airQuality = currentAir.list[0].main.aqi;
            this.airQualityText(airQuality);
            milliseconds = dt * 1000
            var date = new Date(milliseconds);
            var time=date.toLocaleString("de-DE", {timeZoneName: "short"})
            document.querySelector(".date").innerText = "Am " + time.slice(0,9);
            document.querySelector(".dt").innerText = "Um " + time.slice(10, 19) +" Uhr";
            document.querySelector(".temperaturNow").innerText ="Temperatur: " + temp + " °C";
            document.querySelector(".feels_like").innerText = "Gefühlt: " + feels_like + " °C";
            document.querySelector(".Nachts").innerText = "Nachts: "+data.daily[0].temp.night + "°C";
            document.querySelector(".iconNow").src = "https://openweathermap.org/img/wn/" + icon +".png";
            document.querySelector(".description").innerText = description;
            document.querySelector(".uvi").innerText = "UV Index: "+ uvi;
            document.querySelector(".humidity").innerText = "Luftfeuchtigkeit: " + humidity + "%";
            document.querySelector(".wind").innerText = "Windgeschwindigkeit: " + wind_speed + "kmh";
            document.querySelector(".air-quality").innerText = "Luftqualität:"+ airQuality + "("+this.airText+")";
        }

        var dtDay = data.daily[displayDay].dt;
        millisecondsDay = dtDay * 1000;
        var day = new Date(millisecondsDay);
        var dateDay=day.toLocaleString("de-DE", {timeZoneName: "short"})
        
        document.getElementById("dayWeather").innerText = weekday[date.getDay() + displayDay] + ", der "+dateDay.slice(0,9);
        document.querySelector(".daysMorning").innerText ="Morgens:\n"+ data.daily[displayDay].temp.morn + "°C";
        document.querySelector(".daysDay").innerText ="Tagsüber:\n" + data.daily[displayDay].temp.day + "°C";
        document.querySelector(".daysEve").innerText ="Abends:\n"+ data.daily[displayDay].temp.eve + "°C";
        document.querySelector(".daysNight").innerText = "Nachts:\n"+data.daily[displayDay].temp.night + "°C";

        var dtWeek = data.daily[0].dt;
        millisecondsWeek = dtWeek * 1000;
        var date = new Date(millisecondsWeek);

        document.querySelector(".day1Name").innerText = weekday[date.getDay()+1];
        document.querySelector(".day1Temp").innerText = data.daily[2].temp.day + "C";
        document.querySelector(".day1TempNight").innerText = data.daily[2].temp.night + "C";
        document.querySelector(".iconDay1").src = "https://openweathermap.org/img/wn/" + data.daily[2].weather[0].icon +".png";

        document.querySelector(".day2Name").innerText = weekday[date.getDay()+2];
        document.querySelector(".day2Temp").innerText = data.daily[3].temp.day + "C";
        document.querySelector(".day2TempNight").innerText = data.daily[3].temp.night + "C";
        document.querySelector(".iconDay2").src = "https://openweathermap.org/img/wn/" + data.daily[3].weather[0].icon +".png";

        document.querySelector(".day3Name").innerText = weekday[date.getDay()+3];
        document.querySelector(".day3Temp").innerText = data.daily[4].temp.day + "C";
        document.querySelector(".day3TempNight").innerText = data.daily[4].temp.night + "C";
        document.querySelector(".iconDay3").src = "https://openweathermap.org/img/wn/" + data.daily[4].weather[0].icon +".png";

        document.querySelector(".day4Name").innerText = weekday[date.getDay()+4];
        document.querySelector(".day4Temp").innerText = data.daily[5].temp.day + "C";
        document.querySelector(".day4TempNight").innerText = data.daily[5].temp.night + "C";
        document.querySelector(".iconDay4").src = "https://openweathermap.org/img/wn/" + data.daily[5].weather[0].icon +".png";

        document.querySelector(".day5Name").innerText = weekday[date.getDay()-2];
        document.querySelector(".day5Temp").innerText = data.daily[6].temp.day + "C";
        document.querySelector(".day5TempNight").innerText = data.daily[6].temp.night + "C";
        document.querySelector(".iconDay5").src = "https://openweathermap.org/img/wn/" + data.daily[6].weather[0].icon +".png";
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
    },

    previousWeek: function() {
            displayDay=0;
        
        weather.displayWeather(currentWeather)
    },
    nextWeek: function() {
            displayDay=1;
        
        weather.fetchWeather(currentWeather)
    },

    airQualityText: function(quality){
        switch(quality){
            case 1:
                this.airText="Ausgezeichnet"
                break;
            case 2:
                this.airText="Gut"
                break;
            case 3:
                this.airText="Akzeptabel"
                break;
            case 4:
                this.airText="schlecht"
                break;
            case 5:
                this.airText="sehr schlecht"
                break;
        }
    },
};

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
        console.log(Pollen)
        if(pollenDay==0){
            document.querySelector(".Day").innerText="Heute";
            document.querySelector(".Ambrosia").innerText="Ambrosia: "+Pollen[0].today.description;
            document.querySelector(".Beifuss").innerText="Beifuss: "+Pollen[1].today.description;
            document.querySelector(".Birke").innerText="Birke: "+Pollen[2].today.description;
            document.querySelector(".Erle").innerText="Erle: "+Pollen[3].today.description;
            document.querySelector(".Esche").innerText="Esche: "+Pollen[4].today.description;
            document.querySelector(".Gräser").innerText="Gräser: "+Pollen[5].today.description;
            document.querySelector(".Hasel").innerText="Hasel: "+Pollen[6].today.description;
            document.querySelector(".Roggen").innerText="Roggen: "+Pollen[7].today.description;
        }
        if(pollenDay==1){
            document.querySelector(".Day").innerText="Morgen";
            document.querySelector(".Ambrosia").innerText="Ambrosia: "+Pollen[0].tomorrow.description;
            document.querySelector(".Beifuss").innerText="Beifuss: "+Pollen[1].tomorrow.description;
            document.querySelector(".Birke").innerText="Birke: "+Pollen[2].tomorrow.description;
            document.querySelector(".Erle").innerText="Erle: "+Pollen[3].tomorrow.description;
            document.querySelector(".Esche").innerText="Esche: "+Pollen[4].tomorrow.description;
            document.querySelector(".Gräser").innerText="Gräser: "+Pollen[5].tomorrow.description;
            document.querySelector(".Hasel").innerText="Hasel: "+Pollen[6].tomorrow.description;
            document.querySelector(".Roggen").innerText="Roggen: "+Pollen[7].tomorrow.description;
        }
    },

    nextPollen: function() {
        if(pollenDay<3){
            pollenDay++;
        }
        pollen.fetchPollen(currentPollen)
    },

    previousPollen: function() {
        if(pollenDay>0){
            pollenDay--;
        }
        pollen.fetchPollen(currentPollen)
    }
}

let River= {
    fetchRiver: function(){
        fetch("https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/VLOTHO/W/measurements.json?start=P15D")
    .then((response) => response.json())
    .then(data => currentRiver = data)
    .then((currentRiver) => this.displayRiver(currentRiver))
    },

    displayRiver: function(data) {
        console.log(data);
        var date=new Date();
        var lastDays=[3];
        switch(date.getDay()){
            case 0:
                lastDays[0]="Sa";
                lastDays[1]="Fr";
                lastDays[2]="Do";
                break;
            case 1:
                lastDays[0]="So";
                lastDays[1]="Sa";
                lastDays[2]="Fr";
                break;
            case 2:
                lastDays[0]="Mo";
                lastDays[1]="So";
                lastDays[2]="Sa";
                break;
            case 3:
                lastDays[0]="Di";
                lastDays[1]="Mo";
                lastDays[2]="So";
                break;
            case 4:
                lastDays[0]="Mi";
                lastDays[1]="Di";
                lastDays[2]="Mo";
                break;
            case 5:
                lastDays[0]="Do";
                lastDays[1]="Mi";
                lastDays[2]="Di";
                break;
            case 6:
                lastDays[0]="Fr";
                lastDays[1]="Do";
                lastDays[2]="Mi";
                break;
        }


        document.querySelector(".water_level").innerText = "Aktueller Wasserstand: "+data[data.length-1].value+" cm";
        document.querySelector(".last_hours").innerText = 
        data[data.length-13].timestamp.slice(11,16)+" Uhr: " +data[data.length-13].value+" cm  |  " +
        data[data.length-9].timestamp.slice(11,16)+" Uhr: " +data[data.length-9].value+" cm   |  " +
        data[data.length-5].timestamp.slice(11,16)+" Uhr: " +data[data.length-5].value+" cm";
        document.querySelector(".last_days").innerText = 
        lastDays[0]+": "+data[data.length-97].value + " cm  |  " + 
        lastDays[1]+": "+data[data.length-193].value + " cm  |  " +
        lastDays[2]+": "+data[data.length-289].value + " cm";
        document.querySelector(".last_weeks").innerText = 
        "Vor einer Woche: " +data[data.length-673].value + " cm  |  " +
        "Vor zwei Wochen: " + data[data.length-1345].value + " cm";
    }
};

document.getElementById("previous").addEventListener("click", function(){
    console.log("previous");
    weather.previous();
});

document.getElementById("next").addEventListener("click",function(){
    weather.next();
});

document.getElementById("previousWeek").addEventListener("click", function(){
    weather.previousWeek();
});

document.getElementById("nextWeek").addEventListener("click",function(){
    weather.nextWeek();
});

document.getElementById("previousPollen").addEventListener("click", function(){
    pollen.previousPollen();
});

document.getElementById("nextPollen").addEventListener("click",function(){
    pollen.nextPollen();
});

weather.fetchAir();
weather.fetchWeather();
pollen.fetchPollen();
River.fetchRiver();
