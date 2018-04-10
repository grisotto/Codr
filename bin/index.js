#!/usr/bin/env node
const config_manager = require('../lib/config_manager');
const codr = require('../lib/codr');
const argv = require('minimist')(process.argv.slice(2)
,{
    string: ["l", "h", "r"],
    alias: { h: 'help', r: 'runscript', t: 'template', l: 'language' }
}

);
const fs = require('fs-extra');
const ERRORS = require('../lib/errors');
const allLanguages = 
      [ 'c',
        'clojure',
        'cpp',
        'cpp14',
        'csharp',
        'erlang',
        'go',
        'haskell',
        'java',
        'java8',
        'javascript',
        'kotlin',
        'lua',
        'objectivec',
        'perl',
        'php',
        'pypy',
        'python',
        'pypy3',
        'python3',
        'ruby',
        'scala',
        'swift' ];
const main = () => {
  if (argv.h || argv.help) {

    // show help file
    fs.readFile(
      `${__dirname}/help`,
      { encoding: 'utf8' },
      (err, text) => {
        console.log(text);
      }
    );

  } else if (argv.t || argv.template) {

    // set template
    const path =  argv.t || argv.template;

    //if (!path == false) return console.log(ERRORS.NO_PATH);
    if (path === 'default') return config_manager.setFile('template', path);
    else if (!fs.existsSync(path)) return console.log(ERRORS.INVALID_PATH);
    config_manager.setFile('template', path);

  } else if (argv.r || argv.runscript) {

    // set runscript
    const path =  argv.r || argv.runscript;

    //if (!path == false) return console.log(ERRORS.NO_PATH);
    if (path === 'default' || path === 'off') return config_manager.setFile('runscript', path);
    else if (!fs.existsSync(path)) return console.log(ERRORS.INVALID_PATH);
    config_manager.setFile('runscript', path);

  //} else if (argv.l || argv.language) {

    // set language
    //languages = argv.l || argv.language; 

    //if (!path == false)return console.log(ERRORS.NO_LANGUAGE);
    // language can be one or less than three
    //console.log(languages[0]);
    //for(var i in languages){
    //if (allLanguages.indexOf(i)) console.log(i +"achou alguem");
    //return console.log("para");
    //config_manager.setFile('runscript', languages );
    //}
  } else {

    // extract data
    if (argv._.length > 2) return console.log(ERRORS.TOO_MANY_ARGUMENTS);

    // parse args
    const [directory, URL] = argv._;
    if (!directory) return console.log(ERRORS.NO_EXTRACT_ARGUMENTS);
    if (!URL) return codr.extract(directory, 'program')
    try {
      codr.extract(directory, URL);
    } catch (e) {
      console.log(e);
    }

  }
}

main();
