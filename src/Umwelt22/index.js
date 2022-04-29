const express = require('express')
const path = require('path');

const app = express()
const port = 3000;



app.get('/Umwelt', function(req, res){
    res.sendFile(path.join(__dirname,"index.html"));
});
app.use(express.static('Umwelt22'));
app.listen(port);

