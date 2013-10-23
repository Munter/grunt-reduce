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
            urlTools = require('assetgraph-builder/node_modules/assetgraph/lib/util/urlTools');

        var config = grunt.config(this.name) || {},
            rootUrl = urlTools.fsDirToFileUrl(config.root || 'app'),
            outRoot = urlTools.fsDirToFileUrl(config.outRoot || 'dist'),
            cdnRoot = config.cdnRoot && urlTools.ensureTrailingSlash(config.cdnRoot),
            cdnOutRoot = config.cdnOutRoot && urlTools.fsDirToFileUrl(config.cdnOutRoot),
            optimizeImages = config.optimizeImages === false ? false : true,
            less = config.less === false ? false : true,
            asyncScripts = config.asyncScripts === false ? false : true,
            sharedBundles = config.sharedBundles === false ? false : true;

        var loadAssets = [
            '**/*.html',
            '**/.htaccess',
            '*.txt',
            '*.ico'
        ]

        if (config.include) {
            loadAssets = config.include;
        }

        new AssetGraph({ root: rootUrl })
            .on('afterTransform', function (transform, elapsedTime) {
                console.log((elapsedTime / 1000).toFixed(3) + " secs: " + transform.name);
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
                manifest: config.manifest || false,
                asyncScripts: asyncScripts,
                cdnRoot: cdnRoot,
                prettyPrint: config.pretty || false,
                sharedBundles: sharedBundles
            })
            .writeAssetsToDisc({url: /^file:/}, outRoot)
            .if(cdnRoot)
                .writeAssetsToDisc({url: query.createPrefixMatcher(cdnRoot)}, cdnOutRoot || outRoot, cdnRoot)
            .endif()
            .writeStatsToStderr()
            .run(done);
    });
};
