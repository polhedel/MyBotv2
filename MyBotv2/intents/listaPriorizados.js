var ClienteJira = require('../clienteJira');
const config = require('../config');
var _ = require('underscore');


function doWork(message_from_wit, message_from_slack, usuarios, lista, callback){

    var indice = _.findIndex(usuarios, {userId: message_from_slack.user});

    console.log("Lista Priorizados");
    console.log("From Private: " + usuarios[indice].fromPrivate);
    console.log("User: "+ usuarios[indice].userId +" Conversation level: "+usuarios[indice].conversationLevel);


    usuarios[indice].lastState = "listaPriorizados";

    var jql = "project = ABSISGO AND status in (Implementación, \"To Do\") AND labels = Priorizado  ORDER BY Estado ASC"
    if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 0;

    ClienteJira.searchJQL(jql,function(error,respuesta_JIRA){

        if (respuesta_JIRA.total != 0) {

            res = "Hay " + respuesta_JIRA.total + " priorizados abiertos en Grupo Operaciones: \n";

            ClienteJira.crearLista(respuesta_JIRA, function (error,lista){
                for (i in lista){
                    res = res + "\n\t" + lista[i].issueID + ": " + lista[i].summary;
                    //"\n\t\t Asignado a: " + lista[i].assignee;
                }
                res = res + "\n\nQuieres ver alguna información más de dicha lista?";
                usuarios[indice].ignoreIntent=true;
                usuarios[indice].lastState = 'muestraInfo';
                callback(200,res,lista);
            });


        } else {

            usuarios[indice].ignoreIntent = false;
            res = "No hay priorizados abiertos en Grupo Operaciones, bien hecho! Para cualquier otra cosa no dudes en consultarme ;)";
            callback(200,res,lista);

        }
    });

}

module.exports = doWork;