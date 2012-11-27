module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    lint: {
      files: ['grunt.js', 'task/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint test'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: {
        exports: true,
        module: false
      }
    },
    reduce: {
      root: 'app',
      outroot: 'dist',
      cdnroot: '',
      cdnoutroot: '',

      // Tries optimal palette reduction, removes ancillary chunks and tries for better compression
      optimizepngs: true,

      // Inline CSS backgrounds below this threshold as data-uris
      inlinesize: 8192,

      // Sets the "defer" attribute on all script tags
      deferscripts: false,

      // Sets the "async" attribute on all script tags
      asyncscripts: true,

      // Translates .less files to CSS
      less: true,

      // Generates an appcache manifest file with all static assets included
      manifest: false,

      // Prettifies HTML, CSS and Javascript for easier debugging
      pretty: false,

      // Wraps your javascript code in a function literal that pulls global variables into local variables for better minification. WARNING: This may break your JS
      mangletoplevel: false,

      // Url patterns to exclude from the build. Supports * wildcards.
      exclude: []



      /*
      // Registers labels as custom protocols for path resolving.
      labels: {},
      // If an unknown label (scheme) is found, look for at parent dir of that name before failing (breaks custom protocols)
      parentdir: false,
      // list of locales to build seperate versions for
      locales: [
        // 'en'
      ],
      // The locale of the default value in TR statements and tags with a data-i18n attribute
      defaultlocale: 'en',
      // The name of your locale cookie (exposed as LOCALECOOKIENAME)
      localecookiename: 'en',


      // Removes the locale id from the <html manifest="..."> references so all manifests are assumed to be accessible from the same url. Useful if you want the browser to pick up the right cache manifest and HTML after a locale change (your static file server needs to support content negotiation). Only makes sense when both manifest and locale have been specified
      negotiatemanifest: false,
      // Whether to stop with a non-zero exit code when a warning is encountered
      stoponwarning: false,
      // Adds or updates <meta http-equiv="Content-Version" content="..."> to the specified value. Use {0} to refer to the current value, eg. --version {0}/production or --version `git describe --long --tags --always --dirty 2>/dev/null || echo unknown`
      version: ''
      */
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint');

  grunt.loadTasks('tasks');

};
