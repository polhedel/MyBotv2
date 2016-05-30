'use strict';

const LEVELS = {
  DEBUG: 0,
  LOG: 1,
  WARN: 2,
  ERROR: 3,
};

const log = function(message, label){
  console.log(
    label ? '[' + label + '] ' + message : message
  );
}

const Logger = function(lvl) {
  this.level = lvl === undefined ? LEVELS.LOG : lvl;

  this.debug = function(message){
    if (LEVELS.DEBUG >= this.level) {
      log(message, 'debug');
    }
  };

  this.log = function(message){
    if (LEVELS.LOG >= this.level) {
      log(message);
    }
  };

  this.warn = function(message){
    if (LEVELS.WARN >= this.level) {
      log(message, 'warn');
    }
  };

  this.error = function(message){
    if (LEVELS.ERROR >= this.level) {
      log(message, 'error');
    }
  };
};

module.exports = {
  Logger: Logger,
  logLevels: LEVELS,
};
