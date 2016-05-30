'use strict';

const Wit = require('../').Wit;

const token = "Z66MZ5V237BRKST65W5O2HAZVXP3OXEZ";

const actions = {
  say: (sessionId, msg, cb) => {
    console.log(msg);
    cb();
  },
  merge: (context, entities, cb) => {
    cb(context);
  },
  error: (sessionid, msg) => {
    console.log('Oops, I don\'t know what to do.');
  },
};

const client = new Wit(token, actions);

client.message('Hola desde node',(error,data)=>{
  if (error){
    console.log('Ups! He trobat un error: '+error);
  }else {
    console.log('Oh yeah! Respota de wit.ai', + data.msg_id);
  }
});
