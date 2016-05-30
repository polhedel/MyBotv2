var jsonfile = require('jsonfile');
var _ = require('underscore');
var file = './users.json';

const config = require('./config');

var fs = require('fs');


var ClienteJira = require('./clienteJira');

const general_channel = config.general_channel;
const testing_channel = config.testing_channel;
const random_channel = config.random_channel;


function usuario(userId, username, fromPrivate, ignoreIntent, lastState, responder, conversationLevel){
    this.userId = userId;
    this.username = username;
    this.fromPrivate = fromPrivate;
    this.ignoreIntent = ignoreIntent;
    this.lastState = lastState;
    this.responder = responder;
    this. conversationLevel = conversationLevel;
}

module.exports = {

        interpretar: function(message_from_wit, message_from_slack, usuarios, lista, callback) {

            //Almaceno la información del usuario que llega SI ES QUE ES UN NUEVO USUARIO
            //var indice = usuariosID.indexOf(message_from_slack.user);
            var indice = _.findIndex(usuarios, {userId: message_from_slack.user});

            if (indice == -1) {
                //usuariosID.push(message_from_slack.user);
                //console.log("UsuariosID: " + usuariosID);
                console.log("Usuarios length: " + usuarios.length);
                indice = usuarios.length;
                usuarios[indice] = new usuario(message_from_slack.user, "", false, false, "", false, 0);
                console.log("Usuarios: " + JSON.stringify(usuarios));
                console.log("Indice _: " + _.findIndex(usuarios, {userId: message_from_slack.user}))
            }

            if (usuarios[indice].ignoreIntent) {
                var option = usuarios[indice].lastState;
            } else {
                if (typeof message_from_wit.entities.intent!= 'undefined'){
                    if (message_from_wit.entities.intent[0].confidence > 0.5) {
                        option = message_from_wit.entities.intent[0].value;
                    } else {
                        console.log ("Confidence too low on intent: " + message_from_wit.entities.intent[0].value);
                        callback (200, "No te he entendido bien, puedes reformular por favor?");
                        return;
                    }
                } else {
                    console.log ("No hay intent");
                    callback (200, "No encuentro esa opción, puedes reformular por favor?");
                    return;
                }

            }

            console.log("\nOpción: " + option);

            usuarios[indice].fromPrivate = (message_from_slack.channel != general_channel &&
                message_from_slack.channel != random_channel &&
                message_from_slack.channel != testing_channel);

            console.log("From private: " +  usuarios[indice].fromPrivate);
            console.log("Nivel de conversación: " + usuarios[indice].conversationLevel);


            if ( usuarios[indice].fromPrivate || usuarios[indice].conversationLevel > 0 || option=="saludo" || option=="help") {

                usuarios[indice].responder = true;


                    if (fs.existsSync('./intents/' + option + '.js')) {

                        var doWork = require('./intents/' + option + '.js');
                        doWork(message_from_wit, message_from_slack, usuarios, lista, callback);

                    } else {
                        console.log("No existe la información de ese intent");
                        usuarios[indice].conversationLevel=0;
                        usuarios[indice].ignoreIntent=false;
                        callback(200, "Lo siento, no puedo ayudarte :(");

                    }


            } else {
                console.log("El usuario " + usuarios[indice].userId + " no tiene una conversación abierta");
                callback(200,"No tienes una conversación abierta");

            }
        }
}



