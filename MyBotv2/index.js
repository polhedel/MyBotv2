var Logger =  require('./lib/logger.js').Logger;
var logLevels =  require('./lib/logger.js').logLevels;
var Wit = require('./lib/wit.js').Wit;
var mensaje = require('./mensaje');
var Interprete = require('./interprete');
var _ = require('underscore');
var jsonfile = require('jsonfile')
var usersJiraFile = './usersJira.json'

var EventEmitter = require('events').EventEmitter;
var login = new EventEmitter();

var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const config = require('./config');


var wit_token = config.wit_token || '';
var slack_token = config.slack_token || '';
var RtmClient = require('@slack/client').RtmClient;
var proxiedRequestTransport = require('@slack/client/lib/clients/transports/request.js').proxiedRequestTransport;
var wsTransport = require('@slack/client/lib/clients/transports/ws');
var url = config.URL || '';

//Información del chat de Slack



//Creación del cliente Slack
var cliente_slack = new RtmClient(
  slack_token,
  {
  logLevel:'log',
  transport: proxiedRequestTransport(url), //Necesario para que funcione destras del proxy de everis
  socketFn: function(socketUrl) {
      return wsTransport(socketUrl, {
          proxyURL: url,
          proxyUrl: url
      });
    }
  });

//Conexión a Slack
cliente_slack.start();


// Acciones de Wit.ai client
const actions = {
    say: function(sessionId, msg, cb) {
      console.log(msg);
      cb();
    },
    merge: function(context, entities, cb) {
      cb(context);
    },
    error: function(sessionid, msg){
      console.log('Oops, I don\'t know what to do.');
    }
};

//Conexión a Wit.ai
const cliente_wit = new Wit(wit_token, actions);

var usuarios = new Array;

var usuariosLista = {};

var usersJira;

jsonfile.readFile(usersJiraFile,function(err,obj){
    usersJira = obj;
    console.log(JSON.stringify(usersJira));
})



//Recibo un mensaje
cliente_slack.on(RTM_EVENTS.MESSAGE, function(message_from_slack){

    //var newMessage = mensaje(message_from_slack);
    //newMessage.mostrarDeCanal();
    //console.log(message_from_slack);
    //console.log(message_from_slack.text);
    //newMessage.mostrar();

    if (message_from_slack.text[0]=='<' || message_from_slack.text[0]=='&') {
        message_from_slack.text = message_from_slack.text.slice(2);
        console.log("Nuevo mensaje: " +message_from_slack.text);
    }

        //Sending message to Wit.ai
        cliente_wit.message(message_from_slack.text, function (error, message_from_wit) {

            if (error) {
                console.log('Ups! He encontrado un error: ' + error);

            } else {
                console.log("\nRespuesta de wit: " + JSON.stringify(message_from_wit));

                if(!usuariosLista[message_from_slack.user]){
                    usuariosLista[message_from_slack.user] = [];
                }

                Interprete.interpretar(message_from_wit, message_from_slack, usuarios, usuariosLista[message_from_slack.user], function(error, respuesta_interprete, lista_respuesta){

                    var indice = _.findIndex(usuarios,{userId:message_from_slack.user});

                    console.log("indice: "+ indice);
                    console.log("Responder: " + usuarios[indice].responder);

                    usuariosLista[message_from_slack.user] = lista_respuesta;
                    //console.log(usuariosLista);


                    if(usuarios[indice].responder){
                        cliente_slack.sendMessage(respuesta_interprete, message_from_slack.channel, function messageSent() {});
                        usuarios[indice].responder = false;

                        //console.log("Mensaje enviado: " + respuesta_interprete);
                        console.log("\nUsuarios1: " + JSON.stringify(usuarios));
                    }

                });
            }
        });
    //}


        /*
        if (counter==1) {
        rtm_slack.sendMessage('¡Hola! ¿En qué puedo ayudarte?', message_from_slack.channel, function messageSent() {});
        console.log('Mensaje enviado: ¡Hola! ¿En qué puedo ayudarte?');
        }
        */

});


