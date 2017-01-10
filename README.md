# Yeoman generator-anode

This generator uses a component based design to structure Angular applications.
This scaffolding also uses a generator to create any of the files necessary for angular app.

run 
```sh
$ npm install -g generator-anode
$ yo anode
```
And follow the prompts


## Setup
Just running gulp or anything else may not work as additional setup would most likely be required. This project package 
requires bower in order to run so to install you and complete the rest of the setup run:

```sh
 $ npm run init  
 ```

This command will run 
> npm install  
> sudo npm install -g bower  
> bower init  
> mkdir bower_components  

Feel free to run these manually if you have any of the following already.

## Gulp Tasks
Gulp will be very helpful in this project. It will handle all the file creations, place them in the proper folder and
 inject them into the index.html file.

### generate
'gulp generate' will create all basic files that would need to be added to the project. It takes the signature 
>gulp generate --[filetype] [filename] 

The following examples shows how the generator task works.
>**Example**
> The following will create a component (directive) called timeLord.
> Components contain an associated HTML, SCSS, and JS file which are all copied to views/components/timeLord
 
```sh
 $ gulp generate --component timeLord  
 ```
>**Example 1**
>The following will create a page (controller) called dashboard. Pages contain an associated HTML, SCSS, and JS file which are all copied to views/pages/dashboard.
> Only for generating Pages is there an optional parameter 'route' that can be used. In this particular example the dashboard page will be accessible through the url route 'home' (localhost:3000/#/home)
> Otherwise the route will default to the name of the page (localhost:3000/#/dashboard)

```js
$ gulp generate --page dashboard --route home
```
> **Example 2**  
 Other filestypes that can be generated are 'service | factory | filter' and created using the parameters respectively
```js
    // create errorManagement.js file in services
 $ gulp generate --service errorManagement
    // create compilations.js file in factories
 $ gulp generate --factory compilations
```
### build
run "gulp build" to create a production ready version of your project

### serve
Run "gulp serve" or "gulp" to compile sass, inject dependencies and run the watch task
