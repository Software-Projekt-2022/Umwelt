let weather = {  
    int: displayTime = 0,
    int: displayDay = 0,
    int: displayWeek = 0,
    int: pollenDay=0,
    int: lat=52.289,
    int: lon=8.91,
    var: airText="",

    /**
     * Fetches JSON from server
     * @returns 
     */
    fetchJson: async url=> {
        const response = await fetch('/api/getAllData');
        return response.json();
    },
    
    /**
     * Fetches API data from server, splits it and calls displayDailyEvent if an event is in the JSON
     */
    getData: async function(){
        const data = await weather.fetchJson();
        currentAir = data.air;
        currentWeather = data.weather;
        currentPollen = data.pollen;
        currentRiver = data.river;
        historyWeather = data.historicalWeather;
        weather.displayWeather(data.weather);
        pollen.displayPollen(data.pollen);
        River.displayRiver(data.river);
        weather.evaluateData(data.warnings);
        if(data.events.content != null){
            dailyEvents.displayDailyEvent(data.events);
        }
    },

    /**
     * Fills the complete "Wetter in Cybercity" section with data
     * @param {JSON} data weatherdata from openweathermap
     */
    displayWeather: function(data){
        var weekday=new Array(14);
        weekday[0]="So";
        weekday[1]="Mo";
        weekday[2]="Di";
        weekday[3]="Mi";
        weekday[4]="Do";
        weekday[5]="Fr";
        weekday[6]="Sa";
        weekday[7]="So";
        weekday[8]="Mo";
        weekday[9]="Di";
        weekday[10]="Mi";
        weekday[11]="Do";
        weekday[12]="Fr";
        weekday[13]="Sa";

        
        /**
         * Displays the detailed weather and air data at a certain time depending on displayTime in a range of right now to +48 Hours  
         */
        if(displayTime!=0){
            var {icon, description} = data.hourly[displayTime].weather[0];
            var {dt, temp, humidity, wind_speed, uvi, feels_like} = data.hourly[displayTime];
            var airQuality = currentAir.list[displayTime].main.aqi;
            var wind_speedKMH = wind_speed * 3.6;
            var wind_gustKMH = data.hourly[displayTime].wind_gust * 3.6;
            this.airQualityText(airQuality);
            milliseconds = dt * 1000
            var date = new Date(milliseconds);
            var time=date.toLocaleString("de-DE", {timeZoneName: "short"});
            timeSplit= time.split(" ");
            document.querySelector(".date").innerText = "Am " + timeSplit[0];
            document.querySelector(".dt").innerText = "Um " + timeSplit[1] +" Uhr";
            document.querySelector(".temperaturNow").innerText ="Temperatur: " + temp.toFixed(1) + " °C";
            document.querySelector(".feels_like").innerText = "Gefühlt: " + feels_like.toFixed(1) + " °C";
            document.querySelector(".windGust").innerText = "Windböhen <= " + wind_gustKMH.toFixed(1) + " km/h";
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
            var wind_gustKMH = data.hourly[0].wind_gust * 3.6;
            this.airQualityText(airQuality);
            milliseconds = dt * 1000
            var date = new Date(milliseconds);
            var time=date.toLocaleString("de-DE", {timeZoneName: "short"})
            timeSplit= time.split(" ");
            var dateLive = new Date();
            var LiveHours, LiveMinutes;
            if(dateLive.getHours()<10){
                LiveHours = "0"+dateLive.getHours();
            }else{
                LiveHours = dateLive.getHours();
            }
            if(dateLive.getMinutes()<10){
                LiveMinutes = "0"+dateLive.getMinutes();
            }else{
                LiveMinutes = dateLive.getMinutes();
            }

            document.querySelector(".date").innerText = "Am " + timeSplit[0];
            document.querySelector(".dt").innerText = "Um " + LiveHours +":"+LiveMinutes +":00 Uhr";
            document.querySelector(".temperaturNow").innerText ="Temperatur: " + temp.toFixed(1) + " °C";
            document.querySelector(".feels_like").innerText = "Gefühlt: " + feels_like.toFixed(1) + " °C";
            document.querySelector(".windGust").innerText = "Windböhen <= " + wind_gustKMH.toFixed(1) + " km/h";
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
        if(displayWeek==0){
            var dtWeek = data.daily[0].dt;
            millisecondsWeek = dtWeek * 1000;
            var date = new Date(millisecondsWeek);

            document.getElementById("weekcardh2").innerText = "Nächste 5 Tage";
            
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
        }else if(displayWeek==1){
            var date = new Date();
            date.setDate(date.getDate());
            document.getElementById("weekcardh2").innerText = "Letzte 5 Tage";

            document.querySelector(".day1Name").innerText = weekday[date.getDay()];
            document.querySelector(".day1Temp").innerText = historyWeather[0].hourly[13].temp.toFixed(1) + "C";
            document.querySelector(".day1TempNight").innerText = historyWeather[0].hourly[21].temp.toFixed(1) + "C";
            document.querySelector(".iconDay1").src = "https://openweathermap.org/img/wn/" + historyWeather[0].hourly[13].weather[0].icon +".png";
            
            document.querySelector(".day2Name").innerText = weekday[date.getDay()+3];
            document.querySelector(".day2Temp").innerText = historyWeather[1].hourly[13].temp.toFixed(1) + "C";
            document.querySelector(".day2TempNight").innerText = historyWeather[1].hourly[21].temp.toFixed(1) + "C";
            document.querySelector(".iconDay2").src = "https://openweathermap.org/img/wn/" + historyWeather[1].hourly[13].weather[0].icon +".png";

            document.querySelector(".day3Name").innerText = weekday[date.getDay()+4];
            document.querySelector(".day3Temp").innerText = historyWeather[2].hourly[13].temp.toFixed(1) + "C";
            document.querySelector(".day3TempNight").innerText = historyWeather[2].hourly[21].temp.toFixed(1) + "C";
            document.querySelector(".iconDay3").src = "https://openweathermap.org/img/wn/" + historyWeather[2].hourly[13].weather[0].icon +".png";

            document.querySelector(".day4Name").innerText = weekday[date.getDay()+5];
            document.querySelector(".day4Temp").innerText = historyWeather[3].hourly[13].temp.toFixed(1) + "C";
            document.querySelector(".day4TempNight").innerText = historyWeather[3].hourly[21].temp.toFixed(1) + "C";
            document.querySelector(".iconDay4").src = "https://openweathermap.org/img/wn/" + historyWeather[3].hourly[13].weather[0].icon +".png";

            document.querySelector(".day5Name").innerText = weekday[date.getDay()+6];
            document.querySelector(".day5Temp").innerText = historyWeather[4].hourly[13].temp.toFixed(1) + "C";
            document.querySelector(".day5TempNight").innerText = historyWeather[4].hourly[23].temp.toFixed(1) + "C";
            document.querySelector(".iconDay5").src = "https://openweathermap.org/img/wn/" + historyWeather[4].hourly[13].weather[0].icon +".png";
        } 
    },

    /**
     * Button functions
     */
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
        weather.displayWeather(currentWeather)
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
        weather.displayWeather(currentWeather)
    },
    last5Days: function() {
        displayWeek=1;
        weather.displayWeather(currentWeather)
    },

    next5Days: function() {
        displayWeek=0;
        weather.displayWeather(currentWeather)
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
     * Puts an array of warnings into the "Warnungen" div, if warnings are available
     * @param {array} warnings The warnings from evaluation.js
     */
    evaluateData: function(warnings){
        if(warnings.length>0){
            document.querySelector(".warnungh2").innerText = "Warnungen:";
            document.querySelector(".warning").style.display = "block";
            document.querySelector(".WarnungText").innerHTML = "";
            for(var i=0;i<warnings.length;i++){
                if(warnings[i]!=0){
                    document.querySelector(".WarnungText").innerText += warnings[i]+"\n";
                }
            }
        }else{
            document.querySelector(".WarnungText").innerHTML = "";
        }
    }

}

let pollen = {
    /**
     * Fills the complete "Pollenflug in Cybercity" section with data
     * @param {JSON} data 
     */
    displayPollen: function(data){
        var Pollen = [];
        Pollen = data.pollen;
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
}

let River = {

    /**
     * Fills the complete "Wasserstand der Meser in CyberCity" section with data
     * @param {JSON} data 
     */
    displayRiver: function(data) {
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
 * Fills the complete "Aktivitäten in CyberCity" section with data. Only called when event is given by backend
 */
let dailyEvents = {
    displayDailyEvent(event){
        var start = new Date(event.content.time_start);
        start=start.toLocaleString("de-DE", {timeZoneName: "short"});
        startArr= start.split(" M");
        var end = new Date(event.content.time_end);
        end = end.toLocaleString("de-DE", {timeZoneName: "short"});
        endArr = end.split(" M");
        var eventText= "Heutige Veranstaltung: "+event.content.title+"\nVon: "+startArr[0]+"\n bis: "+endArr[0]+"\nAdresse: "+event.content.adress;
        
        document.querySelector(".aktivitiesText").innerText = eventText;
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

document.getElementById("last5Days").addEventListener("click",function(){
    weather.last5Days();
});

document.getElementById("next5Days").addEventListener("click",function(){
    weather.next5Days();
});
var timecheck;
weather.getData();
setInterval(()=>{
    timecheck=new Date();
    if(timecheck.getMinutes()==1){
        console.log("Refreshing data");
        //weather.getData();
        document.location.reload(true);
    }	
    weather.displayWeather(currentWeather);
    River.displayRiver(currentRiver);
},60000);