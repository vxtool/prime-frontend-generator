'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  askFor: function() {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname
    },
    {
      type: 'list',
      name: 'taskRunner',
      message: 'Which task runner would you like to use?',
      choices: [{
        name: 'GruntJS',
        value: 'includeGrunt'
      },{
        name: 'GulpJS',
        value: 'includeGulp'
      },{
        name: 'None',
        value: ''
      }]
    }];

    this.prompt(prompts, function(answers) {
      var features = answers.features;

      this.props = answers;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.taskRunner = answers.taskRunner;

      done();
    }.bind(this));

  },

  writing: {
    editorConfig: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );

      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes')
      );
    },

    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          taskRunner: this.taskRunner,
          name: this.props.name
        }
      )
    },

    config: function() {
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'), {
          name: this.props.name
        }
      );
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },

    misc: function () {
      mkdirp('source');
      mkdirp('source/assets');
    },

    taskRunner: function () {
      mkdirp('source/tasks');

      switch(this.taskRunner) {
        case 'includeGrunt':
          mkdirp('source/tasks/gruntjs');
          this.fs.copy(
            this.templatePath('Gruntfile.js'),
            this.destinationPath('Gruntfile.js')
          );
          this.fs.copy(
            this.templatePath('gruntjs/aliases.yaml'),
            this.destinationPath('source/tasks/gruntjs/aliases.yaml')
          );
          break;
        case 'includeGulp':
          mkdirp('source/tasks/gulpjs');
          this.fs.copy(
            this.templatePath('Gulpfile.js'),
            this.destinationPath('Gulpfile.js')
          );
          this.fs.copy(
            this.templatePath('gulpjs/default.js'),
            this.destinationPath('source/tasks/gulpjs/default.js')
          );
          break;
      }
    }
  },
  install: function() {
    this.installDependencies();
  }
});
