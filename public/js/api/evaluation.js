const fetching = require('./fetching');
const eventService = require('../events/eventService.js');
const event_factory = require('../events/event_factory.js');

/**
 * This function evaluates the current weather, sends events and builds an array of warnings.
 * @returns An array of warnings for the current weather
 */
exports.evaluateWeather=async function(){
    const currentWeather = fetching.getWeatherData();
    var warnings = [];
    var temp = 0;
    var wind = 0;
    var uv = 0;
    var timeStampTemp = [];
    var timeStampWind = [];
    var timeStampUV = [];
    var ct=0;
    for(var i=0; i<11; i++){
        if(currentWeather.hourly[i].temp>=37){
            timeStampTemp[ct]= i;
            ct++;
            extremTemp=true;
            temp=1;
        }else{
            if(currentWeather.hourly[i].temp>26){
                timeStampTemp[ct]= i;
                ct++;
                temp=5;
            }
            extremTemp=false;
        }
        if(currentWeather.hourly[i].temp<0){
            if(currentWeather.hourly[i].temp<-5){
                if(currentWeather.hourly[i].temp<-10){
                    timeStampTemp[ct]= i;
                    ct++;
                    temp=3;
                }else{
                    timeStampTemp[ct]= i;
                    ct++;
                    temp=2;
                }
                }else{
            timeStampTemp[ct]= i;
            ct++;
            temp=4;
            }
        }else{
            extremTemp=false;
        }

        //Wind
        if(currentWeather.hourly[i].wind_speed>17){
            if(currentWeather.hourly[i].wind_speed>20.7){
                if(currentWeather.hourly[i].wind_speed>24.4){
                    if(currentWeather.hourly[i].wind_speed>28.4){
                        if(currentWeather.hourly[i].wind_speed>32.6){
                            timeStampWind[ct]= i;
                            ct++;
                            extremWind=true;
                            wind=12;
                        }else{;
                            timeStampWind[ct]= i;
                            ct++;
                            wind=11;
                        }
                    }else{
                        timeStampWind[ct]= i;
                        ct++;
                        wind=10;
                    }
                }else{
                    timeStampWind[ct]= i;
                    ct++;
                    wind=9;
                }
            }else{
                timeStampWind[ct]= i;
                ct++;
                wind=8;
            }
        }else if(currentWeather.hourly[i].wind_speed>13.9){
            timeStampWind[ct]= i;
            ct++;
            wind=7;
        }
        if(currentWeather.hourly[i].wind_speed<17){
            extremWind=false;
        }
        
        //UV
        if(currentWeather.hourly[i].uvi>=3&&currentWeather.hourly[i].uvi<8){
            uv=1;
            timeStampUV[ct]= i;
            ct++;
        }else if(currentWeather.hourly[i].uvi>=8){
            uv=2;
            timeStampUV[ct]= i;
            ct++;
        }
    }
    switch(temp)
        {
            case 1:
                warnings.push("Temperatur extrem Hoch! Bitte lassen Sie keine Lebewesen oder hitzeempfindliche Gegenst??nde im Auto und bleiben Sie Hydriert.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur ??ber 37??C", "Temperature", currentWeather.hourly[timeStampTemp[0]].temp + "??C"));
                break;
            case 2:
                warnings.push("Sehr niedrige Temperaturen, Frost/Gl??tte und weitere gefahrungen. Bitte beachten Sie entsprechende Sicherheitsma??nahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur unter -10??C", "Temperature", currentWeather.hourly[timeStampTemp[0]].temp + "??C"));
                break;
            case 3:
                warnings.push("Niedrige Temperaturen, Frost/Gl??tte. Bitte beachten Sie entsprechende Sicherheitsma??nahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur unter -5??C", "Temperature", currentWeather.hourly[timeStampTemp[0]].temp + "??C"));
                break;
            case 4:
                warnings.push("Temperaturen um 0??C. Es k??nnte zu Gl??tte/Frost kommen. Bitte beachten Sie entsprechende Sicherheitsma??nahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur unter 0??C", "Temperature", currentWeather.hourly[timeStampTemp[0]].temp + "??C"));
                break;
            case 5:
                warnings.push("Temperaturen von ??ber 26??C. Bitte lassen Sie keine Lebewesen oder hitzeempfindliche Gegenst??nde im Auto und bleiben Sie Hydriert.")
                eventService.sendEvent(event_factory.airQualityWarningEvent("Temperatur ??ber 26??C", "Temperature", currentWeather.hourly[timeStampTemp[0]].temp + "??C"));
                break;
        }
        switch(wind)
        {
            case 8:
                warnings.push("Windst??rke 8. Es k??nnten z.B. ??ste von B??umen abbrechen. Bitte beachten Sie entsprechende Sicherheitsma??nahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Windst??rke 8", "Wind", currentWeather.hourly[timeStampWind[0]].wind_speed + " km/h"));
                break;
            case 9:
                warnings.push("Windst??rke 9. Es k??nnte z.B. zu sch??den an H??usern kommen. Bitte beachten Sie entsprechende Sicherheitsma??nahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Windst??rke 9", "Wind", currentWeather.hourly[timeStampWind[0]].wind_speed + " km/h"));
                break;
            case 10:
                warnings.push("Windst??rke 10, schwerer Sturm. Es k??nnten z.B. B??ume entwurzeln. Bitte beachten Sie entsprechende Sicherheitsma??nahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Windst??rke 10", "Wind", currentWeather.hourly[timeStampWind[0]].wind_speed + " km/h"));
                break;
            case 11:
                warnings.push("Windst??rke 11, Orkanartiger Sturm. Bitte beachten Sie entsprechende Sicherheitsma??nahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Windst??rke 11", "Wind", currentWeather.hourly[timeStampWind[0]].wind_speed + " km/h"));
                break;
            case 12:
                warnings.push("Windst??rke 12, Orkan. Bitte beachten Sie entsprechende Sicherheitsma??nahmen.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("Windst??rke 12", "Wind", currentWeather.hourly[timeStampWind[0]].wind_speed + " km/h"));
                break;
        }
        switch(uv)
        {
            case 1:
                warnings.push("Die UV-Strahlung ist heute erh??ht. Bitte benutzen Sie Sonnencreme.");
                eventService.sendEvent(event_factory.airQualityWarningEvent("UV-Strahlung heute erh??ht", "UV", currentWeather.hourly[timeStampUV[0]].uvi));
                break;
            case 2:
                warnings.push("Die UV-Strahlung heute extrem hoch. Bitte beachten Sie entsprechende Sicherheitsma??nahmen, Sonnencreme reicht nicht aus!");
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
    for(var i=0; i<11; i++){
        switch(currentAir.list[i].main.aqi){
            case 4:
                eventService.sendEvent(event_factory.airQualityWarningEvent("Luftqualit??t schlecht", "airQuality", currentAir.list[i].components));
                air=1;
                break;
            case 5:
                eventService.sendEvent(event_factory.airQualityWarningEvent("Luftqualit??t sehr schlecht", "airQuality", currentAir.list[i].components));
                air=2;
                break;
        }
    }

    switch(air){
        case 1:
            warnings.push("Die Luftqualit??t ist aktuell schlecht.");
            break;
        case 2:
            warnings.push("Die Luftqualit??t ist aktuell sehr schlecht.");
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
    for(i=0;i<96;i++){
        if(currentRiver[i].value>=350 && currentRiver[i].value<=435){
            river_ct=i;
            river=1;
        }else if(currentRiver[i].value>=435){
            river_ct=i;
            river=2;
            }
    }

    switch(river)
        {
            case 1:
                warnings.push("Der Wasserstand der Meser ist heute hoch, wenn Sie nah am Fluss leben Informieren Sie sich bitte ??ber Sicherheitsma??nahmen. Meiden Sie au??erdem das Gebiet um den Fluss.");
                eventService.sendEvent(event_factory.riverWarningEvent("Wasserstand hoch", "river", currentRiver[river_ct].value));
                break;
            case 2:
                warnings.push("Der Wasserstand der Meser ist heute extrem hoch, wenn Sie nah am Fluss leben Informieren Sie sich bitte ??ber Sicherheitsma??nahmen. Meiden Sie au??erdem das Gebiet um den Fluss.");
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
            eventService.sendEvent(event_factory.airQualityWarningEvent("Pollenflug ist heute erh??ht", "pollen", currentPollen.pollen[i].name + " "+ currentPollen.pollen[i].today.desciption));
            pollen=1;
        }else{
            if(currentPollen.pollen[i].today.severity>2){
                eventService.sendEvent(event_factory.airQualityWarningEvent("Pollenflug ist heute stark erh??ht", "pollen", currentPollen.pollen[i].name + " "+ currentPollen.pollen[i].today.desciption));
                pollen=2;
            }
        }
    }
    switch(pollen)
        {
            case 1:
                warnings.push("Der Pollenflug ist sehr hoch. Bitte beachten Sie entsprechende Ma??nahmen.");
                break;
            case 2:
                warnings.push("Der Pollenflug ist extrem hoch. Bitte beachten Sie entsprechende Ma??nahmen.");
                break;
        }

    return warnings;
}
