/**
 * Created by pol on 18/05/16.
 */
var Client = require('node-rest-client').Client;

const config = require('./config');
const uri = require('./uri');

function fecha(date){
    var newDate = date.slice(8,10) + '/' + date.slice(5,7) + '/' + date.slice(0,4);
    return newDate;
}


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

module.exports = {

    searchJQL: function (JQLstring, callback) {
        client.post(config.jira_host + uri.session, loginArgs, function (data, response) {
            if (response.statusCode == 200) {
                console.log('succesfully logged in JIRA');
                var session = data.session;
                // Get the session information and store it in a cookie in the header
                var searchArgs = {
                    headers: {
                        // Set the cookie from the session information
                        cookie: session.name + '=' + session.value,
                        "Content-Type": "application/json"
                    },
                    data: {
                        jql: JQLstring,
                        maxResults: 500,
                        //fields: "Summary"
                    }
                };

                // Make the request return the search results, passing the header information including the cookie.
                client.post(config.jira_host + uri.search + "/?expand=names", searchArgs, function (searchResult, response) {
                    console.log('status code for search:', response.statusCode, '\n');
                    //console.log('search result:', searchResult);
                    //console.log("Fields: " + searchResult.issues[0].name);
                    callback(response.statusCode, searchResult);
                });

            }
            else {
                callback(400, "Login failed");
            }

        });
    },

    crearLista: function (listaIssues, callback) {
        client.post(config.jira_host + uri.session, loginArgs, function (data, response) {
            if (response.statusCode == 200) {
                console.log('succesfully logged in JIRA');
                var session = data.session;
                // Get the session information and store it in a cookie in the header
                var searchArgs = {
                    headers: {
                        // Set the cookie from the session information
                        cookie: session.name + '=' + session.value,
                        "Content-Type": "application/json"
                    },
                    data: {
                        //jql: JQLstring,
                        //fields: "Summary"
                    }
                };

                var Lista = new Array();
                var lista = new Array();


                for (i in listaIssues.issues) {
                    //console.log(listaIssues.issues[i].key);
                    client.get(config.jira_host + uri.issue + "/" + listaIssues.issues[i].key, searchArgs, function (issue, res) {
                        //console.log('\nstatus code for issue:', res.statusCode);
                        //console.log('search result: ', issue);
                        //console.log("Name: " + data.fields.summary);

                        var fechaCreacion = fecha(issue.fields.created);
                        if (issue.fields.customfield_10005){var fechaInicio = fecha(issue.fields.customfield_10005);}
                        if (issue.fields.customfield_10006){var fechaCierre = fecha(issue.fields.customfield_10006);}
                        //console.log("Fecha Inicio: ", fechaInicio);
                        var horaCreacion = issue.fields.created.slice(11,16);

                        var listaObj = {issueID: issue.key,
                                        summary: issue.fields.summary,
                                        createdDate: fechaCreacion,
                                        createdTime: horaCreacion,
                                        fechaInicio: fechaInicio,
                                        fechaCierre: fechaCierre};

                        if(issue.fields.assignee) {
                            listaObj.assignee = issue.fields.assignee.displayName;
                        } else listaObj.assignee = "Sin asignar";
                        if(issue.fields.creator)  listaObj.creator = issue.fields.creator.displayName;


                        lista.push(listaObj);
                        //lista[lista.length-1].assignee = issue.

                        //console.log("ASSIGNEE: ",issue.fields.assignee.displayName);
                        //console.log("ISSUE: ",issue)

                        //Lista.push("\n\t" + issue.key + ": " + issue.fields.summary);

                        if (lista.length == listaIssues.issues.length) {
                            //console.log(Lista[0]);
                            //console.log(lista);
                            callback(200,lista);
                        }
                    });

                }

            }

        });
    }
}