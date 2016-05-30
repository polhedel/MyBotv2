var _ = require('underscore');




function doWork(message_from_wit, message_from_slack, usuarios, lista, callback){

    indice = _.findIndex(usuarios, {userId: message_from_slack.user});

    if ( usuarios[indice].fromPrivate || typeof message_from_wit.entities.bot != 'undefined'){

        usuarios[indice].lastState = "manual";
        callback(200,"¡Hola! Puedes preguntarme cosas del estilo:" +
            "\n\t¿Cuántos problemas hay abiertos?" +
            "\n\t¿Cuántas incidencias hay abiertas? " +
            "\n\t¿Cuántas consultas hay abiertas?" +
            "\n\t¿Cuántos priorizados hay?" +
            "\n\t¿Cuántas peticiones hay?" +
            "\n\tMuéstrame todos los temas abiertos asignados a ...");
        usuarios[indice].conversationLevel = 0;
    }
}

module.exports = doWork;