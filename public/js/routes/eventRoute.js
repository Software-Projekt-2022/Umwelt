const express = require('express');
const router = express.Router();


const eventService = require('../events/eventService.js');
const event_factory = require('../events/event_factory.js');

router.post('/Umwelt/testevent', async (req, res) => {
  try{
    await eventService.sendEvent(event_factory.adminMessageBroadcastEvent("Test from route"));
  }  
    catch(err){
        console.log("failed to send event");
        console.log(err);
        }
    res.send("Event sent");
})