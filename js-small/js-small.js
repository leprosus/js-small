/*
 * JS-Small JavaScript Framework version 0.9.3
 * Copyright (c) 2008 - 2011 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 */
(function(){
    var small = window.small = function(node){
        if(this.small){
            var result = null;
            if(typeIn(node, "string")) result = small.find(node);
            else if(typeIn(node, "object")) result = typeIn(node.nodes, "array") ? node : new small([node]);
            return result;
        }
        this.nodes = node;
    };
    small.extend = function(object, properties){
        if(typeIn(object, "object,function") && typeIn(properties, "object"))
            small.each(properties, function(key, value){
                try {
                    object[key] = value;
                }catch(err){}
            });
        return object;
    };
    small.extendFunctions = function(functions){
        small = small.extend(small, functions);
    };
    small.extendMethods = function(methods){
        small.extend(small.prototype, methods);
    };
    small.prototype = {
        each: function(callback){
            if(typeIn(callback, "function") && callback.length < 3)
                small.each(this.nodes, callback);
            return this;
        },
        grep: function(callback){
            var result = null;
            if(typeIn(callback, "function") && callback.length < 3){
                this.nodes = small.grep(this.nodes, callback);
                result = this;
            }
            return result;
        },
        concat: function(text){
            if(typeIn(text, "string,number"))
                this.each(function(value){
                    try {
                        value.appendChild(document.createTextNode(text));
                    } catch(err){}
                });
            return this;
        },
        text: function(text){
            var result = null;
            if(typeIn(text) == "undefined") result = this.length() > 0 ? (this.nodes[0].textContent ? this.nodes[0].textContent : this.nodes[0].innerHTML) : null;
            else if(typeIn(text, "string,number")) result = this.empty().concat(text);
            return result;
        },
        html: function(text){
            var result = null;
            if(!text) result = this.length() > 0 ? (this.nodes[0].innerHTML || this.nodes[0].textContent) : null;
            else if(typeIn(text, "string")){
                this.each(function(value){
                    value.innerHTML = text;
                });
                result = this;
            }
            return result;
        },
        empty: function(){
            var callback = arguments, length = callback.length;
            if(length == 0)
                this.each(function(object){
                    while (object.firstChild){
                        small(object.firstChild).unbind();
                        object.removeChild(object.firstChild);
                    }
                });
            else if(length > 0){
                this.each(function(object){
                    var result = (object.textContent ? object.textContent : object.innerHTML) == "";
                    if(length > 0 && ((length < 3 && result) || (length == 2 && !result))) (result ? callback[0] : callback[1]).call(object);
                });
            }
            return this;
        },
        node: function(){
            return this.length() > 0 ? this.nodes[0] : null;
        },
        parent: function(){
            var array = [];
            this.each(function(object){
                array[array.length] = object.parentNode;
            });
            return new small(array);
        },
        child: function(){
            var array = [];
            this.each(function(object){
                for(var childList = object.childNodes, index = 0; index < childList.length; index++)
                    if(childList[index].nodeType == 1) array[array.length] = childList[index];
            });
            return new small(array);
        },
        children: function(){
            var array = [], childList = this;
            do{
                childList = childList.child();
                array = small.merge(array, childList.nodes);
            } while (childList.length() > 0);
            return new small(array);
        },
        firstChild: function(){
            return childDom.call(this, "firstChild");
        },
        lastChild: function(){
            return childDom.call(this, "lastChild");
        },
        next: function(){
            return childDom.call(this, "next");
        },
        prev: function(){
            return childDom.call(this, "prev");
        },
        nextAll: function(){
            return childDom.call(this, "nextAll");
        },
        prevAll: function(){
            return childDom.call(this, "prevAll");
        },
        siblings: function(){
            return this.parent().firstChild().nextAll();
        },
        unique: function(){
            for(var first = 0; first < this.nodes.length - 1; first++)
                for(var second = first + 1; second < this.nodes.length; second++)
                    if(this.nodes[first] == this.nodes[second]) this.nodes.splice(second, 1), first--, second--;
            return this;
        },
        merge: function(){
            var current = this;
            small.each(arguments, function(object){
                if(isOwn(object)) current.nodes = current.nodes.concat(object.nodes);
            });
            return this;
        },
        append: function(tag){
            return joinDom.call(this, tag, "append");
        },
        prepend: function(tag){
            return joinDom.call(this, tag, "prepend");
        },
        appendTo: function(tag){
            return joinDom.call(this, tag, "appendTo");
        },
        prependTo: function(tag){
            return joinDom.call(this, tag, "prependTo");
        },
        after: function(tag){
            return joinDom.call(this, tag, "after");
        },
        before: function(tag){
            return joinDom.call(this, tag, "before");
        },
        insertAfter: function(tag){
            return joinDom.call(this, tag, "insertAfter");
        },
        insertBefore: function(tag){
            return joinDom.call(this, tag, "insertBefore");
        },
        exist: function(){
            var result = this.length() > 0, data = arguments, length = data.length;
            if(length > 0 && ((length < 3 && result) || (length == 2 && !result))){
                var callback = result ? data[0] : data[1];
                if(result)
                    this.each(function(object){
                        callback.call(object);
                    });
                else callback();
            }
            return result;
        },
        serialize: function(){
            return this.length() > 0 ? (this.nodes[0].outerHTML || new XMLSerializer().serializeToString(this.nodes[0])) : null;
        },
        replace: function(tag){
            var result = this;
            if(typeIn(tag, "string,object")){
                result = this.before(tag);
                this.remove();
            }
            return result;
        },
        wrap: function(tag){
            var result = this;
            if(typeIn(tag, "string,object")){
                result = isOwn(tag) ? tag : small.create(tag);
                this.after(result);
                result.append(this);
            }
            return result;
        },
        wrapChild: function(tag){
            var result = null, array = [];
            if(typeIn(tag, "string,object")){
                result = isOwn(tag) ? tag : small.create(tag);
                this.each(function(object){
                    for(var childList = object.childNodes, index = 0; index < childList.length; index++) array[array.length] = childList[index];
                });
                result.append(new small(array));
                this.append(result);
            }
            return result;
        },
        unwrap: function(){
            return this.length() > 0 ? (this.after(this.child()), this.remove()) : null;
        },
        remove: function(){
            this.children().unbind().empty();
            this.unbind().empty().each(function(object){
                if(object.parentNode) object.parentNode.removeChild(object);
            });
            return null;
        },
        bind: function(type, callback, attach){
            if(typeIn(callback, "function")){
                if(typeIn(type, "string")) type = type.replace(/\s+/g, "").split(",");
                if(typeIn(type, "array")){
                    type = small.lower(small.trim(type));
                    if(small.contain(type, eventList))
                        this.each(function(object){
                            small.each(type, function(value){
                                if(!object.events) object.events = {};
                                if(!object.events[value]) object.events[value] = [];
                                var events = object.events[value];
                                events[events.length] = {
                                    'callback': callback,
                                    'attach': typeIn(attach, "array") ? attach : {}
                                };
                                object.handler = function(event){
                                    handler.call(object, event);
                                };
                                if(object.attachEvent) object.attachEvent("on".concat(value), object.handler);
                                else if(object.addEventListener) object.addEventListener(value, object.handler, false);
                            });
                        });
                }
            }
            return this;
        },
        unbind: function(type, callback){
            this.each(function(object){
                if(object.events){
                    if(type){
                        if(typeIn(type, "string")) type = type.replace(/\s+/g, "").split(",");
                        if(typeIn(type, "array")){
                            type = small.lower(small.trim(type));
                            if(small.contain(type, eventList))
                                small.each(type, function(current){
                                    if(object.events[current])
                                        if(callback){
                                            var events = object.events[current], runFlag = true;
                                            small.each(events, function(key, value){
                                                if(value.callback == callback && runFlag){
                                                    if(value.detachEvent) value.detachEvent("on".concat(value), value.handler);
                                                    else if(value.removeEventListener) value.removeEventListener(value, value.handler, false);
                                                    delete events[key];
                                                    runFlag = false;
                                                }
                                            });
                                        }else{
                                            var owner = small(object);
                                            small.each(object.events[current], function(event){
                                                owner.unbind(current, event);
                                            });
                                            object.events[current] = [];
                                        }
                                });
                        }
                    }else{
                        var typeList = [];
                        small.each(object.events, function(key, value){
                            typeList[typeList.length] = key;
                        });
                        small(object).unbind(typeList);
                        object.events = {};
                    }
                }
            });
            return this;
        },
        once: function(type, callback, attach){
            var handler = function(event){
                callback.call(this, event);
                small(this).unbind(type, handler);
            };
            return this.bind(type, handler, attach);
        },
        hover: function(over, out){
            return this.bind("mouseover", over).bind("mouseout", out);
        },
        toggle: function(first, second){
            return this.each(function(object){
                object.toggleEvent = first;
            }).click(function(event){
                this.toggleEvent.call(this, event);
                this.toggleEvent = (this.toggleEvent == first) ? second : first;
            });
        },
        first: function(){
            return selectDom.call(this, "first");
        },
        last: function(){
            return selectDom.call(this, "last");
        },
        index: function(index){
            return selectDom.call(this, "index", index);
        },
        not: function(index){
            return selectDom.call(this, "not", index);
        },
        above: function(index){
            return selectDom.call(this, "above", index);
        },
        below: function(index){
            return selectDom.call(this, "below", index);
        },
        even: function(){
            return selectDom.call(this, "even");
        },
        visible: function(){
            return selectDom.call(this, "visible");
        },
        hidden: function(){
            return selectDom.call(this, "hidden");
        },
        checked: function(){
            return selectDom.call(this, "checked");
        },
        unchecked: function(){
            return selectDom.call(this, "unchecked");
        },
        disabled: function(){
            return selectDom.call(this, "disabled");
        },
        enabled: function(){
            return selectDom.call(this, "enabled");
        },
        selected: function(){
            return selectDom.call(this, "selected");
        },
        unselected: function(){
            return selectDom.call(this, "unselected");
        },
        editable: function(){
            return selectDom.call(this, "editable");
        },
        uneditable: function(){
            return selectDom.call(this, "uneditable");
        },
        length: function(){
            return this.nodes.length;
        },
        bound: function(){
            return this.length() > 0 ? small.bound(this.nodes[0]) : null;
        },
        start: function(options){
            if(typeIn(options, "object"))
                this.each(function(value){
                    var repeat = options.repeat || 1;
                    if(!value.timer) value.timer = [];
                    var timer = value.timer[value.timer.length] = window.setInterval(function(){
                        if(options.callback && repeat-- > 0) options.callback.call(value);
                        else window.clearInterval(timer);
                    }, options.time || 1);
                });
            return this;
        },
        stop: function(){
            return this.each(function(value){
                small.each(value.timer, function(timer){
                    window.clearInterval(timer);
                });
                value.timer = [];
            });
        },
        setClass: function(name){
            if(typeIn(name, "array")) name = name.join(" ");
            if(typeIn(name, "string"))
                this.each(function(value){
                    value.className = small.trim(name);
                });
            return this;
        },
        getClass: function(){
            return this.length() > 0 ? this.nodes[0].className : "";
        },
        hasClass: function(name){
            return typeIn(name, "string,array") && small.contain(name, this.getClass().split(" "));
        },
        addClass: function(name){
            if(typeIn(name, "string")) name = name.split(" ");
            if(typeIn(name, "array"))
                this.each(function(value){
                    name = small.merge(value.className.split(" "), name), name = small.unique(name), name = name.join(" "), value.className = name;
                });
            return this;
        },
        removeClass: function(name){
            return this.each(function(object){
                if(name){
                    name = typeIn(name, "string") ? [name] : name;
                    var classList = object.className.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ").split(" ");
                    classList = small.grep(classList, function(value){
                        return !small.contain(value, name);
                    });
                    object.className = classList.join(" ");
                }else object.className = "";
            });
        },
        toggleClass: function(name){
            if(typeIn(name, "string"))
                this.each(function(value){
                    if(value.className.indexOf(name) >= 0) small.removeClass(name);
                    else small.addClass(name);
                });
            return this;
        },
        css: function(){
            var data = arguments, length = data.length, result = length > 0 && typeIn(data[0], "string,object") ? this : null, matches;
            if(length == 1 && typeIn(data[0], "object"))
                this.each(function(object){
                    small.each(data[0], function(style, param){
                        small(object).css(style, param);
                    });
                });
            else if(length <= 2 && typeIn(data[0], "string")){
                data[0] = fix(data[0], "css");
                while ((matches = /\-([a-z]{1})/i.exec(data[0])) != null) data[0] = data[0].replace(matches[0], matches[1].toUpperCase());
                if(data[1]) this.each(function(object){
                    try {
                        object.style[data[0]] = data[1];
                    } catch(err){}
                });
                else result = this.length() > 0 ? this.nodes[0].style[data[0]] : null;
            }
            return result;
        },
        ajax: function(options){
            return xhr(this, options, "ajax");
        },
        json: function(options){
            return xhr(this, options, "json");
        },
        attr: function(){
            var result = null, data = arguments, length = data.length;
            if(length == 1 && typeIn(data[0], "string")) data[0] = fix(data[0], "attr"), result = this.length() > 0 ? this.nodes[0][data[0]] || this.nodes[0].getAttribute(data[0]) : null;
            else if(length == 1 && typeIn(data[0], "object") || (length == 2 && typeIn(data[0], "string") && typeIn(data[1], "string,number")))
                result = this.each(function(object){
                    if(length == 2)
                        try {
                            object[fix(data[0], "attr")] = data[1];
                        } catch(err){}
                    else
                        small.each(data[0], function(key, value){
                            small(object).attr(key, value);
                        });
                });
            return result;
        },
        removeAttr: function(attr){
            return this.length() > 0 ? this.each(function(object){
                object.removeAttribute(attr);
            }) : null;
        },
        id: function(){
            var data = arguments, length = data.length, result = length == 1 ? null : (this.length() > 0 && ("id" in this.nodes[0]) ? this.nodes[0].id : null);
            if(typeIn(data[0], "string")) 
                result = this.each(function(object){
                    object.setAttribute("id", data[0]);
                });
            return result;
        },
        opacity: function(number){
            var result = this;
            if(typeIn(number, "number"))
                number = Math.ceil(number), result = this.each(function(object){
                    if(small.browser() == "msie"){
                        object.style.zoom = 1;
                        object.style.filter = "alpha(opacity=".concat(number, ")");
                    } else object.style.opacity = (number / 100).toFixed(2);
                });
            return result;
        },
        hide: function(){
            return this.each(function(object){
                object.style.display = "none";
            });
        },
        show: function(type){
            type = typeIn(type, "string") ? type : "block";
            return this.each(function(object){
                object.style.display = type;
            });
        },
        find: function(selector){
            return typeIn(selector, "string") ? small.find(selector, this) : null;
        },
        condition: function(condition, callback1, callback2){
            if(typeIn(condition, "boolean")
                && ((condition && typeIn(callback1, "function")) || (!condition && typeIn(callback2, "function"))))
                this.each(function(object){
                    (condition ? callback1 : callback2).call(object);
                });
            return this;
        },
        isOwn: function(){
            return typeIn(this, "object") && typeIn(this.nodes, "array");
        },
        toString: function(){
            var result = "";
            this.each(function(object){
                result = result.concat("[", object.nodeName, object.id ? ", id=".concat(object.id) : "", object.className ? ", class=".concat(object.className) : "", "]\n");
            });
            return result.length > 0 ? result : "[Null]";
        }
    };
    small.context = function(callback, context){
        if(typeIn(callback, "function") && typeIn(context, "object")) callback.call(context);
    };
    small.create = function(line){
        var result = [];
        if(typeIn(line, "string")){
            var tag = line.match(/^[a-z]+\d*/), id = line.match(/#[0-9a-z_-]+/g), classes = line.match(/\.[0-9a-z_-]+/g), attrs = line.match(/\[[a-z0-9_-]+=[^\]]+\]/g), content = line.match(/:[^:]+$/g);
            if(tag){
                var search = [/^[a-z]+\d*/, /#[0-9a-z_-]+/g, /\.[0-9a-z_-]+/g, /\[[a-z0-9_-]+=[^\]]+\]/g, /:[^:]+$/g];
                small.each(search, function(regexp){
                    line = line.replace(regexp, "");
                });
                if(line.length == 0){
                    var object = document.createElement(tag[0]);
                    if(id) object.setAttribute("id", id[0].replace("#", ""));
                    if(classes && classes.length > 0) classes = small.proceed(classes, function(object){
                        return object.replace(".", "");
                    }), object.className = classes.join(" ");
                    if(attrs && attrs.length > 0) small.each(attrs, function(item){
                        var matches = /\[([a-z0-9_-]+)=([^\]]+)\]/.exec(item);
                        try {
                            object[fix(matches[1], "attr")] = matches[2];
                        } catch(err){}
                    });
                    if(content) object.appendChild(document.createTextNode(content[0].replace(/^:/, "")));
                    result = [object];
                }
            }
        }
        return new small(result);
    };
    small.head = function(){
        return small.find("head");
    };
    small.body = function(){
        return small.find("body");
    };
    small.document = function(){
        return small(document);
    };
    small.window = function(){
        return small(window);
    };
    small.browser = function(){
        return window.navigator.userAgent.toLowerCase().replace(/^.*(msie|firefox|chrome).*$/, '$1').replace(/^.*(opera|safari|mozilla).*$/, '$1');
    };
    small.version = function(){
        return window.navigator.userAgent.replace(/^.*(?:msie|firefox|chrome)(?:\s|\/)([\d\.]+).*$/i, '$1').replace(/^.*(?:version|mozilla)\/([\d\.]+).*$/i, '$1');
    };
    small.language = function(){
        return window.navigator.userLanguage;
    };
    small.start = function(options){
        var repeat = options.repeat || 1, timer = window.setInterval(function(){
            if(options.callback && repeat-- > 0) options.callback();
            else window.clearInterval(timer);
        }, options.time || 1);
        return timer;
    };
    small.stop = function(timer){
        window.clearInterval(timer);
    };
    small.each = function(object, callback){
        if(typeIn(object, "object,array") && object != null && typeIn(callback, "function") && callback.length < 3)
            if("length" in object){
                for(var index = 0; index < object.length; index++)
                    if(!typeIn(object[index], "undefined"))
                        if(callback.length == 1) callback.call(object, object[index]);
                        else callback.call(object, index, object[index]);
            }else
                for(var key in object)
                    if(callback.length == 1) callback.call(object, object[key]);
                    else callback.call(object, key, object[key]);
    };
    small.grep = function(object, callback){
        var array = [];
        if(typeIn(object, "object,array") && typeIn(callback, "function") && callback.length < 3)
            small.each(object, function(key, value){
                if((callback.length == 2 && callback.call(object, key, value)) || (callback.length == 1 && callback.call(object, value))) array[array.length] = value;
            });
        return array;
    };
    small.ajax = function(options){
        if(typeIn(options, "object")){
            var method = (options.method || "GET").toUpperCase(),
            url = options.url || small.url(),
            callback = options.callback || function(){},
            error = options.error || function(){},
            async = options.async || true,
            user = options.user || null,
            password = options.password || null,
            timeout = options.timeout || 0,
            types = {
                "html": "text/html",
                "text": "text/plain",
                "xml": "application/xml, text/xml",
                "json": "application/json, text/javascript",
                "script": "text/javascript, application/javascript",
                "default": "application/x-www-form-urlencoded"
            },
            contentType = types[options.contentType] || types['default'],
            charset = options.charset || "UTF-8",
            dataType = types[options.dataType] || "*\/*",
            requestHeaders = options.requestHeaders || null,
            params = null;
            if(options.params) 
                params = [], small.each(options.params, function(key, value){
                    params[params.length] = key.concat("=", encodeURIComponent(value));
                }), params = params.join("&");
            try {
                var request = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
                request.onreadystatechange = function(){
                    if(request.readyState == 4)
                        if(request.status == 200) callback(request.responseText, request);
                        else error(request.statusText, request);
                };
                request.open(method, method == "GET" && params ? url.concat(url.indexOf("?") > 0 ? "&" : "?", params) : url, async, user, password);
                request.setRequestHeader("Accept", dataType);
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                request.setRequestHeader("Content-Type", contentType.concat("; ", charset));
                if(requestHeaders) for(var name in requestHeaders) request.setRequestHeader(name, requestHeaders[name]);
                request.send(params);
                if(async && timeout > 0)
                    var timer = setTimeout(function(){
                        if(request.readyState != 4){
                            request.abort();
                            error("Time is out", request);
                            clearTimeout(timer);
                        }
                    }, timeout);
            } catch(err){
                error(err);
            }
        }
    };
    small.json = function(options){
        if(typeIn(options, "object")){
            var name = "", url = options.url || location.href, timeout = options.timeout || 0, params = [],
            alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", callback = options.callback || function(){};
            for(var index = 0; index < 15; index++) name += alpha.charAt(Math.ceil(Math.random() * alpha.length));
            params[params.length] = "callback=".concat(name);
            if(options.params)
                small.each(options.params, function(key, value){
                    params[params.length] = key.concat("=", encodeURIComponent(value));
                });
            var link = url.concat(url.indexOf("?") > 0 ? "&" : "?", params.join("&"));
            eval(name.concat(" = function(response){callback(response);small.removeScript(link);};"));
            small.loadScript(link);
            if(timeout > 0)
                var timer = setTimeout(function(){
                    small.removeScript(link);
                    clearTimeout(timer);
                }, timeout);
        }
    };
    small.loadCss = function(url){
        if(typeIn(url, "string") && !small.containCss(url))
            small("head").append("link").attr({
                "href": url,
                "type": "text/css",
                "rel": "stylesheet"
            });
    };
    small.removeCss = function(url){
        small("head").find("link[rel=stylesheet]").grep(function(object){
            return url ? object.href == url : true;
        }).remove();
    };
    small.listCss = function(){
        var list = [];
        small("head").find("link[rel=stylesheet]").each(function(object){
            list[list.length] = object.href;
        });
        return list;
    };
    small.containCss = function(url){
        return small.contain(url, small.listCss());
    };
    small.loadScript = function(url, callback){
        if(typeIn(url, "string") && typeIn(callback, "undefined,function"))
            if(!small.containScript(url)){
                var script = small("head").append("script").attr({
                    "src": url,
                    "type": "text/javascript"
                }).node();
                if(typeIn(callback, "function")){
                    var handler = function(){
                        if(script.readyState != "loading"){
                            if(script.detachEvent) script.detachEvent("onreadystatechange", handler);
                            else if(script.removeEventListener) script.removeEventListener("load", handler, false);
                            callback.call(script);
                        }
                    };
                    if(script.attachEvent) script.attachEvent("onreadystatechange", handler);
                    else if(script.addEventListener) script.addEventListener("load", handler, false);
                }
            }else small.each(small.listScript(), function(object){
                if(object == url) callback.call(object);
            });
    };
    small.removeScript = function(url){
        small("head").find("script").grep(function(object){
            return url ? object.href == url : true;
        }).remove();
    };
    small.listScript = function(){
        var list = [];
        small("head").find("script").each(function(object){
            list[list.length] = object.src;
        });
        return list;
    };
    small.containScript = function(url){
        return small.contain(url, small.listScript());
    };
    small.setCookie = function(options){
        if(typeIn(options, "object")){
            if(options.expires){
                var date = new Date();
                date.setTime(date.getTime() + options.expires * 86400000);
                options.expires = date.toGMTString();
            }
            document.cookie = options.name.concat("=", escape(options.value), ((options.expires) ? "; expires=".concat(options.expires) : ""),
                "; path=", ((options.path) ? options.path : "/"), ((options.domain) ? "; domain=".concat(options.domain) : ""), ((options.secure) ? "; secure" : ""));
        }
    };
    small.getCookie = function(name){
        var result = null;
        if(typeIn(name, "string")){
            var cookie = document.cookie, search = name.concat("="), start = 0, end = 0;
            if(cookie.length > 0 && (start = cookie.indexOf(search)) >= 0){
                end = cookie.indexOf(";", (start += search.length));
                if(end == -1) end = cookie.length;
                result = unescape(cookie.substring(start, end));
            }
        }
        return result;
    };
    small.removeCookie = function(options){
        if(typeIn(options, "object"))
            if(small.cookie.get(options.name))
                document.cookie = options.name.concat("=", ((options.path) ? "; path=".concat(options.path) : ""), ((options.domain) ? "; domain=".concat(options.domain) : ""), "; expires=Thu, 01-Jan-70 00:00:01 GMT");
    };
    small.enabledCookie = function(){
        return window.navigator.cookieEnabled;
    };
    small.ready = function(callback){
        small.window().load(callback);
    };
    small.find = function(selector, context){
        var result = null, list, length, index, item, objClasses, tags;
        if(!context) context = [document];
        if(typeIn(selector, "string") && typeIn(context, "object,array")){
            result = [], context = typeIn(context.nodes, "array") ? context.nodes : context, list = small.trim(selector.split(","));
            small.each(context, function(object){
                small.each(list, function(line){
                    var tag = line.match(/^[a-z]+\d*/), id = line.match(/[*^$!]*#[0-9a-z_-]+/g), classes = line.match(/[*^$!]*\.[0-9a-z_-]+/g), attrs = line.match(/\[[a-z0-9_-]+[*^$!]*=[^\]]+\]/g), content = line.match(/[*^$!]*:[^:]+$/g);
                    tag = tag ? tag[0].toUpperCase() : "*";
                    if(id) id = /([*^$!]*)#([0-9a-z_-]+)/.exec(id[0]);
                    if(classes) classes = small.proceed(classes, function(object){
                        return /([*^$!]*)\.([0-9a-z_-]+)/.exec(object);
                    });
                    if(attrs) attrs = small.proceed(attrs, function(object){
                        return /\[([a-z0-9_-]+)([*^$!]*)=([^\]]+)\]/.exec(object);
                    });
                    if(content) content = /([*^$!]*):([^:]+)$/.exec(content[0]);
                    tags = object.querySelectorAll ? object.querySelectorAll(tag) : object.getElementsByTagName(tag), length = tags.length;
                    for(index = 0; index < length; index++) result[index] = tags[index];
                    for(index = 0; index < length; index++){
                        item = result[index], objClasses = item.className ? small.trim(item.className.split(" ")) : [""];
                        if((id && (!item.id || !check(id[1], id[2], item.id)))
                            || (classes && small.grep(objClasses, function(curClass){
                                for(var curClasses = classes.concat(), flag = true, total = curClasses.length, num = 0; flag && num < total; num++) if(flag && !check(curClasses[num][1], curClasses[num][2], curClass)) flag = false, curClasses.splice(num, 1), num--, total--;
                                return flag;
                            }).length == 0)
                            || (attrs && small.grep([item], function(curObject){
                                for(var curAttrs = attrs.concat(), flag = true, total = curAttrs.length, num = 0; flag && num < total; num++) if(flag && (!check(curAttrs[num][2], curAttrs[num][3], curObject[curAttrs[num][1]] || curObject.getAttribute(curAttrs[num][1]), "condition"))) flag = false, curAttrs.splice(num, 1), num--, total--;
                                return flag;
                            }).length == 0)
                            || (content && !check(content[1], content[2], item.innerHTML, "condition"))) result.splice(index, 1), index--, length--;
                    }
                });
            });
            result = new small(result);
        }
        function check(type, line, value, method){
            var result = false;
            if(!method || method == "regexp") result = (new RegExp((/^(^|)$/.test(type) ? "^" : "").concat(line, /^($|)$/.test(type) ? "$" : ""))).test(value), result = type == "!" ? !result : result;
            else if(method == "condition") result = ((type == "" && line == value) || (type == "*" && value.indexOf(line) > 0) || (type == "^" && value.indexOf(line) == 0) || (type == "$" && value.indexOf(line) == value.length - line.length) || (type == "!" && line != value));
            return result;
        }
        return result;
    };
    small.trim = function(value, type){
        return proceed(value, function(object){
            var types = {
                "full": /^\s+|\s+$/g, 
                "left": /^\s+/g, 
                "right": /\s+$/g
            };
            return object.replace(types[typeIn(type, "string") && (type in types) ? type : "full"], "");
        });
    };
    small.decToHex = function(value){
        return proceed(value, function(object){
            return Number(object).toString(16);
        });
    };
    small.hexToDec = function(value){
        return proceed(value, function(object){
            return parseInt(object, 16);
        });
    };
    small.lower = function(value){
        return proceed(value, function(object){
            return object.toLowerCase();
        });
    };
    small.upper = function(value){
        return proceed(value, function(object){
            return object.toUpperCase();
        });
    };
    small.bound = function(object){
        var result = null;
        if(typeIn(object, "object")){
            var current = object, left = 0, top = 0;
            while (current){
                left += current.offsetLeft;
                top += current.offsetTop;
                current = current.offsetParent;
            }
            result = {
                'left': left,
                'top': top,
                'width': object.offsetWidth,
                'height': object.offsetHeight
            };
        }
        return result;
    };
    small.viewport = function(){
        return {
            'width': window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth),
            'height': window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight)
        };
    };
    small.page = function(){
        return {
            'width': (document.body.scrollWidth > document.body.offsetWidth) ? document.body.scrollWidth : document.body.offsetWidth,
            'height': (document.body.scrollHeight > document.body.offsetHeight) ? document.body.scrollHeight : document.body.offsetHeight,
            'left': self.pageXOffset ? self.pageXOffset : (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft),
            'top': self.pageYOffset ? self.pageYOffset : (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)
        };
    };
    small.center = function(){
        var screen = small.viewport(), page = small.page();
        return {
            'left': parseInt(screen.width / 2) + page.left,
            'top': parseInt(screen.height / 2) + page.top
        };
    };
    small.protocol = function(){
        return document.location.protocol;
    };
    small.port = function(){
        var port = document.location.port;
        return port == "" ? 80 : port;
    };
    small.domain = function(){
        return document.location.hostname;
    };
    small.base = function() {
        var result = document.location.protocol + "//" + document.location.hostname + "/";
        if (document.location.hostname == "localhost") {
            var position = null, query = document.location.href.replace(result, "");
            if ((position = query.indexOf("/")) > -1)
                result += query.substring(0, position) + "/";
        }
        return result;
    };
    small.url = function(){
        return document.location.href;
    };
    small.anchor = function(){
        var request = small.url(), position;
        return (position = request.indexOf("#")) > 0 ? request.substring(position + 1) : "";
    };
    small.urlParams = function(){
        var result = {}, request = small.url(), position,
        get = (position = request.indexOf("?")) > 0 ? get = request.substring(position + 1) : "",
        list = get.replace("#".concat(small.anchor()), "").split("&");
        small.each(list, function(value){
            var param = value.split("=");
            result[param[0]] = param[1];
        });
        return result;
    };
    small.redirect = function(link, unstore){
        if(typeIn(link, "string"))
            if(typeIn(unstore, "boolean") && unstore) document.location.replace(link);
            else document.location.href = link;
    };
    small.reload = function(withRequest){
        (typeIn(withRequest, "boolean") ? withRequest : true) ? document.location.reload() : (document.location.href = document.location.href);
    };
    small.contain = function(what, where){
        var result = false;
        if(typeIn(where, "object,array"))
            if(typeIn(what, "object,array"))
                small.each(what, function(current){
                    if(small.contain(current, where)) result = true;
                });
            else
                small.each(where, function(value){
                    if(value == what) result = true;
                });
        return result;
    };
    small.merge = function(){
        var result = arguments.length > 0 ? [] : null;
        small.each(arguments, function(object){
            result = result.concat(object);
        });
        return result;
    };
    small.unique = function(array){
        var result = [];
        if(typeIn(array, "object,array") && array.length)
            small.each(array, function(value){
                if(!small.contain(value, result)) result[result.length] = value;
            });
        return result;
    };
    small.shuffle = function(array, deep){
        if(typeIn(array, "object,array") && array.length){
            if(/^\d{,3}$/.test(deep)) deep = 1;
            for(var step = 0; step < deep; step++)
                for(var first = 0; first < array.length; first++){
                    var second = Math.ceil(Math.random() * (array.length - 1)), temp = array[first];
                    array[first] = array[second], array[second] = temp;
                }
        }
        return array;
    };
    var typeIn = small.typeIn = function(object, list){
        var result = false;
        if(typeof(list) == "string"){
            var type = typeof(object);
            if(type == "object") type = object instanceof Array ? "array" : "object";
            list = list.toLocaleString().replace(/\s+/g, "").split(",");
            var length = list.length;
            for(var index = 0; index < length; index++)
                if(type == list[index]){
                    result = true;
                    break;
                }
        }
        return result;
    };
    var proceed = small.proceed = function(object, callback){
        var result = null;
        if(typeIn(object, "string,number")) result = callback.call(object, object);
        else if(typeIn(object, "object,array")) small.each(object, function(key, current){
            object[key] = callback.call(object, current);
        }), result = object;
        return result;
    };
    var isOwn = function(object){
        return typeIn(object, "object") && typeIn(object.nodes, "array");
    };
    var joinDom = function(tag, type){
        var result = null, array = [];
        if(typeIn(tag, "string,object"))
            if(/^(append|prepend)$/.test(type))
                this.each(function(object){
                    if(typeIn(tag, "string")) array[array.length] = type == "append" ? object.appendChild(small.create(tag).node()) : object.insertBefore(small.create(tag).node(), object.firstChild);
                    else if(typeIn(tag, "object"))
                        if(typeIn(tag.nodes, "array"))
                            tag.each(function(current){
                                array[array.length] = type == "append" ? object.appendChild(current) : object.insertBefore(current, object.firstChild);
                            });
                        else array[array.length] =  type == "append" ? object.appendChild(tag) : array[array.length] = object.insertBefore(tag, object.firstChild);
                }), result = new small(array);
            else if(/^(append|prepend)To$/.test(type))
                result = typeIn(tag, "string") ? small.find(tag) : (isOwn(tag) ? tag : new small(tag)), type == "appendTo" ? result.append(this) : result.prepend(this);
            else if(/^(after|before)$/.test(type))
                this.each(function(object){
                    if(typeIn(tag, "string")) array[array.length] = object.parentNode.insertBefore(small.create(tag).node(), type == "after" ? object.nextSibling : object);
                    else if(typeIn(tag, "object"))
                        if(typeIn(tag.nodes, "array"))
                            tag.each(function(current){
                                array[array.length] = object.parentNode.insertBefore(current, type == "after" ? object.nextSibling : object);
                            });
                        else array[array.length] = object.parentNode.insertBefore(tag, type == "after" ? object.nextSibling : object);
                }), result = new small(array);
            else if(/^insert(After|Before)$/.test(type))
                result = typeIn(tag, "string") ? small.find(tag) : (isOwn(tag) ? tag : new small(tag)), type == "insertAfter" ? result.after(this) : result.before(this), this.nodes = result.nodes, result = this;
        return result;
    };
    var childDom = function(type){
        var array = [], getNext;
        if(/^(firstChild|lastChild|next|prev)$/.test(type))
            this.each(function(object){
                try {
                    if(type == "firstChild") array[array.length] = "childElementCount" in object ? object.firstElementChild : object.firstChild;
                    else if(type == "lastChild") array[array.length] = "childElementCount" in object ? object.lastElementChild : object.lastChild;
                    else if(type == "next") array[array.length] = "childElementCount" in object ? object.nextElementSibling : object.nextSibling;
                    else if(type == "prev") array[array.length] = "childElementCount" in object ? object.previousElementSibling : object.previousSibling;
                } catch(err){}
            });
        else if(/^(next|prev)All$/.test(type))
            this.each(function(object){
                if("childElementCount" in object){
                    if(type == "nextAll") getNext = function(object){
                        return object.nextElementSibling
                    }; else getNext = function(object){
                        return object.previousElementSibling
                    };
                }else{
                    if(type == "nextAll") getNext = function(object){
                        return object.nextSibling
                    }; else getNext = function(object){
                        return object.previousSibling
                    };
                }
                while ((object = getNext(object)) != null)
                    try {
                        array[array.length] = object;
                    } catch(err){}
            });
        return new small(array);
    };
    var selectDom = function(type, index){
        var result = null;
        if(/^(first|last)$/.test(type))
            this.nodes = this.length() > 0 ? (type == "first" ? [this.nodes[0]] : [this.nodes[this.length() - 1]]) : [], result = this;
        else if((/^(index|not|above|below)$/.test(type) && typeIn(index, "number")) || type == "even")
            result = this.grep(function(key, value){
                return type == "index" ? key == index : (type == "not" ? key != index : (type == "above" ? key < index : (type == "above" ? key > index : key % 2 == 0)));
            });
        else if(/^(visible|hidden)$/.test(type))
            result = this.grep(function(key, value){
                return type == "visible" ? (value.offsetWidth > 0 && value.offsetHeight > 0 && value.style.visibility != "hidden" && value.style.display != "none")
                : (value.offsetWidth == 0 || value.offsetHeight == 0 || value.style.visibility == "hidden" || value.style.display == "none");
            });
        else if(/^(checked|unchecked|disabled|enabled|selected|unselected|editable|uneditable)$/.test(type))
            result = this.grep(function(key, value){
                return /^(input|select)$/i.test(value.nodeName) && type == "checked" ? value.checked : (type == "unchecked" ? !value.checked : (type == "disabled" ? value.disabled : (type == "enabled" ? !value.disabled : (type == "selected" ? value.selected : (type == "unselected" ? !value.selected : (type == "editable" ? !value.readonly : value.readonly))))));
            });
        return result;
    };
    var xhr = function(object, options, type){
        var result = null;
        if(/^(ajax|json)$/.test(type) && typeIn(options, "object"))
            result = object.each(function(value){
                var callback = !options.callback ? function(response){
                    value.innerHTML = response;
                } : options.callback;
                options.callback = function(response){
                    callback.call(value, response)
                };
                type == "ajax" ? small.ajax(options) : small.json(options);
            });
        return result;
    };
    var fix = function(value, type){
        var fixes = {
            "attr": {
                "for": "htmlFor", 
                "usemap": "useMap", 
                "cellspacing": "cellSpacing", 
                "cellpadding": "cellPadding", 
                "colspan": "colSpan", 
                "rowspan": "rowSpan", 
                "valign": "vAlign", 
                "maxlength": "maxLength", 
                "readonly": "readOnly", 
                "tabindex": "tabIndex", 
                "accesskey": "accessKey", 
                "frameborder": "frameBorder", 
                "framespacing": "frameSpacing"
            },
            "css": {
                "float": "styleFloat"
            }
        }, matches;
        while((matches = /\-([a-z]{1})/i.exec(value)) != null)
            value = value.replace(matches[0], matches[1].toUpperCase());
        small.each(fixes[type], function(search, replace){
            value = value.replace(search, replace);
        });
        return value;
    };
    var handler = function(event){
        var object = this, event = event || window.event;
        if(event.isFixed) return event;
        event.isFixed = true, event.preventDefault = event.preventDefault || function(){
            event.returnValue = false;
        }, event.stopPropagation = event.stopPropagation || function(){
            event.cancelBubble = true;
        };
        if(!event.target) event.target = event.srcElement;
        if(!event.relatedTarget && event.fromElement) event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
        if(event.pageX == null && event.clientX != null){
            event.pageX = event.clientX + (document.documentElement && document.documentElement.scrollLeft || document.body && document.body.scrollLeft || 0) - (document.documentElement.clientLeft || 0);
            event.pageY = event.clientY + (document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop || 0) - (document.documentElement.clientTop || 0);
        }
        if(!event.which && event.button) event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
        small.each(object.events[event.type], function(handler){
            event.attach = handler.attach;
            if(!handler.callback.call(object, event)){
                event.preventDefault();
                event.stopPropagation();
            }
        });
    };
    var eventList = "resize,scroll,blur,focus,error,abort,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,keydown,keypress,keyup,load,unload,change,select,submit,reset".split(",");
    small.each(eventList, function(type){
        small.prototype[type] = function(callback, attach){
            this.bind(type, callback, attach);
            return this;
        };
    });
})();