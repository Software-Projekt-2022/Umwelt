var microservice_name= 'microservice.umwelt';
var microservice_prefix='UMW-';
var microservice_exchange= 'publish_event.umwelt';
var microservice_queue= 'microservice.umwelt';


const amqp = require('amqplib/callback_api');

//Verbindung und Channel für Message Bus
var amqp_connection=null;
var amqp_channel=null;

/**
 * Funktion zum Aufbauen der Verbindung zum Message Bus.
 * Diese Funktion blockiert nicht.
 * @param done wird ausgeführt, wenn die Verbindung aufgebaut wurde
 */
function connect(done, onError)
{
    const conn_url = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
    console.log('Connecting to %s', conn_url);   //Verbindungs-URL ausgeben
    amqp.connect(conn_url, (err, conn) =>
    {
        if(err)
        {
            onError(err);
            return;
        }
        amqp_connection = conn;

        conn.on('close', () =>
        {
            console.log('RabbitMQ connection closed');
            amqp_connection = null;
        });

        conn.createChannel((ch_err, ch) =>
        {
            if(ch_err)
            {
                conn.close();
                conn = null;
                onError(ch_err);
                return;
            }

            amqp_channel = ch;
            done();
        });
    });
}

function sendEvent(event)
{
    return new Promise((resolve, reject) =>
    {
        var msg = JSON.stringify(event);

        //Send event function
        const send = () =>
        {
            amqp_channel.publish(microservice_exchange, event.event_type, Buffer.from(msg));
            console.log('Event sent %s: %s',event.event_type, msg);
            resolve();
        };

        if(!amqp_connection || !amqp_channel)
        {
            connect(() =>
            {
                console.log('Connected to RabbitMQ');
                send();
            }, (err) =>
            {
                reject(err);
            });
        }
        else
        {
            send();
        }
    });
}

function onEventRecieved(event){
    console.log('Event recieved %s: %s',event.event_type, JSON.stringify(event));
}

function recieveEvent(callback)
{
    amqp_channel.prefetch(1);
    amqp_channel.consume(microservice_queue, (msg) =>
    {
        if(msg.content)
        {
            onEventRecieved(msg.content.toString());
            var event = JSON.parse(msg.content.toString());
            callback(event);
        }
    }
    , {noAck: true});
}


module.exports.sendEvent = sendEvent;
module.exports.recieveEvent = recieveEvent;


    