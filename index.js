const express = require('express')
const path = require('path');
const serverTools = require('./public/js/api/serverTools.js');
const app = express();

//Routes
app.use(express.static('/public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img',express.static(path.join(__dirname, 'public/css/media')));
app.use('/fonts',express.static(path.join(__dirname, 'public/css/fonts')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/events',express.static(path.join(__dirname, 'public/js/events')));
app.use('/fetchData' ,express.static(path.join(__dirname, 'public/js/fetchData.js')));
app.use('/riverDiagramm.html',express.static(path.join(__dirname, 'public/riverDiagramm.html')));

//Display html
app.get('/Umwelt', function(req, res){
    res.sendFile(path.join(__dirname,"public/index.html"));
});

//Start server
console.log('Server started on port ' + process.env.port);
app.listen(process.env.port, process.env.address);

//Routine refreshing every 60 minutes and evalutating at 8 and 20 o' clock
serverTools.startUp(app);
var timecheck;
setInterval(() => {
    timecheck=new Date();
    if(timecheck.getHours()==8 || timecheck.getHours()==20){
        serverTools.startUp(app);
        console.log("8 o' clock restart");
    }else if(timecheck.getMinutes()==0){
        serverTools.refreshData(app);
        console.log("now");
    }
}   , 60000);
