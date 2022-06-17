const constants = require('./event_constants');

function wrapper(event_type)
{
    return {
        event_id: constants.microservice_prefix + Date.now(),
        event_type: event_type,
        event_origin: constants.microservice_name,
        event_time: new Date().toISOString(),
        content: {}
    };
}

function wrapperWithContent(event_type, content)
{
    var event = wrapper(event_type);
    event.content = content;
    return event;
}

function adminMessageBroadcastEvent(msg)
{
    return wrapperWithContent("admin_message_broadcast",
    {
        message: msg
    });
}

function airQualityWarningEvent(msg, type, level)
{
    return wrapperWithContent("air_quality_warning_issued",
    {
        message: msg,
        pollution_type: type,
        pollution_level: level
    });
}
module.exports.airQualityWarningEvent = airQualityWarningEvent;
module.exports.adminMessageBroadcastEvent = adminMessageBroadcastEvent;