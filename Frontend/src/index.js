const express = require('express')
const path = require('path');



const app = express();


app.get('/Umwelt', function(req, res){
    res.sendFile(path.join(__dirname,"index.html"));
});

app.use(express.static('/Frontend/src'));

app.use('/events/eventService', function(req, res){
    res.sendFile(path.join(__dirname,"Backend/events/eventService.js"));
});
app.use('/events/event_factory', function(req, res){
    res.sendFile(path.join(__dirname,"Backend/events/event_factory.js"));
});

require('./events/eventService').sendEvent(require('./events/event_factory').adminMessageBroadcastEvent('Das ist ein Test/Umwelt'));

console.log('Server started on port ' + process.env.port);
app.listen(process.env.port, process.env.adress);

