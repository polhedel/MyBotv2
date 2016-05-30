var Client = require('node-rest-client').Client;

const config = require('../config');
const uri = require('../uri');


client = new Client();
// Provide user credentials, which will be used to log in to JIRA.
var loginArgs = {
    data: {
        "username": config.jira_username,
        "password": config.jira_username
    },
    headers: {
        "Content-Type": "application/json"
    }
};


client.post(config.jira_host + uri.session, loginArgs, function(data, response){
    if (response.statusCode == 200) {
        console.log('succesfully logged in, session:', data.session);
        var session = data.session;
        // Get the session information and store it in a cookie in the header
        var searchArgs = {
            headers: {
                // Set the cookie from the session information
                cookie: session.name + '=' + session.value,
                "Content-Type": "application/json"
            },
            data: {
                // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                //jql: "project = ABSISGO AND status = Implementación"
                jql: "project = ABSISGO AND issuetype = Incidencia AND resolution =unresolved  AND \"Referencia externa\" ~ \"P*\""
            }
        };
        /*
        // Make the request return the search results, passing the header information including the cookie.
        client.post("http://7.110.100.206:8080/rest/api/2/search", searchArgs, function(searchResult, response) {
            console.log('\nstatus code for search:', response.statusCode);
            console.log('search result:', searchResult);
        });*/
        /*
        client.post("http://7.110.100.206:8080/rest/api/2/project", function(data,response){
            console.log('\nstatus code for get all projects:', response.statusCode);
            console.log('search result: ', data);
        })*/

        var searchUser = {
            headers: {
                // Set the cookie from the session information
                cookie: session.name + '=' + session.value,
                "Content-Type": "application/json"
            },
            data: {
                // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                //username:"eadiegoc"
            }
        };
        /*
        client.get(config.jira_host + uri.issue + "?username=eadiegoc",searchUser,function(data,res){
            console.log('\nstatus code for username:', response.statusCode);
            console.log('search result: ', data);
        })*/

        /*
        client.get("http://7.110.100.206:8080/rest/api/2/project/CBPO",searchUser,function(data,res){
            console.log('\nstatus code for project:', response.statusCode);
            console.log('search result: ', data);
        })*/


        client.get(config.jira_host + uri.issue + "/ABSISGO-12013",searchUser,function(data,res){
            console.log('\nstatus code for issue:', res.statusCode);
            console.log('search result: ', data);
            console.log("Name: " + data.fields.summary);
            console.log("Asignado a: " + data.fields.assignee.displayName)
        });


    }
    else {
        throw "Login failed :(";
    }

});


