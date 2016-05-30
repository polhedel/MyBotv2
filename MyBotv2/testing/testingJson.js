/**
 * Created by pol on 23/05/16.
 */
var jsonfile = require('jsonfile')
var _ = require('underscore')
var file = '../usersJira.json'

jsonfile.readFile(file, function(err,obj){


    //obj.users.push({"userID": 456,"username": "gerard"})
    console.log(obj.users);
    var res = _.findIndex(obj.users,{username: 'Jorge Morata'});
    console.log(res);
    console.log(obj.users[res].userID);
    //jsonfile.writeFile(file,obj,{spaces:2},function(err){
        //console.error(err)
    //})
    //console.log(obj.data["1"].username4)
})

