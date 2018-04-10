const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio')
const fs = require('fs-extra');
const path = require('path');
let CONFIG = require('../config.json');
const ERRORS = require('../errors');

// GlOBAL VARIABLES
const TEMPLATE_FILE = CONFIG.template;
const RUN_SCRIPT = CONFIG.runscript;

class Parser {
  constructor(directory, URL) {
    this.directory = directory;
    this.URL = URL;

    // TO BE SET BY SUBCLASS
    this.problemName = URL;
    this.inputs = [''];
    this.outputs = [''];
    this.cpp= [''];
    this.cpp14= [''];
    this.java= [''];
    this.java8= [''];
    this.python3= [''];
    this.haskell= [''];
    //this.template = [''];
  }

  createFiles(destDir, arr, prefix) {
    // iterate each element
    arr.forEach((content, i) => {
      // write file to directory
    if (prefix == 'in' ||  prefix == 'out') {
      fs.writeFile(`${destDir}/${i+1}.${prefix}`, content, (err) => {
          if (err) return console.log(err);
      });
    } else {
      fs.writeFile(`${destDir}/${prefix}`, content, (err) => {
          if (err) return console.log(err);
      });
    }

    });
  }

  setup() {
    // Check if need to create container directory
    if (!fs.existsSync(this.directory))
      fs.mkdirSync(this.directory);

    const destDir = path.join(this.directory, this.problemName);
    // Check if can create problem directory
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);
    else return console.log(ERRORS.PROBLEM_FOLDER_EXIST);

    this.createFiles(destDir, this.inputs, 'in');
    this.createFiles(destDir, this.outputs, 'out');
    this.createFiles(destDir, this.cpp,  'Solution.cpp');
    this.createFiles(destDir, this.cpp14, 'Solution-14.cpp');
    this.createFiles(destDir, this.java, 'Solution-7.java');
    this.createFiles(destDir, this.java8, 'Solution.java');
    this.createFiles(destDir, this.python3, 'Solution3.py');
    this.createFiles(destDir, this.haskell, 'Solution.hs');

    //fs.copy(`${__dirname}/../${TEMPLATE_FILE}`, path.join(destDir, `${this.problemName}${path.extname(TEMPLATE_FILE)}`));
    fs.copy(`${__dirname}/../${TEMPLATE_FILE}`, path.join(destDir, 'Makefile'));
    if (RUN_SCRIPT !== 'off')
      fs.copy(`${__dirname}/../${RUN_SCRIPT}`, path.join(destDir, (RUN_SCRIPT === 'codr_default_runscript.sh' ? 'test.sh' : RUN_SCRIPT)));
  }

  parse() {
    this.setup();
  }
}

module.exports = Parser;
