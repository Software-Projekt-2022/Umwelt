const fetching = require('./fetching');
const evaluation = require('./evaluation');
var warnings=[];
var weatherData;
var histoData;
var airData;
var riverData;
var pollenData;
var allData = {};

/**
 * This function is called when the server starts up/resets. It fetches the data, sends it to the frontend and evaluates it.
 * @param {*} app 
 */
exports.startUp = async function(app) {
    weatherData=await fetching.fetchWeather();
    histoData=await fetching.fetchHistoricalWeather();
    airData=await fetching.fetchAir();
    riverData=await fetching.fetchRiver();
    pollenData=await fetching.fetchPollen();
    warnings = [];

        warnings.push(await evaluation.evaluateWeather(weatherData));
        warnings.push(await evaluation.evaluateAir(airData));
        warnings.push(await evaluation.evaluateRiver(riverData));
        warnings.push(await evaluation.evaluatePollen(pollenData));

        allData = {
            "weather": weatherData,
            "historicalWeather": histoData,
            "air": airData,
            "river": riverData,
            "pollen": pollenData,
            "warnings": warnings,
            "events": {
                "content": {
                    "title": "Abgabe Softwareprojekt",
                    "description": "Event 1 description",
                    "time_start": "2022-06-28T14:30:00.000Z",
                    "time_end": "2022-06-28T17:00:00.000Z",
                    "address": "Artilleriestraße 9",
                },
            }
        }

        app.get('/api/getAllData', async(req, res) => {
            res.send(allData)
        });
    
}

/**
 * This function is called to refresh the data. It fetches the data and sends it to the frontend.
 * @param {*} app 
 */
exports.refreshData = async function(app) {
    weatherData=await fetching.fetchWeather();
    histoData=await fetching.fetchHistoricalWeather();
    airData=await fetching.fetchAir();
    riverData=await fetching.fetchRiver();
    pollenData=await fetching.fetchPollen();

    allData = {
        "weather": weatherData,
        "historicalWeather": histoData,
        "air": airData,
        "river": riverData,
        "pollen": pollenData,
        "warnings": warnings,
        "events": {
            content: {
                "title": "Event 12",
                "description": "Event 1 description",
                "time_start": "2022-05-13T12:00:00.000Z",
                "time_end": "2022-05-13T14:00:00.000Z",
                "adress": "Event 1 adress",
            }
        }
    }

    app.get('/api/getAllData', async(req, res) => {
        res.send(allData)
    });
}

/**
 * Checks if the fetched data contains the first thing thats used in api-handler.js.
 * @returns true if the data is ok, false if not.
 */
function checkData(){
    if(this.weatherData.current == null){
        return false;
    }
    if(this.histoData[0].hourly[13].temp == null){
        return false;
    }
    if(this.airData.list[0].main.aqi == null){
        return false;
    }
    if(this.riverData[0].value == null){
        return false;
    }
    if(this.pollenData[0].today.description == null){
        return false;
    }
    return true;
}