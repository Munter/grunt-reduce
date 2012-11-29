# grunt-reduce

A grunt kitchen that reduces your web ingredients down to their essence for optimal serving. Bon appétit!

grunt-reduce builds your web application based on the DOM.
This has a number of advantages to the developer:
* If the browser can see it, so can grunt-reduce - Develop for the browser not the build system!
* Minimal configuration needed
* No build system smells in your markup, javascript, css etc.
* It's fast! No intermediate files on disk


# Configuration

Minimal configuration:
``` javascript
module.exports = function( grunt ) {
  'use strict';

  grunt.initConfig({
    reduce: {
        root: 'app',
        outRoot: 'dist'
    }
  });

  grunt.loadNpmTasks('grunt-reduce');
};
```

Maximal configuration:
``` javascript
TODO
```


## License
Copyright (c) 2012 Peter Müller  
Licensed under the MIT license.
