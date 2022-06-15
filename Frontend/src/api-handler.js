
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
    /**
     * Fetches Airdata from openweathermap
     */
    fetchAir: function(){

        fetch(
            "http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=52.28&lon=8.91&appid=60918bc5fea5594f5317de56f954851c"
        )
            .then((response) => response.json())
            .then(data => currentAir = data)
            
    },

    /**
     * Fetches weatherdata from openweathermap
     */
    fetchWeather: function() {

        fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat=52.28953&lon=8.91455&exclude=minutely&appid="+this.apiKey+"&units=metric&lang=de"
        )
            .then((response) => response.json())
            .then(data => currentWeather = data)
            .then((currentWeather) => this.displayWeather(currentWeather))
    },
    
    /**
     * Fills the complete "Wetter in Cybercity" section with data
     * @param {JSON} data 
     */
    displayWeather: function(data){
        var weekday=new Array(14);
        weekday[0]="Sonntag";
        weekday[1]="Montag";
        weekday[2]="Dienstag";
        weekday[3]="Mittwoch";
        weekday[4]="Donnerstag";
        weekday[5]="Freitag";
        weekday[6]="Samstag";
        weekday[7]="Sonntag";
        weekday[8]="Montag";
        weekday[9]="Dienstag";
        weekday[10]="Mittwoch";
        weekday[11]="Donnerstag";
        weekday[12]="Freitag";
        weekday[13]="Samstag";

        /**
         * Displays the detailed weather and air data at a certain time depending on displayTime in a range of right now to +48 Hours  
         */
        if(displayTime!=0){
            console.log(data);
            console.log(currentAir.list[0].main);
            var {icon, description} = data.hourly[displayTime].weather[0];
            var {dt, temp, humidity, wind_speed, uvi, feels_like} = data.hourly[displayTime];
            var airQuality = currentAir.list[displayTime].main.aqi;
            var wind_speedKMH = wind_speed * 3.6;
            this.airQualityText(airQuality);
            milliseconds = dt * 1000
            var date = new Date(milliseconds);
            var time=date.toLocaleString("de-DE", {timeZoneName: "short"})
            timeSplit= time.split(" ");
            document.querySelector(".date").innerText = "Am " + timeSplit[0];
            document.querySelector(".dt").innerText = "Um " + timeSplit[1] +" Uhr";
            document.querySelector(".temperaturNow").innerText ="Temperatur: " + temp.toFixed(1) + " °C";
            document.querySelector(".feels_like").innerText = "Gefühlt: " + feels_like + " °C";
            document.querySelector(".Nachts").innerText = "Nachts: "+data.daily[date.getDay()].temp.night + "°C";
            document.querySelector(".iconNow").src = "https://openweathermap.org/img/wn/" + icon +".png";
            document.querySelector(".description").innerText = description;
            document.querySelector(".uvi").innerText = "UV Index: "+ uvi;
            document.querySelector(".humidity").innerText = "Luftfeuchtigkeit: " + humidity + "%";
            if(wind_speedKMH<10){
                document.querySelector(".wind").innerText = "Windgeschwindigkeit: "+wind_speedKMH.toFixed(1)+" Km/h\u00A0\u00A0";
            }else{
                document.querySelector(".wind").innerText = "Windgeschwindigkeit: " + wind_speedKMH.toFixed(1) + " Km/h";
            }
            document.querySelector(".air-quality").innerText = "";
            document.querySelector(".air-qualityText").innerText = "Luftqualität: "+ airQuality +"("+this.airText+")";
        }else{
            var {icon, description} = data.current.weather[0];
            var {dt, temp, humidity, wind_speed, uvi, feels_like} = data.current;
            var airQuality = currentAir.list[0].main.aqi;
            var wind_speedKMH = wind_speed * 3.6;
            this.airQualityText(airQuality);
            milliseconds = dt * 1000
            var date = new Date(milliseconds);
            var time=date.toLocaleString("de-DE", {timeZoneName: "short"})
            timeSplit= time.split(" ");
            document.querySelector(".date").innerText = "Am " + timeSplit[0];
            document.querySelector(".dt").innerText = "Um " + timeSplit[1] +" Uhr";
            document.querySelector(".temperaturNow").innerText ="Temperatur: " + temp.toFixed(1) + " °C";
            document.querySelector(".feels_like").innerText = "Gefühlt: " + feels_like.toFixed(1) + " °C";
            document.querySelector(".Nachts").innerText = "Nachts: "+data.daily[0].temp.night.toFixed(1) + "°C";
            document.querySelector(".iconNow").src = "https://openweathermap.org/img/wn/" + icon +".png";
            document.querySelector(".description").innerText = description;
            document.querySelector(".uvi").innerText = "UV Index: "+ uvi.toFixed(2);
            document.querySelector(".humidity").innerText = "Luftfeuchtigkeit: " + humidity + "%";
            if(wind_speedKMH<10){
                document.querySelector(".wind").innerText = "Windgeschwindigkeit: "+wind_speedKMH.toFixed(1)+" Km/h\u00A0\u00A0";
            }else{
                document.querySelector(".wind").innerText = "Windgeschwindigkeit: " + wind_speedKMH.toFixed(1) + " Km/h";
            }
            document.querySelector(".air-quality").innerText = "";
            document.querySelector(".air-qualityText").innerText = "Luftqualität: "+ airQuality +"("+this.airText+")";
        }

        /**
         * displays the temperature for each day(morning, day, evening and night) in a range from tomorrow to +6 days 
         */
        if(displayDay==0){
            var dtDay = data.current.dt;
            millisecondsDay = dtDay * 1000;
            var day = new Date(millisecondsDay);
            day.setDate(day.getDate()+1);
            var dateDay=day.toLocaleString("de-DE", {timeZoneName: "short"})
            datenb = dateDay.split(",");

            document.getElementById("dayWeather").innerText = weekday[day.getDay()] + ", der "+datenb[0];
            document.querySelector(".daysMorning").innerText ="Morgens:\n"+ data.daily[1].temp.morn.toFixed(1) + "°C";
            document.querySelector(".daysDay").innerText ="Tagsüber:\n" + data.daily[1].temp.day.toFixed(1) + "°C";
            document.querySelector(".daysEve").innerText ="Abends:\n"+ data.daily[1].temp.eve.toFixed(1) + "°C";
            document.querySelector(".daysNight").innerText = "Nachts:\n"+data.daily[1].temp.night.toFixed(1) + "°C";
        }else{
            var dtDay = data.current.dt;
            millisecondsDay = dtDay * 1000;
            var day = new Date(millisecondsDay);
            day.setDate(day.getDate()+displayDay+1);
            var dateDay=day.toLocaleString("de-DE", {timeZoneName: "short"})
            datenb = dateDay.split(",");

            document.getElementById("dayWeather").innerText = weekday[day.getDay()] + ", der "+datenb[0];
            document.querySelector(".daysMorning").innerText ="Morgens:\n"+ data.daily[displayDay+1].temp.morn.toFixed(1) + "°C";
            document.querySelector(".daysDay").innerText ="Tagsüber:\n" + data.daily[displayDay+1].temp.day.toFixed(1) + "°C";
            document.querySelector(".daysEve").innerText ="Abends:\n"+ data.daily[displayDay+1].temp.eve.toFixed(1) + "°C";
            document.querySelector(".daysNight").innerText = "Nachts:\n"+data.daily[displayDay+1].temp.night.toFixed(1) + "°C";
        }

        /**
         * displayes the weather for the next 5 days 
         */
        var dtWeek = data.daily[0].dt;
        millisecondsWeek = dtWeek * 1000;
        var date = new Date(millisecondsWeek);

        document.querySelector(".day1Name").innerText = weekday[date.getDay()+1];
        document.querySelector(".day1Temp").innerText = data.daily[1].temp.day.toFixed(1) + "C";
        document.querySelector(".day1TempNight").innerText = data.daily[1].temp.night.toFixed(1) + "C";
        document.querySelector(".iconDay1").src = "https://openweathermap.org/img/wn/" + data.daily[1].weather[0].icon +".png";

        document.querySelector(".day2Name").innerText = weekday[date.getDay()+2];
        document.querySelector(".day2Temp").innerText = data.daily[2].temp.day.toFixed(1) + "C";
        document.querySelector(".day2TempNight").innerText = data.daily[2].temp.night.toFixed(1) + "C";
        document.querySelector(".iconDay2").src = "https://openweathermap.org/img/wn/" + data.daily[2].weather[0].icon +".png";

        document.querySelector(".day3Name").innerText = weekday[date.getDay()+3];
        document.querySelector(".day3Temp").innerText = data.daily[3].temp.day.toFixed(1) + "C";
        document.querySelector(".day3TempNight").innerText = data.daily[3].temp.night.toFixed(1) + "C";
        document.querySelector(".iconDay3").src = "https://openweathermap.org/img/wn/" + data.daily[3].weather[0].icon +".png";

        document.querySelector(".day4Name").innerText = weekday[date.getDay()+4];
        document.querySelector(".day4Temp").innerText = data.daily[4].temp.day.toFixed(1) + "C";
        document.querySelector(".day4TempNight").innerText = data.daily[4].temp.night.toFixed(1) + "C";
        document.querySelector(".iconDay4").src = "https://openweathermap.org/img/wn/" + data.daily[4].weather[0].icon +".png";

        document.querySelector(".day5Name").innerText = weekday[date.getDay()+5];
        document.querySelector(".day5Temp").innerText = data.daily[5].temp.day.toFixed(1) + "C";
        document.querySelector(".day5TempNight").innerText = data.daily[5].temp.night.toFixed(1) + "C";
        document.querySelector(".iconDay5").src = "https://openweathermap.org/img/wn/" + data.daily[5].weather[0].icon +".png";
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
            if(displayDay>0){
                displayDay--;
            }
        
        weather.displayWeather(currentWeather)
    },
    nextWeek: function() {
        if(displayDay<6){
            displayDay++;
        }
        weather.fetchWeather(currentWeather)
    },
    
    /**
     * turns the air quality int into text
     * @param {int} quality 
     */
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

    /**
     * evaluates the if the air is fine, sends event if not
     */
    airEvaluation: function(){
        for(var i=0; i<this.currentAir.list.length; i++){
            switch(currentAir.list[i].main.aqi){
                case 4:
                    //send event schlecht
                    break;
                case 5:
                    //send event sehr schlecht
                    break;
            }
        }
    },

    weatherEvaluation: function(){
        for(var i=0; i<this.currentWeather.hourly.length; i++){
            
            //Temperatur
            if(this.currentWeather.hourly[i].temp>=37){
                //send event zu hoch
            }
            if(this.currentWeather.hourly[i].temp<0){
                if(this.currentWeather.hourly[i].temp<-3){
                    if(this.currentWeather.hourly[i].temp<-10){
                        //send event gefährlich tief
                    }else{
                        //send event definitiv frost
                    }
                    }else{
                //send event vielleicht frost
                }
            }

            //Windgeschwindigkeit
            if(this.currentWeather.hourly[i].wind_speed>17){
                if(this.currentWeather.hourly[i].wind_speed>20.7){
                    if(this.currentWeather.hourly[i].wind_speed>24.4){
                        if(this.currentWeather.hourly[i].wind_speed>28.4){
                            if(this.currentWeather.hourly[i].wind_speed>32.6){
                                //event orkan(12)
                            }else{
                                //event orkanartiger Sturm(11)
                            }
                        }else{
                            //event schwerer Sturm(10)
                        }
                    }else{
                        //event Sturm(9)
                    }
                }else{
                    //event stürmischer Wind(8)
                }
            }else{
                //event steifer Wind(7)
            }
            
            //Sonnenstrahlung
            if(this.currentWeather.hourly[i].uvi>=3&&this.currentWeather.hourly[i].uvi<8){
                this.document.querySelector(".Warnungh2").innerText = "Warnung: Sonnenstrahlung hoch";
                this.document.querySelector(".WarnungText").innerText = "Sonnenstrahlung ist zu hoch. Bitte verwenden Sie Sonnencreme wenn Sie das Haus verlassen.";
                //event sonnenstrahlung hoch
            }else if(this.currentWeather.hourly[i].uvi>=8){
                this.document.querySelector(".Warnungh2").innerText = "Warnung: Sonnenstrahlung Extrem";
                this.document.querySelector(".WarnungText").innerText = "Sonnenstrahlung ist zu extrem hoch. Sonnencreme allein reicht nicht um Sie ausgiebig zu schützen. Bitte meiden Sie die Sonne oder kleiden sich entsprechend.";
                //event sonnenstrahlung extrem
            }
        }
    }
};

