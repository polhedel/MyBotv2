var ClienteJira = require('../clienteJira');
const config = require('../config');
var _ = require('underscore');


function doWork(message_from_wit, message_from_slack, usuarios, lista, callback){

    indice = _.findIndex(usuarios, {userId: message_from_slack.user});

    console.log("Incidencias Abiertas");
    console.log("From Private: " + usuarios[indice].fromPrivate);
    console.log("User: " + usuarios[indice].userId +" Conversation level: "+usuarios[indice].conversationLevel);

    usuarios[indice].lastState = "incidenciasAbiertas";
    grupo = message_from_wit.entities.grupo;

    //Si falta el grupo
    if (typeof grupo == 'undefined') {

        usuarios[indice].ignoreIntent = true;
        if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 6;
        callback(200, "¿De qué grupo, GE o GO?");
        return;

    } else if (grupo[0].value == "GO") {

        var jql = "project = ABSISGO AND issuetype = Incidencia AND resolution =unresolved  AND \"Referencia externa\" ~ \"I*\"";
        if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 7;
        var grupo_txt = "Grupo Operaciones";

    } else if (grupo[0].value == "GE") {

        var jql = "project = ABSISGO AND issuetype = Incidencia AND resolution =unresolved AND \"Referencia externa\" ~ \"I*\" AND Responsable = GE";
        if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 8;
        var grupo_txt = "Grupo Evolución";

    } else {
        //Si no es undefined pero no es ni GE ni GO

        usuarios[indice].ignoreIntent = true;
        if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 6;
        callback(200, "¿De qué grupo, GE o GO?",lista);
        return;

    }

    ClienteJira.searchJQL(jql,function(error, respuesta_JIRA){

        if (respuesta_JIRA.total != 0 ) {

            usuarios[indice].ignoreIntent = true;
            usuarios[indice].lastState = "sacaListado";
            res = "Hay " + respuesta_JIRA.total + " incidencias abiertas en "+grupo_txt+". Quieres que saque un listado?";
            ClienteJira.crearLista(respuesta_JIRA, function (error, lista) {
                //console.log(lista);
                callback(200, res, lista);
            });

        } else {

            usuarios[indice].ignoreIntent = false;
            if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 0;
            res = "No hay incidencias abiertas en "+grupo_txt+", bien hecho! Para cualquier otra cosa no dudes en consultarme ;)";
            callback(200,res,lista);
        }

    });

}

module.exports = doWork;