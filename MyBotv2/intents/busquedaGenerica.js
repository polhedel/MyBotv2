var ClienteJira = require('../clienteJira');
const config = require('../config');
var _ = require('underscore');
var jsonfile = require('jsonfile');
var file = './usersJira.json';

function doWork(message_from_wit, message_from_slack, usuarios, lista, callback) {

    var indice = _.findIndex(usuarios, {userId: message_from_slack.user});


    jsonfile.readFile(file, function(err,obj){

        //console.log(obj.users);
        var usuariosJira = obj.users;
        //console.log("Usuarios Jira: " + usuariosJira);

        console.log("Búsqueda genérica");
        console.log("From Private: " + usuarios[indice].fromPrivate);
        console.log("User: " + usuarios[indice].userId + " Conversation level: " + usuarios[indice].conversationLevel);


        usuarios[indice].lastState = "busquedaGenerica";
        respuesta = message_from_wit.entities;

        var jql = "project = ABSISGO ";

        if (typeof respuesta != 'undefined') {

            if (typeof respuesta.assignee != 'undefined') {

                if (typeof respuesta.usuario == 'undefined'){

                    callback(400, "No tengo ningún usuario con ese nombre.");
                    return;


                } else {
                    var name = respuesta.usuario[0].value;
                    console.log("Name: ", name);
                    var i = _.findIndex(usuariosJira, {username: name});
                    if (i == -1){
                        callback(400, "No tengo ningún usuario con ese nombre.");
                        return;
                    }
                    console.log("indice en usersjira: ",i);
                    var userId = usuariosJira[i].userID;
                    console.log("El userId es: ", userId);
                    //var user = "jmoratat";
                    jql = jql + "AND assignee = " + userId;
                }

            }
            if (typeof respuesta.estado != 'undefined') {
                if (respuesta.estado[0].value == "abierto") {
                    var estado = "(Implementación, \"To Do\")"
                }
                if (respuesta.estado[0].value == "cerrado") {
                    var estado = "(Done,Closed)"
                }
                jql = jql + " AND status in " + estado;
            }
            if (typeof respuesta.info != 'undefined') {
                if (respuesta.info[0].value == "masDe") {
                    var created = "created<";
                    if (typeof respuesta.tiempo != 'undefined') {
                        if (respuesta.tiempo[0].value == "1 año") {
                            var cuando = "-365d"
                        }
                    }
                }
                jql = jql + "AND " + created + cuando;
            }

            /* status in (), assignee, issuetype resolution*/

            console.log("JQL mandado: " + jql);


            ClienteJira.searchJQL(jql, function (error, respuesta_JIRA) {

                if (error != 200) {
                    res = "Ha habido un error en la búsqueda en Jira, lo siento...";
                    callback(400, res, lista);
                } else if (respuesta_JIRA.total != 0) {

                    usuarios[indice].ignoreIntent = true;
                    usuarios[indice].lastState = "sacaListado";
                    if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 9;
                    res = "Hay " + respuesta_JIRA.total + " temas que responden a tus criterios, Quieres que saque un listado?";
                    ClienteJira.crearLista(respuesta_JIRA, function (error, lista) {
                        //console.log(lista);
                        callback(200, res, lista);
                    });
                } else {
                    usuarios[indice].ignoreIntent = false;
                    if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 0;
                    res = "No hay temas abiertos que respondan a esos criterios. Para cualquier otra cosa no dudes en consultarme ;)";
                    callback(200, res, lista);
                }
            });
        }


    });

}



module.exports = doWork;
