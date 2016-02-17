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
      type: 'confirm',
      name: 'includeJQuery',
      message: 'Would you like to include jQuery?',
      default: true
    },
    {
      when: function(responses) {
        return responses.includeJQuery;
      },
      type: 'input',
      name: 'jqueryVersion',
      message: 'jQuery Version?',
      default: 'latest'
    },
    {
      type: 'confirm',
      name: 'includeAngular',
      message: 'Would you like to include AngularJS?',
      default: true
    },
    {
      when: function(responses) {
        return responses.includeAngular;
      },
      type: 'input',
      name: 'angularVersion',
      message: 'AngularJS Version?',
      default: 'latest'
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
    },
    {
      type: 'confirm',
      name: 'includeItcss',
      message: 'ITCSS metodology?',
      default: true
    },
    {
      when: function(responses) {
        return responses.includeItcss;
      },
      type: 'list',
      name: 'css',
      message: 'Which type of css would you like to use?',
      choices: [{
        name: 'SCSS',
        value: 'includeSCSS'
      },{
        name: 'Less',
        value: 'includeLess'
      },{
        name: 'Stylus',
        value: 'includeStylus'
      },{
        name: 'None',
        value: ''
      }]
    },
    {
      when: function(responses) {
        return !responses.includeItcss;
      },
      type: 'list',
      name: 'css',
      message: 'Which type of css would you like to use?',
      choices: [{
        name: 'SCSS',
        value: 'includeSCSS'
      },{
        name: 'Less',
        value: 'includeLess'
      },{
        name: 'Stylus',
        value: 'includeStylus'
      },{
        name: 'None',
        value: ''
      }]
    },
    {
      type: 'confirm',
      name: 'includeCommonjs',
      message: 'CommonJS library?',
      default: true
    }];

    this.prompt(prompts, function(answers) {
      var features = answers.features;

      this.props = answers;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.taskRunner       = answers.taskRunner;
      this.css              = answers.css;
      this.includeJQuery    = answers.includeJQuery;
      this.jqueryVersion    = answers.jqueryVersion;
      this.includeAngular   = answers.includeAngular;
      this.angularVersion   = answers.angularVersion;
      this.includeItcss     = answers.includeItcss;
      this.includeCommonjs  = answers.includeCommonjs;

      done();
    }.bind(this));

  },

  writing: {
    editorConfig: function () {
      this.fs.copy(
        this.templatePath('dot/editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    git: function () {
      this.fs.copy(
        this.templatePath('dot/gitignore'),
        this.destinationPath('.gitignore')
      );

      this.fs.copy(
        this.templatePath('dot/gitattributes'),
        this.destinationPath('.gitattributes')
      );
    },

    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          name: this.props.name,
          taskRunner: this.taskRunner,
          includeJQuery: this.includeJQuery,
          includeAngular: this.includeAngular,
          jqueryVersion: this.jqueryVersion,
          angularVersion: this.angularVersion
        }
      )
    },

    bower: function() {
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'), {
          name: this.props.name,
          includeItcss: this.includeItcss,
          includeCommonjs: this.includeCommonjs
        }
      );
      this.fs.copy(
        this.templatePath('dot/bowerrc'),
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
            this.templatePath('gruntjs/Gruntfile.js'),
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
            this.templatePath('gulpjs/Gulpfile.js'),
            this.destinationPath('Gulpfile.js')
          );
          this.fs.copy(
            this.templatePath('gulpjs/default.js'),
            this.destinationPath('source/tasks/gulpjs/default.js')
          );
          break;
      }
    },

    css: function () {

      if(this.includeItcss) {
        switch(this.css) {
          case 'includeSCSS':
            mkdirp('source/assets/scss');
            this.fs.copy(
              this.templatePath('itcss/scss/style.scss'),
              this.destinationPath('source/assets/scss/style.scss')
            );

            break;
          case 'includeLess':
            mkdirp('source/assets/less');
            this.fs.copy(
              this.templatePath('itcss/less/style.less'),
              this.destinationPath('source/assets/less/style.less')
            );

            break;
          case 'includeStylus':
            mkdirp('source/assets/styl');
            this.fs.copy(
              this.templatePath('itcss/styl/style.styl'),
              this.destinationPath('source/assets/styl/style.styl')
            );

            break;
        }
      } else {
        switch(this.css) {
          case 'includeSCSS':
            mkdirp('source/assets/scss');

            break;
          case 'includeLess':
            mkdirp('source/assets/less');

            break;
          case 'includeStylus':
            mkdirp('source/assets/styl');

            break;
          default:
            mkdirp('source/assets/css');

            break;
        }
      }
    },

    robots: function () {
      this.fs.copy(
        this.templatePath('robots.txt'),
        this.destinationPath('robots.txt')
      );
    }
  },
  install: function () {
    this.installDependencies();
  },

  end: function () {

  }
});
