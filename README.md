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

# Automated spriting
Even though most browsers support inlining images through data-uris, spriting is sometimes still needed.

grunt-reduce eases the pain of spriting considerably, down to a convenient little anotation in the image url of the images you want to sprite.

Say you have the following CSS:
``` CSS
.icon.calendar {
    background-image: url(icons/calendar.png);
}
.icon.email {
    background-image: url(icons/email.png);
}
.icon.contacts {
    background-image: url(icons/contacts.png);
}
```

Assuming all of these images are all smaller than 4k after minification grunt-reduce will inline them as data-uris. If what you really wanted was a sprite, you can do this instead:

``` CSS
.icon.calendar {
    background-image: url(icons/calendar.png?sprite=mySprite);
}
.icon.email {
    background-image: url(icons/email.png?sprite=mySprite);
}
.icon.contacts {
    background-image: url(icons/contacts.png?sprite=mySprite);
}
```

The build process will now generate an optimally packed sprite sheet for you, run that sprite sheet through lossless image optimization and replace the CSS image references with a reference to the generated sprite, including the sprite offset.

You may create several different sprite sheets by defining different sprite names in the sprite parameter.

When using this technique it is recommended to have a seperate dom element for each image with the same dimensions as the background image.

Note about data-uris: IE versions lower than 8 do not understand data-uris. grunt-reduce adds a fallback to get the original image using conditional comments for these old IE versions.


# Tools used
* Assetgraph: https://github.com/One-com/assetgraph
* Assetgraph-builder: https://github.com/One-com/assetgraph-builder
* Assetgraph-sprite: https://github.com/One-com/assetgraph-sprite


## License
Copyright (c) 2012 Peter Müller
Licensed under the MIT license.
