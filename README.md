# Small Magento Project Generator
Help magento frontend developers with initialization package and theme.


##  What ght-build will do?
 - Creating your package with default theme.
 - Install or update gulp(local and global) with gulpfile.js, with tasks in root theme directory.
 - Install or update bower(global) with .bowerrc and bower.json file with needed libraries in root theme directory.
 - Install or update compass and create project, setting up him and make "base" styles.scss file in root directory of your theme.
 - Install or update susy.
 - Install needed bower components
 - Install needed gulp modules


## Getting started
Installation:
```sh
$ npm install git+https://github.com/insght/ght-build.git -g
```

Run it in magento root directory:
```sh
$ ghtbuild
```

## Features (now)
* Gulp support
* Susy support
* Bower support
* Compass support

## Features (todo)
* Twitter Bootstrap support
* Magento Sample data installation



## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
