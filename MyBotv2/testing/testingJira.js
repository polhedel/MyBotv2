// With ES5
var JiraApi = require('jira-client');
const config = require('../config');

// Initialize
var jira = new JiraApi({
    protocol: 'http',
    host: "7.110.100.206",
    port: "8080",
    username: config.jira_username,
    password: config.jira_password,
    apiVersion: '2',
    strictSSL: false
});

jira.login()
    .then(function(login){
        console.log('Status: '+ login.fields.status.name);
    })
    .catch(function(err){
        console.error(err);
    });

/*
jira.findIssue('')
    .then(function(issue) {
        console.log('Status: ' + issue.fields.status.name);
    })
    .catch(function(err) {
        console.error(err);
    });

*/