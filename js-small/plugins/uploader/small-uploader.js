/*
 * JS-Small JavaScript Framework Plugin 0.1.1
 * Description: Plug-in allows to upload files
 * Copyright (c) 2008 - 2011 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 */
small.extendFunctions({
    uploader: function(options){
        if(small.typeIn(options, "object")){
            var name = options.name || "file",
            url = options.url || "",
            extensions = options.extensions || [],
            maxSize = options.maxSize || 0,
            onError = options.onError || function(){},
            onSubmit = options.onSubmit || function(){},
            onComplete = options.onComplete || function(){},
            onCancel = options.onCancel || function(){};
            
            var fileName = "",
            form = small.create("form").attr({
                "name": name,
                "action": small.base().concat(url),
                "method": "post",
                "enctype": "multipart/form-data",
                "target": name
            }),
            uploader = form.append("div.uploader").hide(),
            iframe = small.create("iframe").attr({
                "name": name,
                "src": "javascript: false;"
            }).hide();
            form.append(iframe);
            
            if(maxSize > 0){
                var hidden = small.create("input").attr({
                    "type": "hidden",
                    "name": "MAX_FILE_SIZE",
                    "value": maxSize
                });
                form.append(hidden);
            }
            
            var file = small.create("input").attr({
                "type": "file",
                "name": name
            }).change(function(){
                var current = small(this), error = false;
                fileName = current.attr("value").replace(/^.*(\\|\/|\:)/, '');
                if(extensions.length > 0){
                    var regExp = new RegExp("\\.(" + small.trim(extensions).join("|") + ")$", "i");
                    error = !regExp.test(fileName);
                }
                        
                if(!error){
                    var width = current.bound().width;
                    onSubmit(name, options);
                    form.node().submit();
                    
                    var progress = 0;
                    file.hide();
                    uploader.show().css("width", width + "px")
                    .append("div.cancel").click(function(){
                        var newUploader = small.uploader(options);
                        uploader.after(newUploader);
                        uploader.remove();
                        iframe.remove();
                        onCancel(name, options);
                    });
                    var value = uploader.append("div.border").append("div.value");
                    value.append("div.animation").opacity(70);
                    value.start({
                        "time": 100,
                        "callback": function(){
                            value.css("width", ((width - 16) * progress++ / 100) + "px")
                        },
                        "repeat": 90
                    });
                    
                    iframe.load(function(){
                        var idoc = iframe.node().contentDocument || iframe.node().document,
                        content = idoc.documentElement.outerHTML || new XMLSerializer().serializeToString(idoc);
                        iframe.remove();
                        uploader.empty().append("div.done").text(fileName);
                        onComplete(name, options, content);
                    });
                }else onError(name, options);
            });
            form.append(file);
        }
        
        return form;
    }
});