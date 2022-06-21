const fetching = require('./fetching');
const eventService = require('../events/eventService.js');
const event_factory = require('../events/event_factory.js');

/**
 * This function evaluates the current weather, sends events and builds an array of warnings.
 * @returns An array of warnings for the current weather
 */
exports.evaluateWeather=async function(){
    //const currentWeather = await fetching.fetchWeather();
    const currentWeather = fetching.getWeatherData();
    var warnings = [];
    var temp = 0;
    var wind = 0;
    var uv = 0;
    var timeStampTemp = [];
    var timeStampWind = [];
    var timeStampUV = [];
    var ct=0;
    eventService.sendEvent(event_factory.adminMessageBroadcastEvent("Evaluating weather"));
    for(var i=0; i<5; i++){
        //Temperatur
        if(currentWeather.hourly[i].temp>=37){
            //send event zu hoch
            timeStampTemp[ct]= i;
            ct++;
            extremTemp=true;
            temp=1;
        }else{
            if(currentWeather.hourly[i].temp>26){
                //send event zu hoch
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur ist sehr hoch", "temperature", currentWeather.hourly[i].temp + "°C"));
                timeStampTemp[ct]= i;
                ct++;
                temp=5;
            }
            extremTemp=false;
        }
        if(currentWeather.hourly[i].temp<0){
            if(currentWeather.hourly[i].temp<-5){
                if(currentWeather.hourly[i].temp<-10){
                    //send event gefährlich tief
                    timeStampTemp[ct]= i;
                    ct++;
                    extremTemp=true;
                    temp=3;
                }else{
                    //send event definitiv frost
                    eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur ist tief", "temperature", currentWeather.hourly[i].temp + " °C"));
                    timeStampTemp[ct]= i;
                    ct++;
                    extremTemp=true;
                    temp=2;
                }
                }else{
            //send event vielleicht frost
            eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur sinkt unter 0°C", "temperature", currentWeather.hourly[i].temp + " °C"));
            timeStampTemp[ct]= i;
            ct++;
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
                            console.log("Winstärke 12, Orkan");
                            timeStampWind[ct]= i;
                            ct++;
                            extremWind=true;
                            wind=12;
                        }else{
                            console.log("Winstärke 11, Orkanartiger Sturm");
                            timeStampWind[ct]= i;
                            ct++;
                            extremWind=true;
                            wind=11;
                        }
                    }else{
                        console.log("Winstärke 10, schwerer Sturm");
                        timeStampWind[ct]= i;
                        ct++;
                        extremWind=true;
                        wind=10;
                    }
                }else{
                    console.log("Windstärke 9, Sturm");
                    timeStampWind[ct]= i;
                    ct++;
                    extremWind=true;
                    wind=9;
                }
            }else{
                console.log("Windstärke 8, Sturmischer Wind");
                timeStampWind[ct]= i;
                ct++;
                extremWind=true;
                wind=8;
            }
        }else if(currentWeather.hourly[i].wind_speed>13.9){
            console.log("Windstärke 7, Steifer Wind");
            timeStampWind[ct]= i;
            ct++;
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
            timeStampUV[ct]= i;
            ct++;
        }else if(currentWeather.hourly[i].uvi>=8){
            extremUV=true;
            uv=2;
            //event sonnenstrahlung extrem
            timeStampUV[ct]= i;
            ct++;
        }
    }
    switch(temp)
        {
            case 1:
                warnings.push("Temperatur extrem Hoch! Bitte lassen Sie keine Lebewesen oder hitzeempfindliche Gegenstände im Auto und bleiben Sie Hydriert.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur über 37°C", "Temperature", currentWeather.hourly[timeStampTemp[0]].temp + "°C"));
                break;
            case 2:
                warnings.push("Sehr niedrige Temperaturen, Frost/Glätte und weitere gefahrungen. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur unter -10°C", "Temperature", currentWeather.hourly[timeStampTemp[0]].temp + "°C"));
                break;
            case 3:
                warnings.push("Niedrige Temperaturen, Frost/Glätte. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur unter -5°C", "Temperature", currentWeather.hourly[timeStampTemp[0]].temp + "°C"));
                break;
            case 4:
                warnings.push("Temperaturen um 0°C. Es könnte zu Glätte/Frost kommen. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur unter 0°C", "Temperature", currentWeather.hourly[timeStampTemp[0]].temp + "°C"));
                break;
            case 5:
                warnings.push("Temperaturen von über 26°C. Bitte lassen Sie keine Lebewesen oder hitzeempfindliche Gegenstände im Auto und bleiben Sie Hydriert.")
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur über 26°C", "Temperature", currentWeather.hourly[timeStampTemp[0]].temp + "°C"));
                break;
        }
        switch(wind)
        {
            case 8:
                warnings.push("Windstärke 8. Es könnten z.B. Äste von Bäumen abbrechen. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Windstärke 8", "Wind", currentWeather.hourly[timeStampWind[0]].wind_speed + " km/h"));
                break;
            case 9:
                warnings.push("Windstärke 9. Es könnte z.B. zu schäden an Häusern kommen. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Windstärke 9", "Wind", currentWeather.hourly[timeStampWind[0]].wind_speed + " km/h"));
                break;
            case 10:
                warnings.push("Windstärke 10, schwerer Sturm. Es könnten z.B. Bäume entwurzeln. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Windstärke 10", "Wind", currentWeather.hourly[timeStampWind[0]].wind_speed + " km/h"));
                break;
            case 11:
                warnings.push("Windstärke 11, Orkanartiger Sturm. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Windstärke 11", "Wind", currentWeather.hourly[timeStampWind[0]].wind_speed + " km/h"));
                break;
            case 12:
                warnings.push("Windstärke 12, Orkan. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Windstärke 12", "Wind", currentWeather.hourly[timeStampWind[0]].wind_speed + " km/h"));
                break;
        }
        switch(uv)
        {
            case 1:
                warnings.push("UV-Strahlung heute erhöht. Bitte benutzen Sie Sonnencreme.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("UV-Strahlung heute erhöht", "UV", currentWeather.hourly[timeStampUV[0]].uvi));
                break;
            case 2:
                warnings.push("UV-Strahlung heute extrem hoch. Bitte beachten Sie entsprechende Sicherheitsmaßnahmen, Sonnencreme reicht nicht aus!");
                eventService.sendEvent(event_factory.airQualityWarningEvent("UV-Strahlung heute extrem hoch", "UV", currentWeather.hourly[timeStampUV[0]].uvi));
                break;
        }
    return warnings;
}

