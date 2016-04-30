/*
 Gulp file for test-project
 created by  : richard sprince
 date        : 7 jan 2016
 */

// Load plugins, set to variables
var $           = require('gulp-load-plugins')();
var gulp        = $.param(require('gulp'), process.argv);
var vinylPaths  = require('vinyl-paths');
var del         = require('del');
var browserSync = require('browser-sync').create();
var sugar       = require('sugar'); //additional js functionality
var recursive   = require('recursive-readdir');
var runSequence = require('run-sequence');
var fs          = require('fs');
var Q           = require('q');


var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

// Application variables
var APP_ROOT    = "./client/";
var BUILD_ROOT  = './build/';
var MAIN_SASS   = "main.scss";
var MAIN_INDEX  = "index.html";
var templates   = {
    DIRECTIVE   : ".templates/directives.js",
    CONTROLLER  : ".templates/controller.js",
    HTML        : ".templates/view.html",
    STYLES      : ".templates/style.scss",
    SERVICES    : ".templates/services.js/",
    FACTORIES   : ".templates/factory.js/",
    FILTERS     : ".templates/filters.js/",
    PROVIDERS   : ".templates/provider.js/",
};
var paths       = {
    STYLES      : APP_ROOT + "styles/",
    SASS        : APP_ROOT + "styles/sass/",
    COMPONENTS  : APP_ROOT + "views/components/",
    PAGES       : APP_ROOT + "views/pages/",
    VIEWS       : APP_ROOT + "views/",
    SERVICES    : APP_ROOT + "js/services/",
    FACTORIES   : APP_ROOT + "js/factories/",
    FILTERS     : APP_ROOT + "js/filters/",
    PROVIDERS   : APP_ROOT + "js/providers/",
    JS          : APP_ROOT + "js/",
    INIT        : APP_ROOT + "js/init/",
    VENDOR      : APP_ROOT + "js/vendors/",
    EXCLUDE     : APP_ROOT + "js/exclude/",
    CUSTOM      : APP_ROOT + "js/custom/",
    FONTS       : APP_ROOT + "fonts/",
    IMAGES      : APP_ROOT + "images/"
};



// SASS to CSS Task
gulp.task('sass', function(cb){


    // read the file
    return  gulp.src(paths.SASS + MAIN_SASS)

        // Glob all the files into the main scss file
        .pipe($.globber({
            source: [paths.COMPONENTS, paths.PAGES],
            rename: MAIN_SASS
        }))
        .on('error',function(err){
            console.log(err)
        })

        // Compile it
        .pipe($.sass(sassOptions).on('error', $.sass.logError))

        // save it
        .pipe(gulp.dest(paths.STYLES))

        // update CSS
        .pipe(browserSync.stream());

});


/**
 * Javascript needs to be injected so we can make sure we can have them in the right order
 */
gulp.task('inject',function(){
    // excludes the exclude folder for production purposes
    return inject();
});

/**
 * Javascript needs to be injected so we can make sure we can have them in the right order
 */
gulp.task('inject:dev',function(){

    // includes the excluded files for development purposes
    return inject(true);
});

gulp.task('html',function(){

    return gulp.src([APP_ROOT + '**/*.html'],{base:APP_ROOT})
        .pipe($.plumber({
            errorHandler:function(error){
                console.log('HTML Task encountered an error');
                console.log(error.message);
                this.emit('quit')
            }
        }))
        .pipe($.useref())
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe($.if('*.html', $.minifyHtml({
            conditionals:true,
            loose:true
        })))
        .on('quit',function(){

        })

        .pipe(gulp.dest(BUILD_ROOT))
});

/**
 * @function
 * 'gulp watch' will watch all the files for changes
 */
gulp.task('watch', function(){

    browserSync.init({
        server: APP_ROOT
    });

    gulp.watch(APP_ROOT + '**/*.scss', ['sass']);

    gulp.watch([
        APP_ROOT + '**/*.html',
        APP_ROOT + '**/*.js'], browserSync.reload);

    gulp.watch( APP_ROOT + '**/*', function(evt){
        switch(evt.type){
            case 'added':
            case 'deleted':
            case 'renamed':
                runSequence('inject:dev');
                break
        }
    })

});



