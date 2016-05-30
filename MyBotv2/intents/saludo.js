var _ = require('underscore');




function doWork(message_from_wit, message_from_slack, usuarios, lista, callback){

    indice = _.findIndex(usuarios, {userId: message_from_slack.user});

    if ( usuarios[indice].fromPrivate || typeof message_from_wit.entities.bot != 'undefined') {
        if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 1;
        usuarios[indice].responder = true;
        usuarios[indice].lastState = "saludo";
        callback(200,"¡Hola! ¿En qué puedo ayudarte?",lista);
    }
    else callback(200,"");
}

module.exports = doWork;