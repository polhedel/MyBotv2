var _ = require('underscore');




function doWork(message_from_wit, message_from_slack, usuarios, lista, callback){

    indice = _.findIndex(usuarios, {userId: message_from_slack.user});

    if ( usuarios[indice].fromPrivate || usuarios[indice].conversationLevel > 0) {

        usuarios[indice].lastState = "queDiaEs";
        usuarios[indice].conversationLevel=1;

        //Si falta el datetime
        if (typeof message_from_wit.entities.datetime == 'undefined' && usuarios[indice].conversationLevel>0) {

            usuarios[indice].ignoreIntent = true;
            if (!usuarios[indice].fromPrivate) usuarios[indice].conversationLevel = 2;
            callback(200,"Hoy, mañana, o ayer?");

        } else {

            var res = message_from_wit.entities.datetime["0"].value;
            var fecha = res.slice(8, 10) + '/' + res.slice(5, 7) + '/' + res.slice(0, 4);

            usuarios[indice].ignoreIntent = false;
            usuarios[indice].conversationLevel = 0;
            callback(200, fecha);

        }
    }
}

module.exports = doWork;