/**
 * @function
 * 'gulp generate' will create all basic files that would need to be added to the project.
 * It takes the signature gulp generate --<filetype> <filename> For Example:
 * @example
 * // The following will create a component (directive) called timeLord.
 * // Components contain an associated HTML, SCSS, and JS file which are all copied to views/components/timeLord
 * gulp generate --component timeLord
 *
 * @example
 * // The following will create a page (controller) called dashboard.
 * // Pages contain an associated HTML, SCSS, and JS file which are all copied to views/pages/dashboard
 * // Only for generating Pages is there an optional parameter 'route' that can be used.
 * // In this particular example the dashboard page will be accessible through the url route 'home'
 * //(localhost:3000/#/home)
 * // Otherwise the route will default to the name of the page (localhost:3000/#/dashboard
 * gulp generate --page dashboard [--route home]
 *
 * Other filestypes that can be generated are 'service | factory | filter' and created using the parameters respectively
 * @example
 * gulp generate --service errorManagement
 *
 * @example
 * gulp generate --factory compilations
 */
gulp.task('generate', function(page, component, service, factory, filter, route, provider){

    var promises = [];

    if(page){
        promises.push(abstractGenerator(
            {name: page, templateKey:'CONTROLLER', locationKey:'PAGES', route: route || page, extraFolder: true},
            {name: page, templateKey:'HTML', locationKey:'PAGES', extraFolder: true},
            {name: page, templateKey:'STYLES', locationKey:'PAGES', extraFolder: true}));
    }

    if(component){
        promises.push(abstractGenerator(
            {name: component, templateKey:'DIRECTIVE', locationKey:'COMPONENTS', extraFolder: true},
            {name: component, templateKey:'HTML', locationKey:'COMPONENTS', extraFolder: true},
            {name: component, templateKey:'STYLES', locationKey:'COMPONENTS', extraFolder: true}));
    }

    if(service){
        promises.push(abstractGenerator({name: service, templateKey:'SERVICES', locationKey:'SERVICES'}));
    }

    if(factory){
        promises.push(abstractGenerator({name: factory, templateKey:'FACTORIES', locationKey:'FACTORIES'}));
    }

    if(filter){
        promises.push(abstractGenerator({name: filter, templateKey:'FILTERS', locationKey:'FILTERS'}));
    }

    if(provider){
        promises.push(abstractGenerator({name: provider, templateKey:'PROVIDERS', locationKey:'PROVIDERS'}));
    }

    return Q.allSettled(promises);
});



gulp.task('clean',function(){
    return gulp.src(BUILD_ROOT, {read:false})
        .pipe($.plumber())
        .pipe(vinylPaths(del));
});


gulp.task('copy',['clean'], function(){
    //move images fonts javascript html
    return gulp.src([
            paths.FONTS,
            paths.IMAGES,
            paths.VIEWS + '**/*.html',
            '!'+ APP_ROOT + '**/*.js', // The HTML files at the root level
            '!'+ APP_ROOT + '*.html', // The HTML files at the root level
            '!'+ APP_ROOT + '**/*.scss' // Any Styles
        ],{base:APP_ROOT})
        .pipe(gulp.dest(BUILD_ROOT))
});


/**
 * @function
 * 'gulp serve' compiles the Sass, injects development dependencies, and executes the watch task
 */
gulp.task('serve',function(){
    runSequence(['sass', 'inject:dev'], 'watch');
})

/**
 * @function
 * 'gulp build' will create a production build
 */
gulp.task('build',function(){
    runSequence(['copy', 'sass','inject'], 'html');
})

/**
 * @function
 * running 'gulp' will execute 'gulp serve'
 */
gulp.task('default', function(){
    runSequence('serve');
});



//************* HELPER FUNCTIONS ******************//