/**
 * This function evaluates the current air quality,sends events and builds an array of warnings.
 * @returns An array of warnings
 */
exports.evaluateAir = async function(){
    const currentAir = fetching.getAirData();
    var warnings = [];
    var air=0;

    //Luftqualität
    for(var i=0; i<12; i++){
        switch(currentAir.list[i].main.aqi){
            case 4:
                //send event schlecht
                eventService.sendEvent(event_factory.airQualityWarningEvent("Luftqualität schlecht", "airQuality", currentAir.list[i].components));
                air=1;
                break;
            case 5:
                //send event sehr schlecht
                eventService.sendEvent(event_factory.airQualityWarningEvent("Luftqualität sehr schlecht", "airQuality", currentAir.list[i].components));
                air=2;
                break;
        }
    }

    switch(air){
        case 1:
            warnings.push("Luftqualität zeitweise schlecht.");
            break;
        case 2:
            warnings.push("Luftqualität zeitweise sehr schlecht.");
            break;
    }

    return warnings;
}

/**
 * This function evaluates the current water level, sends events and builds an array of warnings.
 * @returns An array of warnings
 */
exports.evaluateRiver = async function(){
    const currentRiver = fetching.getRiverData();
    var warnings = [];
    var river = 0;
    var river_ct = 0;
    //River
    for(i=0;i<96;i++){
        if(currentRiver[i].value>=350 && currentRiver[i].value<=435){
            //create hochwasser event
            river_ct=i;
            river=1;
        }else if(currentRiver[i].value>=435){
            //create extremhochwasser event
            river_ct=i;
            river=2;
            }
    }

    switch(river)
        {
            case 1:
                warnings.push("Der Wasserstand der Meser ist heute hoch, wenn Sie nah am Fluss leben Informieren Sie sich bitte über Sicherheitsmaßnahmen. Meiden Sie außerdem das Gebiet um den Fluss.");
                eventService.sendEvent(event_factory.riverWarningEvent("Wasserstand hoch", "river", currentRiver[river_ct].value));
                break;
            case 2:
                warnings.push("Der Wasserstand der Meser ist heute extrem hoch, wenn Sie nah am Fluss leben Informieren Sie sich bitte über Sicherheitsmaßnahmen. Meiden Sie außerdem das Gebiet um den Fluss.");
                eventService.sendEvent(event_factory.riverWarningEvent("Wasserstand extrem hoch", "river", currentRiver[river_ct].value));
                break;
        }

    return warnings;
}

/**
 * This function evaluates the current pollen level, sends events and builds an array of warnings.
 * @returns An array of warnings
 */
exports.evaluatePollen = async function(){
    const currentPollen = fetching.getPollenData();
    var warnings = [];
    var pollen = 0;
    for(var i=0; i<currentPollen.pollen.length; i++){
        if(currentPollen.pollen[i].today.severity==2){
            eventService.sendEvent(event_factory.airQualityWarningEvent("Pollenflug ist heute erhöht", "pollen", currentPollen.pollen[i].name + " "+ currentPollen.pollen[i].today.desciption));
            pollen=1;
        }else{
            if(currentPollen.pollen[i].today.severity>2){
                eventService.sendEvent(event_factory.airQualityWarningEvent("Pollenflug ist heute stark erhöht", "pollen", currentPollen.pollen[i].name + " "+ currentPollen.pollen[i].today.desciption));
                pollen=2;
            }
        }
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

    return warnings;
}
