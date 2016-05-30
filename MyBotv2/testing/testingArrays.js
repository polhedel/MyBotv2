/**
 * Created by pol on 17/05/16.
 */

function usuario(userId, username, ignoreIntent, lastState, conversationLevel){
    this.userId = userId;
    this.username = username;
    this.ignoreIntent = ignoreIntent;
    this.lastState = lastState;
    this. conversationLevel = conversationLevel;
}

var numUsuarios = 0;

var usuariosID = new Array;
var usuarios = new Array;

usuariosID.push(123);
usuarios[numUsuarios++] = new usuario(123,"Pol","saludo",0);

usuariosID.push(345);
usuarios[numUsuarios++] = new usuario(345,"Gerard","saludo",0);

var pos = usuariosID.indexOf(35);
/*
console.log(usuarios);
console.log(usuariosID);
console.log(pos);
console.log(usuarios[pos]);*/
/*
var ClienteJira = require('../clienteJira');

var data;
var issueList = ["ABSISGO-6871","ABSISGO-4603","ABSISGO-11727"];
var issues = [];

ClienteJira.searchJQL("project = ABSISGO AND issuetype = Incidencia AND status in (Implementación, \"To Do\") AND \"Referencia externa\" ~ \"P*\" AND Responsable = GE",function(error,res){
    console.log(res);
    ClienteJira.crearLista(res, function(error,lista){
        console.log(lista);

    });
});*/

var listaIssues = new Array();

listaIssues.push(new Object());
listaIssues[0].issuename ="nombre";
listaIssues[0].assingee = "asignado";
listaIssues.push(new Object());
listaIssues[listaIssues.length-1].issuename ="nombre2";
listaIssues[listaIssues.length-1].assingee = "asignado2";

console.log(listaIssues);




