const express = require('express')
const path = require('path');
var bodyParser = require('body-parser');
//const evaluation = require('./Public/js/evaluation.js');
//const fetching = require('./Public/js/api/fetching.js');
const app = express();

app.use(express.static('/public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img',express.static(path.join(__dirname, 'public/css/media')));
app.use('/fonts',express.static(path.join(__dirname, 'public/css/fonts')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/js/api',express.static(path.join(__dirname, 'public/js/api')));
app.use('/events',express.static(path.join(__dirname, 'public/js/events')));
app.use('/api/evaluation',express.static(path.join(__dirname, 'public/js/api/evaluation.js')));
app.use('/riverDiagramm.html',express.static(path.join(__dirname, 'public/riverDiagramm.html')));
//app.use('routes/eventRoute',require('./public/js/routes/eventRoute.js'));
app.get('/Umwelt', function(req, res){
    res.sendFile(path.join(__dirname,"public/index.html"));
});


app.use('events/eventService', function(req, res){
    res.sendFile(path.join(__dirname,"public/js/events/eventService.js"));
});
app.use('events/event_factory', function(req, res){
    res.sendFile(path.join(__dirname,"events/event_factory.js"));
});


require('./public/js/events/eventService').sendEvent(require('./public/js/events/event_factory').adminMessageBroadcastEvent('Das ist ein Test/Umwelt'));

console.log('Server started on port ' + process.env.port);
app.listen(process.env.port, process.env.adress);

//var testJSON = app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'text/xml' }));

//console.log(testJSON);

/*
setInterval(() => {
    evaluation.evaluateData();
    console.log('Evaluated weather');
}   , 5000);
*/