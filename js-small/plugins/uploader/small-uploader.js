/*
 * JS-Small JavaScript Framework Plugin 0.0.1
 * Description: Plug-in allows to upload files
 * Copyright (c) 2008 - 2011 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 */
small.extendMethods({
    appendUploader: function(options){
        if(small.typeIn(options, "object")){
            var result = [];
            
            var name = options.name || "file",
            url = options.url || "",
            extensions = options.extensions || [],
            maxSize = options.maxSize || 0,
            onError = options.onError || function(){},
            onSubmit = options.onSubmit || function(){},
            onComplete = options.onComplete || function(){},
            onCancel = options.onCancel || function(){};
            
            this.each(function(object){
                object = small(object);
                    
                var fileName = "",
                file = small.create("input").attr({
                    "type": "file",
                    "name": name
                }).change(function(){
                    var current = small(this),
                    error = false;
                    fileName = current.attr("value").replace(/^.*(\\|\/|\:)/, '');
                    if(extensions.length > 0){
                        var regExp = new RegExp("\\.(" + small.trim(extensions).join("|") + ")$");
                        error = !regExp.test(fileName);
                    }
                        
                    if(!error){
                        var width = current.bound().width,
                        iframe = small.create("iframe").attr({
                            "name": name,
                            "src": "javascript: false;"
                        }).hide(),
                        iframeObj = iframe.node();
                        small.body().append(iframe);
            
                        var iframeDoc;
                        if(iframeObj.contentDocument) iframeDoc = iframeObj.contentDocument;
                        else if(iframeObj.contentWindow) iframeDoc = iframeObj.contentWindow.document;
                        else if(iframeObj.document) iframeDoc = iframeObj.document;
                        iframeDoc.write("<html><head></head><body></body><html>");
                        iframeDoc.close();
                        var iframeBody = small(iframeDoc).find("body");
                    
            
                        var form = small.create("form").attr({
                            "name": name,
                            "action": url,
                            "method": "post",
                            "enctype": "multipart/form-data"
                        });
                        form.append(current);
                        if(maxSize > 0){
                            var hidden = small.create("input").attr({
                                "type": "hidden",
                                "name": "MAX_FILE_SIZE",
                                "value": maxSize
                            });
                            form.append(hidden);
                        }
                        iframeBody.append(form);
                        onSubmit(name, options);
                        form.node().submit();
                    
                        var progress = 0,
                        uploader = object.append("div.uploader").css("width", width + "px");
                        uploader.append("div.cancel").click(function(){
                            iframe.remove();
                            uploader.remove();
                            object.appendUploader(options);
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
                            uploader.empty().append("div.done").text(fileName);
                            onComplete(name, options);
                        });
                    }else onError(name, options);
                });
                
                object.append(file);
                
                result[result.length] = file.node();
            });
        }
        
        return new small(result);
    }
});