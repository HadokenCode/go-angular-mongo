# GoNenjo CMS (Work-In-Progress)
GoLang + AngularJs 2.0 + MongoDB Stack CMS

Content Management System built with the following technologies:

* GoLang for developing the backend
* AngularJS for developing the frontend
* MongoDB for the Database (NoSQL)

![Alt text](gam.png?raw=true "GoLang + Angular + MongoDB")

## Local Setup

Pre-requisite:

+ [GoLang](https://golang.org/)
+ [MongoDB](https://www.mongodb.com/)
+ [Nodejs](https://nodejs.org/)
 

## <a name="building"></a> Building

Developers can easily build GoNenjo CMS using NPM and gulp.

* [Builds - Under the Hood](docs/guides/BUILD.md)

First install or update your local project's **npm** tools:

```bash
# First install all the NPM tools:
npm install

# Or update
npm update
```

Then run the **gulp** tasks:

```bash
# To build minified version
gulp build

# To build the GoNenjo docs in `/dist/docs` directory
gulp docs
```

For more details on how the build process works and additional commands (available for testing and
debugging) developers should read the [Build Instructions](docs/guides/BUILD.md).

## <a name="installing"></a> Installing Build (GoNenjo Files)

Installation process description and article here...


## To Dos
* Angular 2.0 & Typescript Setup
* Gulp setup with minify & uglify
* MongoDB with mgo (mango)
* Gorilla Mux Routing
* AuhtO Authentication with Gmail & Facebook
* Google Analytics
* RESTful API
* Admin Module with dashboard
* Metadata


