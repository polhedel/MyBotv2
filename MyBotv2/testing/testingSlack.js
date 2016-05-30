// Testing for @slack/client api
//var common = require('../common/common');
var util = require('util');
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var config = require('../config');

var proxiedRequestTransport = require('@slack/client/lib/clients/transports/request.js').proxiedRequestTransport;
var wsTransport = require('@slack/client/lib/clients/transports/ws');

var RtmClient = require('@slack/client').RtmClient;
var token = config.slack_token || '';
var url = config.URL || '';

var rtm = new RtmClient(
    token,
    {
    transport: proxiedRequestTransport(url),
    socketFn: function(socketUrl) {
        return wsTransport(socketUrl, {
            proxyURL: url,
            proxyUrl: url
        });
    }

    });

rtm.start();

rtm.on(CLIENT_EVENTS.MESSAGE, function handleRtmMessage(message) {
  console.log('Message:', message);
    rtm.sendMessage('missage de prova', 'C11U81AQ2', function messageSent() {
    // optionally, you can supply a callback to execute once the message has been sent
  });
});
/*
rtm.on(CLIENT_EVENTS.RTM_AUTHENTICATED, function(rtmStartData){
  console.log('RTM_AUTHENTICATED. Data:'+ util.inspect(rtmStartData));
});

rtm.on(CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
  // This will send the message 'this is a test message' to the channel identified by id 'C0CHZA86Q'
    var missatge1 = 'missage de prova1';
  rtm.sendMessage(missatge1,'C11U81AQ2', function messageSent() {
     console.log('Missatge enviat: ',missatge1)
 });
});
*/
rtm.on(RTM_EVENTS.MESSAGE, function(message){
    console.log('Missatge rebut: ',message.text);
    rtm.sendMessage('buenas',message.channel, function messageSent() {
      console.log('Missatge enviat: buenas')
  });
});
