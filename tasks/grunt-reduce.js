/*jshint onevar:false*/

/*
 * grunt-reduce
 * https://github.com/munter/grunt-reduce
 *
 * Copyright (c) 2012 Peter Müller
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {

    grunt.registerTask('reduce', 'Description', function () {
        var done = this.async();

        var AssetGraph = require('assetgraph-builder'),
            query = AssetGraph.query,
            urlTools = require('urltools');

        var config = grunt.config(this.name) || {},
            rootUrl = urlTools.fsDirToFileUrl(config.root || 'app'),
            outRoot = urlTools.fsDirToFileUrl(config.outRoot || 'dist'),
            cdnRoot = config.cdnRoot && urlTools.ensureTrailingSlash(config.cdnRoot),
            cdnOutRoot = config.cdnOutRoot && urlTools.fsDirToFileUrl(config.cdnOutRoot),
            optimizeImages = config.optimizeImages === false ? false : true,
            less = config.less === false ? false : true,
            asyncScripts = config.asyncScripts === false ? false : true,
            sharedBundles = config.sharedBundles === false ? false : true;

        // Support for locales
        var locales;
        if (typeof config.locales === 'string') {
            // split the defined locales and normalize them
            locales = config.locales.split(',').map(function (localeId) {
                return localeId && localeId.replace(/-/g, '_').toLowerCase();
            });
        }

        var loadAssets = [
            '*.html',
            '.htaccess',
            '*.txt',
            '*.ico'
        ];

        if (config.include) {
            loadAssets = config.include;
        }

        var autoprefix = [
            '> 1%',
            'last 2 versions',
            'Firefox ESR',
            'Opera 12.1'
        ];

        if (config.autoprefix) {
            autoprefix = config.autoprefix;
        }

        new AssetGraph({ root: rootUrl })
            .on('afterTransform', function (transform, elapsedTime) {
                console.log((elapsedTime / 1000).toFixed(3) + ' secs: ' + transform.name);
            })
            .on('warn', function (err) {
                // These are way too noisy
                if (err.relationType !== 'JavaScriptCommonJsRequire') {
                    console.warn((err.asset ? err.asset.urlOrDescription + ': ' : '') + err.message);
                }
            })
            .on('error', function (err) {
                console.error((err.asset ? err.asset.urlOrDescription + ': ' : '') + err.stack);
            })
            .registerRequireJsConfig()
            .loadAssets(loadAssets)
            .buildProduction({
                less: less,
                jpegtran: optimizeImages,
                pngquant: optimizeImages,
                pngcrush: optimizeImages,
                optipng: optimizeImages,
                inlineSize: config.inlineSize === 0 ? 0 : (config.inlineSize || 4096),
                autoprefix: autoprefix,
                manifest: config.manifest || false,
                asyncScripts: asyncScripts,
                cdnRoot: cdnRoot,
                noCompress: config.pretty || false,
                sharedBundles: sharedBundles,
                localeIds: locales
            })
            .writeAssetsToDisc({url: /^file:/, isLoaded: true}, outRoot)
            .if(cdnRoot)
                .writeAssetsToDisc({url: query.createPrefixMatcher(cdnRoot), isLoaded: true}, cdnOutRoot || outRoot, cdnRoot)
            .endif()
            .writeStatsToStderr()
            .run(done);
    });
};
