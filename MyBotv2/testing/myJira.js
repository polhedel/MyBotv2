/**
 * Created by pol on 10/05/16.
 */
var request = require('request');
const config = require('../config');

request.post(
    'http:///7.110.100.206:8080/rest/auth/1/session',
    {
        "username":config.jira_username,
        "password":config.jira_password
    },
    function (error, response, body) {
        //console.log(response);
        console.log(body)
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    });

