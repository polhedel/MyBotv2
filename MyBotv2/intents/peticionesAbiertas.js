var ClienteJira = require('../clienteJira');
const config = require('../config');
var _ = require('underscore');


function doWork(message_from_wit, message_from_slack, usuarios, lista, callback){

    var indice = _.findIndex(usuarios, {userId: message_from_slack.user});

    console.log("Peticiones Abiertas");
    console.log("From Private: " + usuarios[indice].fromPrivate);
    console.log("User: "+usuarios[indice].userId +" Conversation level: "+usuarios[indice].conversationLevel);


    usuarios[indice].lastState = "peticionesAbiertas";

    var jql = "project = ABSISGO AND issuetype = Peticion AND status in (Implementación,\"To Do\")";

    ClienteJira.searchJQL(jql, function (error, respuesta_JIRA) {

        if (respuesta_JIRA.total != 0) {

            usuarios[indice].ignoreIntent = true;
            usuarios[indice].lastState = "sacaListado";
            if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 11;
            res = "Hay " + respuesta_JIRA.total + " peticiones abiertas. Quieres que saque un listado?";
            ClienteJira.crearLista(respuesta_JIRA, function (error, lista) {
                //console.log(lista);
                callback(200, res, lista);
            });
        } else {
            usuarios[indice].ignoreIntent = false;
            if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 0;
            res = "No hay cosultas abiertas, bien hecho! Para cualquier otra cosa no dudes en consultarme ;)";
            callback(200, res, lista);
        }
    });


}

module.exports = doWork;