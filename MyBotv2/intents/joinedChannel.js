var jsonfile = require('jsonfile');
var _ = require('underscore');
var file = './users.json';


function doWork(message_from_wit, message_from_slack, usuarios, lista, callback){

    indice = _.findIndex(usuarios, {userId: message_from_slack.user});

    usuarios[indice].responder = true;
    usuarios[indice].conversationLevel=0;

    var nuevoUsuario = message_from_wit.outcomes["0"].entities.username["0"].value;

    jsonfile.readFile(file, function(err,obj){

        console.log(obj);
        //obj.users.push({"userID" : "userID", "username": "username" })
        var index = _.findIndex(obj.users, {userID: message_from_slack.user});
        console.log(index);

        if(index == -1) {
            console.log("Añado usuario");
            obj.users.push({"userID" : message_from_slack.user, "username": nuevoUsuario });
            console.log(obj);
            jsonfile.writeFileSync(file,obj,{spaces:2});
        }

        res = "Bienvenido " + nuevoUsuario + "! Si quieres preguntarme algo sólo tienes que saludarme " +
             "primero, un \"Hola Bot\" (o similares) es suficiente ;) Saludos!";

        callback(200,res);
        });
}

module.exports = doWork;