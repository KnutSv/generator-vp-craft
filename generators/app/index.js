'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var unzip = require('unzip');
var http = require('http');
var fs = require('fs');
var request = require('request');
var chalk = require('chalk');
var mv = require('mv');
var rmdir = require('rmdir');

var minimeeVersion = '0.9.8';

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ace ' + chalk.red('generator-vp-craft') + ' generator!'
    ));

    var prompts = [
      // {
      //   type: 'confirm',
      //   name: 'someAnswer',
      //   message: 'Would you like to enable this option?',
      //   default: true
      // }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    // this.fs.copy(
    //   this.templatePath('dummyfile.txt'),
    //   this.destinationPath('dummyfile.txt')
    // );
  },

  install: function () {
    var files   = this.expandFiles('**/*', { cwd: this.sourceRoot(), dot: true });
    var that    = this;
    // var ignores = [
    //   '.git',
    //   'LICENSE',
    //   'README.md',
    // ];

    this.installDependencies();

    console.log(chalk.blue('Downloading craft ...'));
    request('http://buildwithcraft.com/latest.zip?accept_license=yes')
      .pipe(unzip.Extract({ path: './' }))
      .on('close', function () {
        console.log(chalk.green('Craft downloaded'));

        files.forEach(function(file) {
          // if (ignores.indexOf(file) !== -1) {
          //   return;
          // }

          that.bulkCopy(file, file);
        }, this);
        fs.rename('public', 'public_html');

        console.log(chalk.green('Files copied'));
      });
      
    request('http://github.com/johndwells/craft.minimee/archive/v' + minimeeVersion + '.zip')
      .pipe(unzip.Extract({ path: 'craft/plugins' }))
      .on('error', function(error) {
        console.log(chalk.red('Error: ' + error));
      })
      .on('close', function () {
        console.log(chalk.green('Minimee downloaded'));

        mv('craft/plugins/craft.minimee-' + minimeeVersion + '/minimee', 'craft/plugins/minimee', {mkdirp: true},  function(error) {
          if(error) {
            console.log(chalk.red(error));
          }
          rmdir('craft/plugins/craft.minimee-' + minimeeVersion);
        });
      });

  }
});
