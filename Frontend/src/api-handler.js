let weather = {
    int: displayTime = 0,
    int: displayDay = 0,
    int: displayWeek = 0,
    int: pollenDay=0,
    int: lat=52.289,
    int: lon=8.91,
    boolean: hochwasser=false,
    boolean: extremTemp=false,
    boolean: extremWind=false,
    boolean: extremPollen=false,
    boolean: extremUV=false,
    var: airText="",
    json: currentAir=null,
    json: currentWeather=null,
    json: dailyWeather=null,
    json: currentPollen=null,
    json: currentRiver=null,
    josn: historyWeather=null,
    "apiKey": "e0061af8aed641bc2d516594bff85d3b",
    "lat": 52.28,
    "lon": 8.91,
    /**
     * Fetches Airdata from openweathermap
     */
    fetchAir: function(){

        fetch(
            "https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat="+this.lat+"&lon="+this.lon+"&appid="+this.apiKey,
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
            .then(() => this.displayWeather(currentWeather))
        
    },
    
    /**
     * Fetches historical weatherdata of the last 5 days from openweathermap
     * 
     */
    fetchHistoryWeather: function() {
        var day5, day4, day3, day2, day1;
        day5=new Date();
        day4=new Date();
        day3=new Date();
        day2=new Date();
        day1=new Date();

        day5.setDate(day5.getDate()-5);
        day5=(day5.getTime()/1000).toFixed(0);

        day4.setDate(day4.getDate()-4);
        day4=(day4.getTime()/1000).toFixed(0);

        day3.setDate(day3.getDate()-3);
        day3=(day3.getTime()/1000).toFixed(0);

        day2.setDate(day2.getDate()-2);
        day2=(day2.getTime()/1000).toFixed(0);

        day1.setDate(day1.getDate()-1);
        day1=(day1.getTime()/1000).toFixed(0);

        Promise.all([
            fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+lat+"&lon="+lon+"&dt="+day5+"&appid="+this.apiKey+"&units=metric&lang=de").then(value => value.json()),
            fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+lat+"&lon="+lon+"&dt="+day4+"&appid="+this.apiKey+"&units=metric&lang=de").then(value => value.json()),
            fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+lat+"&lon="+lon+"&dt="+day3+"&appid="+this.apiKey+"&units=metric&lang=de").then(value => value.json()),
            fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+lat+"&lon="+lon+"&dt="+day2+"&appid="+this.apiKey+"&units=metric&lang=de").then(value => value.json()),
            fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+lat+"&lon="+lon+"&dt="+day1+"&appid="+this.apiKey+"&units=metric&lang=de").then(value => value.json()),
        ])
        .then((value) => {
            historyWeather = value;
            console.log(historyWeather);
        })
        .catch(error => console.log(error));
    },

    /**
     * Fills the complete "Wetter in Cybercity" section with data
     * @param {JSON} data 
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
    weather.evaluateData();
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
    
    evaluateData: function(){
        var warnings = [];
        var uv=0;
        var wind=0;
        var temp=0;
        var air=0;
        var pollen=0;
        var river=0;
        for(var i=0; i<11; i++){
            //Temperatur
            if(currentWeather.hourly[i].temp>=37){
                //send event zu hoch
                extremTemp=true;
                temp=1;
            }else{
                if(currentWeather.hourly[i].temp>26){
                    temp=5;
                }
                extremTemp=false;
            }
            if(currentWeather.hourly[i].temp<0){
                if(currentWeather.hourly[i].temp<-5){
                    if(currentWeather.hourly[i].temp<-10){
                        //send event gefährlich tief
                        extremTemp=true;
                        temp=3;
                    }else{
                        //send event definitiv frost
                        extremTemp=true;
                        temp=2;
                    }
                    }else{
                //send event vielleicht frost
                temp=4;
                }
            }else{
                extremTemp=false;
            }

            //Windgeschwindigkeit
            if(currentWeather.hourly[i].wind_speed>17){
                if(currentWeather.hourly[i].wind_speed>20.7){
                    if(currentWeather.hourly[i].wind_speed>24.4){
                        if(currentWeather.hourly[i].wind_speed>28.4){
                            if(currentWeather.hourly[i].wind_speed>32.6){
                                //event orkan(12)
                                extremWind=true;
                                wind=12;
                            }else{
                                //event orkanartiger Sturm(11)
                                extremWind=true;
                                wind=11;
                            }
                        }else{
                            //event schwerer Sturm(10)
                            extremWind=true;
                            wind=10;
                        }
                    }else{
                        //event Sturm(9)
                        extremWind=true;
                        wind=9;
                    }
                }else{
                    //event stürmischer Wind(8)
                    extremWind=true;
                    wind=8;
                }
            }else if(currentWeather.hourly[i].wind_speed>13.9){
                //event steifer Wind(7)
                wind=7;
            }
            if(currentWeather.hourly[i].wind_speed<17){
                extremWind=false;
            }
            
            //Sonnenstrahlung
            if(currentWeather.hourly[i].uvi>=3&&currentWeather.hourly[i].uvi<8){
                extremUV=true;
                uv=1;
                //event sonnenstrahlung hoch
            }else if(currentWeather.hourly[i].uvi>=8){
                extremUV=true;
                uv=2;
                //event sonnenstrahlung extrem
            }
        }

        //Luftqualität
        for(var i=0; i<currentAir.list.length; i++){
            switch(currentAir.list[i].main.aqi){
                case 4:
                    //send event schlecht
                    air=1;
                    break;
                case 5:
                    //send event sehr schlecht
                    air=2;
                    break;
            }
        }

        //Pollen
        if(currentPollen.pollen[0].today.severity==2){
            //Use makeAirQualityEvent() to create an event
            pollen=1;
        }else{
            if(currentPollen.pollen[0].today.severity>2){
                //Use makeAirQualityEvent() to create a severe pollen
                pollen=2;
            }
        }

        //River
        for(i=0;i<96;i++){
            if(currentRiver[i].value>=350 && currentRiver[i].value<=435){
                //create hochwasser event
                river=1;
            }else if(currentRiver[i].value>=435){
                //create extremhochwasser event
                river=2;
                }
        }
        //Build warning
        switch(temp)
        {
            case 1:
                warnings.push("Temperatur extrem Hoch! Bitte lassen Sie keine Lebewesen oder hitzeempfindliche Gegenstände im Auto und bleiben Sie Hydriert.");
                break;
            case 2:
                warnings.push("Sehr niedrige Temperaturen, Frost/Glätte und weitere gefahrungen. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                break;
            case 3:
                warnings.push("Niedrige Temperaturen, Frost/Glätte. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                break;
            case 4:
                warnings.push("Temperaturen um 0°C. Es könnte zu Glätte/Frost kommen. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                break;
            case 5:
                warnings.push("Temperaturen von über 26°C. Bitte lassen Sie keine Lebewesen oder hitzeempfindliche Gegenstände im Auto und bleiben Sie Hydriert.")
        }

        switch(wind)
        {
            case 8:
                warnings.push("Windstärke 8. Es könnten z.B. Äste von Bäumen abbrechen. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                break;
            case 9:
                warnings.push("Windstärke 9. Es könnte z.B. zu schäden an Häusern kommen. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                break;
            case 10:
                warnings.push("Windstärke 10, schwerer Sturm. Es könnten z.B. Bäume entwurzeln. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                break;
            case 11:
                warnings.push("Windstärke 11, Orkanartiger Sturm. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                break;
            case 12:
                warnings.push("Windstärke 12, Orkan. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                break;
        }
        switch(uv)
        {
            case 1:
                warnings.push("UV-Strahlung heute erhöht. Bitte benutzen Sie Sonnencreme.");
                break;
            case 2:
                warnings.push("UV-Strahlung heute extrem hoch. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen, Sonnencreme reicht nicht aus!");
                break;
        }
        switch(air)
        {
            case 1:
                warnings.push("Luftqualität zeitweise schlecht.");
                break;
            case 2:
                warnings.push("Luftqualität zeitweise sehr schlecht.");
                break;
        }
        switch(pollen)
        {
            case 1:
                warnings.push("Pollen sehr hoch. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                break;
            case 2:
                warnings.push("Pollen extrem hoch. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                break;
        }
        switch(river)
        {
            case 1:
                warnings.push("Der Wasserstand der Meser ist heute hoch, wenn Sie nah am Fluss leben Informieren Sie sich bitte über Sicherheitsmaßnahmen. Meiden Sie außerdem das Gebiet um den Fluss.");
                break;
            case 2:
                warnings.push("Der Wasserstand der Meser ist heute extrem hoch, wenn Sie nah am Fluss leben Informieren Sie sich bitte über Sicherheitsmaßnahmen. Meiden Sie außerdem das Gebiet um den Fluss.");
                break;
        }
        
        if(warnings.length>0){
            document.querySelector(".warnungh2").innerText = "Warnungen:";
            document.querySelector(".warning").style.display = "block";
            document.querySelector(".WarnungText").innerHTML = "";
            for(var i=0;i<warnings.length;i++){
                document.querySelector(".WarnungText").innerText += warnings[i]+"\n";
            }
        }else{
            document.querySelector(".WarnungText").innerHTML = "";
        }
        console.log(warnings);
        console.log(temp,uv,wind,air,pollen,river);

        //Auswertung aktivitäten
    }

}

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

document.getElementById("last5Days").addEventListener("click",function(){
    weather.last5Days();
});

document.getElementById("next5Days").addEventListener("click",function(){
    weather.next5Days();
    weather.evaluateData();
});

weather.fetchAir();
weather.fetchWeather();
weather.fetchHistoryWeather();
pollen.fetchPollen();
River.fetchRiver();