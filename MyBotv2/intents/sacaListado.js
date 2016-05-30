var _ = require('underscore');




function doWork(message_from_wit, message_from_slack, usuarios, lista, callback){

    indice = _.findIndex(usuarios, {userId: message_from_slack.user});


    var respuesta = message_from_wit.entities.sino;


    if (typeof respuesta != 'undefined') {

        respuesta = respuesta[0].value;
        //console.log(respuesta);

        if (respuesta == "no") {
            usuarios[indice].ignoreIntent = false;
            usuarios[indice].conversationLevel = 0;
            callback(200, "Perfecto, que vaya bien el día! Para cualquier otra cosa no dudes en consultarme ;)");

        } else if (respuesta == "si") {
            //console.log(lista);

            if (typeof lista == 'undefined') {
                usuarios[indice].ignoreIntent = false;
                usuarios[indice].conversationLevel = 0;
                callback(400, "Ha habido un error durante la extracción de la información. No se ha podido obtener la lista. Lo siento :_(")
            } else {
                usuarios[indice].ignoreIntent = true;
                usuarios[indice].lastState = "muestraInfo";
                usuarios[indice].conversationLevel = 12;
                //console.log ("Saca listado, lista: ",_.sortBy(lista,'issueID'));
                lista = _.sortBy(lista,'issueID');
                res = "Aqui tienes el listado: \n";

                for (i in lista){
                    res = res + "\n\t" + lista[i].issueID + ": " + lista[i].summary;
                    //"\n\t\t Asignado a: " + lista[i].assignee;
                }

                res = res + "\n\nQuieres ver alguna información más de dicha lista? (Asignado a/Creador/Fecha de creación/Fecha de inicio/Fecha de cierre)"

                callback(200, res,lista);
            }

        }


    } else callback(200, "Perdona, no te he entendido, quieres un listado, sí o no?", lista);

}

module.exports = doWork;