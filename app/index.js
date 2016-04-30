/**
 * Created by mmontaque on 4/6/16.
 */
var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var sugar = require('sugar');

var isDevMode = false;

camelize = function camelize(str) {
    return str.replace(/\W+(.)/g, function(match, chr)
    {
        return chr.toUpperCase();
    });
};

module.exports = generators.Base.extend({
    projectName: function () {
        var done  = this.async();

        this.prompt({
            type: 'input',
            name: 'project_name',
            message: 'Your project name',
            default: 'Angular App'
        }, function(answer){
            this.config.set('project', answer.project_name);
            this.config.save();
            done()
        }.bind(this))

    },
    writing: function () {
        var NAME    = this.config.get('project');
        var path    = isDevMode ? camelize(NAME).replace(/[^a-zA-Z ]/g, "") : '.';
        var correct = camelize(NAME).replace(/[^a-zA-Z ]/g, "");

        this.fs.copyTpl(this.templatePath('client'), this.destinationPath(path +'/client'),{name:correct});
        this.fs.copy(this.templatePath('.templates'), this.destinationPath(path + '/.templates'));
        this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath(path + '/gulpfile.js'));

        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath(path + '/package.json'),
            {name:correct}
        );

        mkdirp.sync(this.destinationPath(path + '/client/views/components'));
        mkdirp.sync(this.destinationPath(path + '/client/views/pages'));
        mkdirp.sync(this.destinationPath(path + '/client/js/custom'));
        mkdirp.sync(this.destinationPath(path + '/client/js/exclude'));
        mkdirp.sync(this.destinationPath(path + '/client/js/factories'));
        mkdirp.sync(this.destinationPath(path + '/client/js/filters'));
        mkdirp.sync(this.destinationPath(path + '/client/js/services'));
        mkdirp.sync(this.destinationPath(path + '/client/js/vendors'));
        mkdirp.sync(this.destinationPath(path + '/client/fonts'));
        mkdirp.sync(this.destinationPath(path + '/client/images'));
    }
});

