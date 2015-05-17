# Simple Magento Theme Generator
Help magento frontend developers with initialization theme.


## What is ght-build doing?
 - Creates your package with default theme.(package name you will enter to cli)
 - Install or update Gulp(local and global -v), creates gulpfile with included gulp modules.
 - Install or update Bower(global -v), creates .bowerrc file for change bower directory, and bower.json file with most needed libraries.
 - Install or update Compass, creates config.rb for your package, with needed folders and modules. 
 - After all steps was installed, he'll install needed bower components and gulp dependencies


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
* Bower support
* Compass support

## Features (todo)
* Twitter Bootstrap support
* Magento Sample data installation



## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
