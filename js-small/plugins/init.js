small.extendFunctions({
    'plugins': function(list){
        // Initialization
        if(small.typeIn(list, 'undefined')) list = 'colors,converters,dialogs,password,uploader,hash,wrapper,onfly';
        if(small.typeIn(list, 'string')) list = list.split(',');
        if(small.typeIn(list, 'array')){
            var plugins = {
                'colors': function(){
                    small.loadScript(path + 'plugins/colors/small-colors.js');
                },
                'converters': function(){
                    small.loadScript(path + 'plugins/converters/small-converters.js');
                },
                'hash': function(){
                    small.loadScript(path + 'plugins/hash/small-hash.js');
                },
                'onfly': function(){
                    small.loadScript(path + 'plugins/onfly/small-onfly.js');
                },
                'dialogs': function(){
                    small.loadCss(path + 'plugins/dialogs/small-dialogs.css');
                    small.loadScript(path + 'plugins/dialogs/small-dialogs.js');
                },
                'password': function(){
                    small.loadScript(path + 'plugins/password/small-password.js');
                },
                'uploader': function(){
                    small.loadCss(path + 'plugins/uploader/small-uploader.css');
                    small.loadScript(path + 'plugins/uploader/small-uploader.js');
                },
                'wrapper': function(){
                    small.loadScript(path + 'plugins/wrapper/small-wrapper.js');
                }
            };

            // Getting base url
            var path = '';
            small('head').find('script').each(function(object){
                if(path.length == 0){
                    var matches = /^(.+)plugins\/init\.js/.exec(object.src);
                    if(matches != null) path = matches[1];
                }
            });

            // Load plugins
            list = small.trim(list);
            small.each(list, function(item){
                if(small.typeIn(plugins[item], 'function')) plugins[item]();
            });

        }
    }
});