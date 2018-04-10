const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio')
const codr = require('../codr');
const Parser = require('./parser');
const ERRORS = require('../errors');

class HackerrankParser extends Parser {
  constructor(directory, URL) {
    super(directory, URL);

    // set problemName
    this.problemName = (URL.match(/challenges\/[^\?\/]*/g) + '').substr(11);

  }

  clean(arr) {
    return _.map(arr, (data, i) => {
      let content = "";
      data.children.forEach(root => {
        let node = root;
        while (node.children && node.children.length > 0) {
          node = node.children[0];
        }
        if (node.data) {
          content += node.data;
        }
      });

      // Add a newline at the end of input if not already there
      if (content.charAt(content.length-1) != '\n')
        content += '\n';
      return content;
    });
  }

  parse() {
    let url = `https://www.hackerrank.com/rest/contests/master/challenges/${this.problemName}`;
    if (this.URL.match(/\/contests\//)) {
      const contest = (this.URL.match(/\/contests\/[^\?\/]*/g) + '').substr(9);
      url = `https://www.hackerrank.com/rest/contests/${contest}/challenges/${this.problemName}`;
    }
    axios.get(url)
      .then(({ data }) => {
        let $ = cheerio.load(data.model.body_html);
        const pres = $('pre');
         let cpp= [];
         let cpp14= [];
         let java= [];
         let java8= [];
         let python3= [];
         let haskell= [];
        cpp.push( data.model.cpp_template_head + data.model.cpp_template + data.model.cpp_template_tail);
        cpp14.push( data.model.cpp14_template_head + data.model.cpp14_template + data.model.cpp14_template_tail);
        java.push( data.model.java_template_head + data.model.java_template + data.model.java_template_tail); 
        java8.push( data.model.java8_template_head + data.model.java8_template + data.model.java8_template_tail); 
        python3.push( data.model.python3_template_head + data.model.python3_template + data.model.python3_template_tail); 
        haskell.push( data.model.haskell_template_head + data.model.haskell_template + data.model.haskell_template_tail); 

        let inputs = [];
        let outputs = [];

        _.forEach(pres, (data, i) => {
          if (i%2) outputs.push(data);
          else inputs.push(data);
        });

        // Checks if there are things to parse
        if (inputs.length === 0 && outputs.length === 0)
          return console.log(ERRORS.BAD_HACKERRANK_URL);

        // Calls the appropriate setup functions
        if (outputs.length) {
          this.inputs = this.clean(inputs);
          this.outputs = this.clean(outputs);
          this.cpp = cpp;
          this.cpp14 = cpp14;
          this.java= java;
          this.haskell= haskell;
          this.java8= java8;
          this.python3= python3;
        
          super.setup();
        } else console.log(ERRORS.UNABLE_TO_HANDLE);
      })
      .catch(e => {
        console.log("entrei");
        console.log(ERRORS.UNABLE_TO_FETCH);
      });
  }
}

module.exports = HackerrankParser;
