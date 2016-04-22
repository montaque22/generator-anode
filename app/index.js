/**
 * Created by mmontaque on 4/6/16.
 */
var generators = require('yeoman-generator');

camelize = function camelize(str) {
    return str.replace(/\W+(.)/g, function(match, chr)
    {
        return chr.toUpperCase();
    });
}

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
        var correct = camelize(NAME);


        this.fs.copyTpl(this.templatePath('client'), this.destinationPath(correct +'/client'),{name:correct});
        this.fs.copy(this.templatePath('.templates'), this.destinationPath(correct + '/.templates'));
        this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath(correct + '/gulpfile.js'));

        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath(correct + '/package.json'),
            {name:NAME}
        );
    }
});

