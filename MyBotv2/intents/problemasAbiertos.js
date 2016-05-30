var ClienteJira = require('../clienteJira');
const config = require('../config');
var _ = require('underscore');


function doWork(message_from_wit, message_from_slack, usuarios, lista, callback){

    indice = _.findIndex(usuarios, {userId: message_from_slack.user});

    console.log("Problemas Abiertos");
    console.log("From Private: " + usuarios[indice].fromPrivate);
    console.log("User: "+usuarios[indice].userId +" Conversation level: "+usuarios[indice].conversationLevel);


    usuarios[indice].lastState = "problemasAbiertos";
    grupo = message_from_wit.entities.grupo;

    //Si falta el grupo
    if (typeof grupo == 'undefined') {

        usuarios[indice].ignoreIntent = true;
        if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 3;
        console.log("grupo = undefined, por tanto pregunto");
        callback(200, "¿De qué grupo, GE o GO?",lista);
        return;


    } else if (grupo[0].value == "GO") {

        var jql = "project = ABSISGO AND issuetype = Incidencia AND resolution =unresolved  AND \"Referencia externa\" ~ \"P*\"";
        if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 4;
        var grupo_txt = "Grupo Operaciones";
        console.log("grupo = GO")

    } else if (grupo[0].value == "GE") {

        var jql = "project = ABSISGO AND issuetype = Incidencia AND status in (Implementación, \"To Do\") AND \"Referencia externa\" ~ \"P*\" AND Responsable = GE";
        if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 5;
        var grupo_txt = "Grupo Evolución";
        console.log("grupo = GE")

    } else {
        //Si no es undefined pero no es ni GE ni GO

        usuarios[indice].ignoreIntent = true;
        if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 3;
        console.log("grupo = desconocido, por tanto vuelvo a preguntar");
        callback(200, "¿De qué grupo, GE o GO?");
        return;

    }

    ClienteJira.searchJQL(jql,function(error, respuesta_JIRA){

        if (respuesta_JIRA.total != 0 ) {

            usuarios[indice].ignoreIntent = true;
            usuarios[indice].lastState = "sacaListado";
            res = "Hay " + respuesta_JIRA.total + " problemas abiertos en "+grupo_txt+". Quieres que saque un listado?";
            ClienteJira.crearLista(respuesta_JIRA,function(error,lista){
                console.log(lista);
                callback(200,res,lista);
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
