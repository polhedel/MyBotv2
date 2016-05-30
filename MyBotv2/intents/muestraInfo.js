var _ = require('underscore');




function doWork(message_from_wit, message_from_slack, usuarios, lista, callback){

    indice = _.findIndex(usuarios, {userId: message_from_slack.user});

    var respuesta = message_from_wit.entities;


    if (typeof respuesta != 'undefined') {

        //console.log(respuesta);
        if (typeof respuesta.sino != 'undefined'){
            if (respuesta.sino[0].value == "no") {
                usuarios[indice].ignoreIntent = false;
                usuarios[indice].conversationLevel = 0;
                callback(200, "Perfecto, que vaya bien el día! Para cualquier otra cosa no dudes en consultarme ;)");

            } else {

                res = "De acuerdo, que quieres ver? (Asignado a/Creador/Fecha de creación/Fecha de inicio/Fecha de cierre)"
                callback(200, res,lista);

            }
        } else {
            //console.log(lista);

            usuarios[indice].ignoreIntent = true;
            usuarios[indice].lastState = "muestraInfo";
            usuarios[indice].conversationLevel++;
            //console.log ("Saca listado, lista: ",_.sortBy(lista,'issueID'));
            lista = _.sortBy(lista,'issueID');
            res = "Aqui tienes el listado: \n";

            console.log("Created? "+respuesta.created);

            for (i in lista){
                res = res + "\n\t" + lista[i].issueID + ": " + lista[i].summary;
                if(typeof  respuesta.created !='undefined') { res = res + "\n\t\t Creado el: " + lista[i].createdDate;}
                if(typeof respuesta.assignee != 'undefined') { res = res + "\n\t\t Asignado a: "+ lista[i].assignee;}
                if(typeof respuesta.creator != 'undefined') { res = res + "\n\t\t Creado por: "+ lista[i].creator;}
                if(typeof respuesta.fechaInicio != 'undefined'){ res = res + "\n\t\t Fecha de inicio: "+ lista[i].fechaInicio;}
                if(typeof respuesta.fechaCierre != 'undefined'){ res = res + "\n\t\t Fecha de cierre: "+ lista[i].fechaCierre;}
            }

            res = res + "\n\nQuieres ver alguna información más de dicha lista?";

            callback(200, res,lista);


        }


    } else callback(200, "Perdona, no te he entendido, quieres ver alguna información más?", lista);

}

module.exports = doWork;