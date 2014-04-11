# Bourbon.js [![Build Status](https://secure.travis-ci.org/coopersemantics/Bourbon.png?branch=master)](https://travis-ci.org/coopersemantics/Bourbon)

A lightweight JavaScript library.

## What's required:

Bourbon requires [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/) before proceeding.

## Compiling client code:

Bourbon.js uses the [grunt](https://github.com/gruntjs/grunt) build system.

```bash
# Install Grunt & Bower globally:
$ {sudo} npm install -g grunt-cli bower

# Clone the Bourbon git repo:
$ git clone git@github.com:coopersemantics/Bourbon.git

# Navigate to the root /Bourbon directory:
$ cd Bourbon

# Install necessary dependencies:
$ npm install
$ bower install

# Run grunt:
$ grunt
```

### Grunt Tasks:

Test:
```bash
$ grunt test
```

Auto-build Bourbon.js:
```bash
$ grunt watch
```

For a list of all the available tasks:
```bash
$ grunt --help
```

## Browser:

```html
<script src="path/to/bourbon.min.js"></script>
```

## Versioning:

Releases will be numbered using the following format:

```
<major>.<minor>.<patch>
```

And constructed with the following guidelines:

- Breaking backward compatibility **bumps the major** while resetting minor and patch
- New additions without breaking backward compatibility **bumps the minor** while resetting the patch
- Bug fixes and misc. changes **bumps only the patch**

For more information on SemVer, please visit <http://semver.org/>.

## Author

coopersemantics

## Copyright and license

Copyright 2014 coopersemantics under the [MIT license](https://github.com/coopersemantics/Bourbon/blob/master/MIT-LICENSE.txt).

