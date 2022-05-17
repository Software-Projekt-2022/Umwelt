const express = require('express')
const path = require('path');

const app = express()
const port = 8080;

app.get('/Umwelt', function(req, res){
    res.sendFile(path.join(__dirname,"index.html"));
});
app.use(express.static('src'));
app.listen(port);

