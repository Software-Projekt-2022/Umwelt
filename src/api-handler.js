
let weather = {
    int: displayTime = 0,
    int: pollenDay=0,
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
            document.querySelector(".date").innerText = "Am " + time.slice(0,9);
            document.querySelector(".dt").innerText = "Um " + time.slice(10, 19) +" Uhr";
            document.querySelector(".temperatur").innerText ="Temperatur: " + temp + " °C";
            document.querySelector(".feels_like").innerText = "Gefühlt: " + feels_like + " °C";
            document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon +".png";
            document.querySelector(".description").innerText = description;
            document.querySelector(".uvi").innerText = "UV Index: "+ uvi;
            document.querySelector(".humidity").innerText = "Luftfeuchtigkeit: " + humidity + "%";
            document.querySelector(".wind").innerText = "Windgeschwindigkeit: " + wind_speed + "kmh";
        }else{
            var {icon, description} = data.current.weather[0];
            var {dt, temp, humidity, wind_speed, uvi, feels_like} = data.current;
            milliseconds = dt * 1000
            var date = new Date(milliseconds);
            var time=date.toLocaleString("de-DE", {timeZoneName: "short"})
            document.querySelector(".date").innerText = "Am " + time.slice(0,9);
            document.querySelector(".dt").innerText = "Um " + time.slice(10, 19) +" Uhr";
            document.querySelector(".temperatur").innerText ="Temperatur: " + temp + " °C";
            document.querySelector(".feels_like").innerText = "Gefühlt: " + feels_like + " °C";
            document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon +".png";
            document.querySelector(".description").innerText = description;
            document.querySelector(".uvi").innerText = "UV Index: "+ uvi;
            document.querySelector(".humidity").innerText = "Luftfeuchtigkeit: " + humidity + "%";
            document.querySelector(".wind").innerText = "Windgeschwindigkeit: " + wind_speed + "kmh";
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

document.getElementById("previousPollen").addEventListener("click", function(){
    pollen.previousPollen();
});

document.getElementById("nextPollen").addEventListener("click",function(){
    pollen.nextPollen();
});

weather.fetchWeather();
pollen.fetchPollen();
River.fetchRiver();