let pollen = {

    /**
     * fetches pollendata for Ostwestfalen
     */
    fetchPollen: function(){
        fetch("https://api.achoo.dev/pollen/subregion/Ostwestfalen")
    .then((response) => response.json())
    .then(data => currentPollen = data)
    .then((currentPollen) => this.displayPollen(currentPollen))
    },

    /**
     * Fills the complete "Pollenflug in Cybercity" section with data
     * @param {JSON} data 
     */
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
        pollenDay=1;
        pollen.displayPollen(currentPollen)
    },

    previousPollen: function() {
        pollenDay=0;
        pollen.displayPollen(currentPollen)
    },

    pollenEvaluation: function() {
        for(i=0;i<currentPollen.pollen.length;i++){
            if(currentPollen.pollen[i].today.severity==2){
                //Use makeAirQualityEvent() to create an event
            }else{
                if(currentPollen.pollen[i].today.severity>2){
                    //Use makeAirQualityEvent() to create a severe pollen 
                }
            }
        }
    }
}

let River = {

    /**
     * Fetches water level from pegelonline
     */
    fetchRiver: function(){
        fetch("https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/VLOTHO/W/measurements.json?start=P15D")
    .then((response) => response.json())
    .then(data => currentRiver = data)
    .then((currentRiver) => this.displayRiver(currentRiver))
    },

    /**
     * Fills the complete "Wasserstand der Meser in CyberCity" section with data
     * @param {JSON} data 
     */
    displayRiver: function(data) {
        console.log(data);
        var date=new Date();
        var lastDays=[3];

        /**
         * Get last 3 days
         */
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


/**
 * Button listeners
 */
document.getElementById("previous").addEventListener("click", function(){
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
