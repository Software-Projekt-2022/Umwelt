const fetching = require('./fetching');
const evaluation = require('./evaluation');
var warnings = [];
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
exports.startUp = async function (app) {
    weatherData = await fetching.fetchWeather();
    histoData = await fetching.fetchHistoricalWeather();
    airData = await fetching.fetchAir();
    riverData = await fetching.fetchRiver();
    pollenData = await fetching.fetchPollen();
    warnings.length = 0;

    if (checkData()) {
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

        app.get('/api/getAllData', async (req, res) => {
            res.send(allData)
        });
    }
}

/**
 * This function is called to refresh the data. It fetches the data and sends it to the frontend.
 * @param {*} app 
 */
exports.refreshData = async function (app) {
    weatherData = await fetching.fetchWeather();
    histoData = await fetching.fetchHistoricalWeather();
    airData = await fetching.fetchAir();
    riverData = await fetching.fetchRiver();
    pollenData = await fetching.fetchPollen();

    if (checkData()) {
        allData = {
            "weather": weatherData,
            "historicalWeather": histoData,
            "air": airData,
            "river": riverData,
            "pollen": pollenData,
            "warnings": warnings,
            "events": {
                content: {
                    "title": "Abgabe Softwareprojekt",
                    "description": "Event 1 description",
                    "time_start": "2022-06-28T12:30:00.000Z",
                    "time_end": "2022-06-28T15:00:00.000Z",
                    "address": "Artilleriestraße 9",
                }
            }
        }

        app.get('/api/getAllData', async (req, res) => {
            res.send(allData)
        });
    }
}

/**
 * Checks if the fetched data contains the first thing thats used in api-handler.js.
 * @returns true if the data is ok, false if not.
 */
function checkData() {
    //Check if any of the data is null to prevent errors
    if (weatherData == null || histoData == null || airData == null || riverData == null || pollenData == null) {
        return false;
    }
    if (weatherData.hourly == null || weatherData.hourly == undefined) {
        return false;
    }
    if (histoData[0].hourly == null) {
        return false;
    }
    if (airData.list == null) {
        return false;
    }
    if (riverData[0] == null) {
        return false;
    }
    if (pollenData.pollen == null) {
        return false;
    }
    return true;
}