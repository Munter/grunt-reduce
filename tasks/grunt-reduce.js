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
            urlTools = require('urltools'),
            chalk = require('chalk');

        var config = grunt.config(this.name) || {},
            rootUrl = urlTools.fsDirToFileUrl(config.root || 'app'),
            outRoot = urlTools.fsDirToFileUrl(config.outRoot || 'dist'),
            cdnRoot = config.cdnRoot && urlTools.ensureTrailingSlash(config.cdnRoot),
            cdnOutRoot = config.cdnOutRoot && urlTools.fsDirToFileUrl(config.cdnOutRoot),
            canonicalUrl = config.canonicalUrl && urlTools.ensureTrailingSlash(config.canonicalUrl),
            optimizeImages = config.optimizeImages === false ? false : true,
            sourceMaps = config.sourceMaps === false ? false : true,
            less = config.less === false ? false : true,
            scss = config.scss === false ? false : true,
            fileRev = config.fileRev === false ? false : true,
            asyncScripts = config.asyncScripts === false ? false : true,
            sharedBundles = config.sharedBundles === false ? false : true,
            subResourceIntegrity = config.subResourceIntegrity === false ? false : true;

        // Support for locales
        var localeIds;
        if (Array.isArray(config.locales)) {
            localeIds = config.locales.map(function (localeId) {
                // Normalize localeId
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

        var browsers = [
            '> 1%',
            'last 2 versions',
            'Firefox ESR',
            'Opera 12.1'
        ];

        if (config.autoprefix) {
            grunt.log.writeln(chalk.yellow(' ⚠ The "autoprefix" property has been deprecated and replaced with "browsers". Please update your grunt-reduce config.'));
            browsers = config.autoprefix;
        }

        if (config.browsers) {
            browsers = config.browsers;
        }

        new AssetGraph({ root: rootUrl })
            .logEvents()
            .registerRequireJsConfig()
            .loadAssets(loadAssets)
            .buildProduction({
                angular: config.angular,
                recursive: true,
                canonicalUrl: canonicalUrl,
                browsers: browsers,
                less: less,
                scss: scss,
                noFileRev: !fileRev,
                optimizeImages: optimizeImages,
                sourceMaps: sourceMaps,
                inlineSize: config.inlineSize === 0 ? 0 : (config.inlineSize || 4096),
                manifest: config.manifest || false,
                asyncScripts: asyncScripts,
                cdnRoot: cdnRoot,
                noCompress: config.pretty || false,
                sharedBundles: sharedBundles,
                stripDebug: !(config.pretty || false),
                localeIds: localeIds,
                subResourceIntegrity: subResourceIntegrity
            })
            .writeAssetsToDisc({url: /^file:/, isLoaded: true}, outRoot)
            .if(cdnRoot)
                .writeAssetsToDisc({url: query.createPrefixMatcher(cdnRoot), isLoaded: true}, cdnOutRoot || outRoot, cdnRoot)
            .endif()
            .writeStatsToStderr()
            .run(done);
    });
};
