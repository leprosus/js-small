/*
 * JS-Small JavaScript Framework Init Script
 * Description: Init js-small plug-ins
 * Copyright (c) 2008 - 2014 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 * Thanks:           http://www.crowdersoftware.com/
 * @author Denis Korolev
 * @version 0.0.8
 */
small.extendFunctions({
    'plugins': function(list) {
        // Default initialization
        if(small.typeIn(list, 'undefined')) {
            list = 'colors,converters,dialogs,password,uploader,hash,wrapper,onfly,renewal,validator';
        }
        if(small.typeIn(list, 'string')) {
            list = list.split(',');
        }
        if(small.typeIn(list, 'array')) {
            var plugins = {
                'colors': function() {
                    small.loadScript(path + 'plugins/colors/small-colors.js');
                },
                'converters': function() {
                    small.loadScript(path + 'plugins/converters/small-converters.js');
                },
                'hash': function() {
                    small.loadScript(path + 'plugins/hash/small-hash.js');
                },
                'onfly': function() {
                    small.loadScript(path + 'plugins/onfly/small-onfly.js');
                },
                'dialogs': function() {
                    small.loadCss(path + 'plugins/dialogs/small-dialogs.css');
                    small.loadScript(path + 'plugins/dialogs/small-dialogs.js');
                },
                'password': function() {
                    small.loadScript(path + 'plugins/password/small-password.js');
                },
                'renewal': function() {
                    small.loadCss(path + 'plugins/renewal/small-renewal.css');
                    small.loadScript(path + 'plugins/renewal/small-renewal.js');
                },
                'uploader': function() {
                    small.loadCss(path + 'plugins/uploader/small-uploader.css');
                    small.loadScript(path + 'plugins/uploader/small-uploader.js');
                },
                'validator': function() {
                    small.loadScript(path + 'plugins/validator/small-validator.js');
                },
                'wrapper': function() {
                    small.loadScript(path + 'plugins/wrapper/small-wrapper.js');
                }
            };

            // Getting base url
            var path = '';
            small('head').find('script').each(function(object) {
                if(path.length == 0) {
                    var matches = /^(.+)plugins\/init\.js/.exec(object.src);
                    if(matches != null) {
                        path = matches[1];
                    }
                }
            });

            // Load plugins
            list = small.trim(list);
            small.each(list, function(item) {
                if(small.typeIn(plugins[item], 'function')) {
                    plugins[item]();
                }
            });

        }
    }
});