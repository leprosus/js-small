small.extendFunctions({
    "plugins": function(list){
        if(small.typeIn(list, "undefined")) list = "colors,converters,dialogs,password,uploader".split(",");
        else if(small.typeIn(list, "string")) list = list.split(",");
        if(small.typeIn(list, "array")){
            var path = "",
            plugins = {
                "colors": function(){
                    small.loadScript(path + "plugins/colors/small-colors.js");
                },
                "converters": function(){
                    small.loadScript(path + "plugins/converters/small-converters.js");
                },
                "dialogs": function(){
                    small.loadCss(path + "plugins/dialogs/small-dialogs.css");
                    small.loadScript(path + "plugins/dialogs/small-dialogs.js");
                },
                "password": function(){
                    small.loadScript(path + "plugins/password/small-password.js");
                },
                "uploader": function(){
                    small.loadCss(path + "plugins/dialogs/small-uploader.css");
                    small.loadScript(path + "plugins/dialogs/small-uploader.js");
                }
            };
            small("head").find("script").each(function(object){
                if(path.length == 0){
                    var matches = /^(.+)plugins\/init\.js$/.exec(object.src);
                    if(matches != null) path = matches[1];
                }
            });
            
            list = small.trim(list);
            small.each(list, function(item){
                if(small.typeIn(plugins[item], "function")) plugins[item]();
            });
        
        }
    }
});