// Generates files based on the options passed in
function generate(options) {
    /*
     Properties
     name - name the user inputted. This will be the name of the files and the folders
     templateNameKey - key used to fetch the appropriate template to copy and transform
     locationKey     - key used to find the location where files are supposed to go
     options         - options used fo additional options
     */
    /*
     1. Setup your necessary variables
     2. Get the template
     3. Rename the template
     4. Inject the data into the template
     5. Store the newly renamed template to the appropriate destination
     */

    /*
     STEP 1: Setup your necessary variables
     Use the templateName to find the URL of the template you want to generate.
     */
    var templateUrl = templates[options.templateKey];

    // some of the variable need to be dasherized and others need to be camel case.
    // Example: STYLES need to be dasherized, DIRECTIVES need to be camelized
    var shouldDasherizeVariableNames = (options.templateKey === 'HTML' || options.templateKey === 'STYLES');


    var needAdditionalFolder = options.extraFolder;

    // When you are creating the destination path for your
    // components or pages, you need to create the folder if it is a component or feature
    // IF the user gave a name using camel-case or underscores it will be transformed to dashes
    // NOTE: paths[locationKey || templateNameKey] will use the locationKey to find the path but if it does not
    // exist (undefined) then it will use the templateNameKey
    var destinationPath = paths[options.locationKey || options.templateKey];
    destinationPath += (needAdditionalFolder) ? options.name.dasherize() : '';


    var deferred = Q.defer();

    /*
     STEP 2: Get the template
     */
    var stream = gulp.src( templateUrl)
        /*
         STEP 3: Rename the template
         Know where you want to save the file.
         Should the file be placed in its own folder or
         is it going to live with other files?. This is the difference between
         placing component files together and placing services together.

         It is also very important to hyphenate file names.
         The user may pass you a name that is already hyphenated
         or they may pass a file that is written in camel-case.
         In both cases you may want to make sure all the
         names are hyphenated.
         */
        .pipe($.rename(function (path) {
            // This is the directory you want to save the file in
            path.dirname = destinationPath;

            // This what you want to rename your file to.
            // Files should always be dasherized
            path.basename = options.name.dasherize();

        }))
        /*
         STEP 4: Inject the data into the template.
         Similar to step 3 you need to be consistent when you are passing in variables.

         If you are generating an angular module (Factory, Directive, Controller, etc.)
         the name of the module needs to be camelCased but if you are generating an
         HTML template then the element name needs to be hyphenated.
         You need to watch for these cases and be consistent.

         To see how the gulp-template works see: https://www.npmjs.com/package/gulp-template
         It uses variables inside the files that look like <%= name %> and those values
         get replaced with the variables you specify here. If you set a value for a variable
         that does not exist in the template, it won't break.
         */
        .pipe($.template({
            // Make sure your naming is consistent with the type of module you are creating
            name: shouldDasherizeVariableNames ? options.name.dasherize() : options.name.camelize(false),

            // This is primarily used when creating directives as the template URL needs to know where the HTML lives
            url: destinationPath.remove(APP_ROOT) + '/' + options.name.dasherize() +'.html',

            route: options.route
        }))
        /*
         STEP 5: Store the newly renamed template to the appropriate destination.
         Make sure the path is where you intend to place the file. If you name things
         incorrectly then your file will be lost - Even worse you could accidentally
         overwrite your existing files.

         leaving as './' should be fine since you defined where you wanted
         it to be saved in STEP 3.
         */
        .pipe(gulp.dest('./'))


        .on('end', function(){
            deferred.resolve(stream);
        });

    return deferred.promise;
}

// Allows you to generate multiple files by using the options passed in the argument
function abstractGenerator(){
    var args =  Array.prototype.slice.call(arguments, 0);
    var promises = [];

    args.forEach(function(arg){
        promises.add(generate(arg))
    });
    return Q.allSettled(promises)
}

// Injects file references into the HTML
// isDev {Boolean} if true it will inject the excluded folder. otherwise it will assume production build and
// exclude all files from the excluded folder.

function inject(isDev){

    var stream = gulp.src(APP_ROOT + MAIN_INDEX)
        // Capture Errors
        .pipe($.plumber())

        // Inject Vendor files
        .pipe($.inject(gulp.src([paths.VENDOR + '**/*.js'],{read:false}), {relative:true, name:'vendor'}))


        // Inject Custom files
        .pipe($.inject(gulp.src([paths.CUSTOM + '**/*.js'],{read:false}), {relative:true, name:'custom'}))

        // Inject Init files
        .pipe($.inject(gulp.src([paths.INIT + '**/*.js'],{read:false}), {relative:true, name:'init'}))

        // inject all other javascript minus the Vendor and Main javascript files
        .pipe($.inject(gulp.src([
            paths.CONTROLLER + '**/*',
            paths.DIRECTIVE + '**/*',
            paths.SERVICES + '**/*',
            paths.FACTORIES + '**/*',
            paths.PROVIDERS + '**/*',
            paths.FILTERS + '**/*'],{read:false}), {relative:true}))

        // Inject all CSS Files
        .pipe($.inject(gulp.src([paths.STYLES + '**/*.css'],{read:false}), {relative:true}));



    if(isDev){
        // Inject Excluded files
        stream.pipe($.inject(gulp.src([paths.EXCLUDE + '**/*.js'],{read:false}), {relative:true, name:'exclude'}))
    }

    return stream.pipe(gulp.dest(APP_ROOT))
}