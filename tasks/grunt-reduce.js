/*
 * grunt-reduce
 * https://github.com/munter/grunt-reduce
 *
 * Copyright (c) 2012 Peter Müller
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {

    grunt.registerTask('reduce', 'Description', function () {
        var AssetGraph = require('assetgraph'),
            query = AssetGraph.query,
            urlTools = require('assetgraph/lib/util/urlTools');

        var config = grunt.config(this.name),
            rootUrl = urlTools.fsDirToFileUrl(config.root),
            outRoot = urlTools.fsDirToFileUrl(config.outRoot),
            cdnRoot = config.cdnRoot && urlTools.ensureTrailingSlash(config.cdnRoot),
            cdnOutRoot = config.cdnOutRoot && urlTools.fsDirToFileUrl(config.cdnOutRoot);

        require('assetgraph-builder/lib/registerTransforms');

        new AssetGraph({ root: rootUrl })
            .on('afterTransform', function (transform, elapsedTime) {
                console.log((elapsedTime / 1000).toFixed(3) + " secs: " + transform.name);
            })
            .on('warn', function (err) {
                // These are way too noisy
                if (err.relationType !== 'JavaScriptCommonJsRequire') {
                    console.warn((err.asset ? err.asset.urlOrDescription + ': ' : '') + err.message);
                    if (commandLineOptions.stoponwarning) {
                        process.exit(1);
                    }
                }
            })
            .on('error', function (err) {
                console.error((err.asset ? err.asset.urlOrDescription + ': ' : '') + err.stack);
                process.exit(1);
            })
            .registerRequireJsConfig()
            .loadAssets([rootUrl + '**/*.html'])
            .populate()
            /*
            .buildProduction({
                less: true,
                optimizePngs: true,
                optimizeJpgs: true,
                inlineSize: 4096,
                manifest: false,
                asyncScripts: true,
                cdnRoot: cdnRoot,
                noCompress: false
            })
*/
            .writeAssetsToDisc({url: /^file:/}, outRoot)
            .if(cdnRoot)
                .writeAssetsToDisc({url: query.createPrefixMatcher(cdnRoot)}, cdnOutRoot || outRoot, cdnRoot)
            .endif()
            .writeStatsToStderr()
            .run();
    });
};
