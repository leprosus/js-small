/*
 * JS-Small JavaScript Framework version 0.8.9
 * Copyright (c) 2008 - 2009 Denis Korolev
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
            if(typeIn(node, "string")) result = small.find("#" + node);
            else if(typeIn(node, "object")) result = typeIn(node.nodes, "object") ? node : new small([node]);
            return result;
        }
        this.nodes = node;
    };
    small.extend = function(object, properties) {
        if(typeIn(object, "object,function") && typeIn(properties, "object"))
            small.each(properties, function(key, value){
                try{
                    object[key] = value;
                }
                catch(err){}
            });
        return object;
    };
    small.extendFunctions = function(properties){
        small = small.extend(small, properties);
    };
    small.extendMethods = function(properties){
        small.extend(small.prototype, properties);
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
            if(typeIn(text, "string"))
                this.each(function(value){
                    try{
                        value.appendChild(document.createTextNode(text));
                    }catch(err){}
                });
            return this;
        },
        text: function(text){
            var result = null;
            if(typeIn(text, "undefined")) result = this.length() > 0 ? (typeIn(this.nodes[0].textContent, "undefined") ? this.nodes[0].innerHTML : this.nodes[0].textContent) : null;
            else if(typeIn(text, "string")) result = this.empty().concat(text);
            return result;
        },
        html: function(text){
            var result = null;
            if(typeIn(text, "undefined")) result = this.length() > 0 ? (typeIn(this.nodes[0].textContent, "undefined") ? this.nodes[0].innerHTML : this.nodes[0].textContent) : null;
            else if(typeIn(text, "string")){
                this.each(function(value){
                    value.innerHTML = text;
                });
                result = this;
            }
            return result;
        },
        empty: function(){
            var length = arguments.length;
            if(length == 0){
                this.each(function(object){
                    while(object.firstChild){
                        small(object.firstChild).unbind();
                        object.removeChild(object.firstChild);
                    }
                });
            }else if(length > 0){
                var callback = arguments;
                this.each(function(object){
                    var result = (typeIn(object.textContent, "undefined") ? object.innerHTML : object.textContent) == "" ? true : false;
                    if(length > 0 && ((length < 3 && result) || (length == 2 && !result)))
                        (result ? callback[0] : callback[1]).call(object);
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
                var childList = object.childNodes;
                for(var index = 0; index < childList.length; index++)
                    if(childList[index].nodeType == 1)
                        array[array.length] = childList[index];
            });
            return new small(array);
        },
        children: function(){
            var array = [], childList = this;
            do{
                childList = childList.child();
                array = small.merge(array, childList.nodes);
            }while(childList.length() > 0);
            return new small(array);
        },
        firstChild: function(){
            var array = [];
            this.each(function(object){
                try{
                    array[array.length] = "childElementCount" in object ? object.firstElementChild : object.firstChild;
                }catch(err){}
            });
            return new small(array);
        },
        lastChild: function(){
            var array = [];
            this.each(function(object){
                try{
                    array[array.length] = "childElementCount" in object ? object.lastElementChild : object.lastChild;
                }catch(err){}
            });
            return new small(array);
        },
        next: function(){
            var array = [];
            this.each(function(object){
                try{
                    array[array.length] = "childElementCount" in object ? object.nextElementSibling : object.nextSibling;
                }catch(err){}
            });
            return new small(array);
        },
        prev: function(){
            var array = [];
            this.each(function(object){
                try{
                    array[array.length] = "childElementCount" in object ? object.previousElementSibling : object.previousSibling;
                }catch(err){}
            });
            return new small(array);
        },
        nextAll: function(){
            var array = [];
            this.each(function(object){
                if("childElementCount" in object)
                    while((object = object.nextElementSibling) != null)
                        try{
                            array[array.length] = object;
                        }catch(err){}
                else
                    while((object = object.nextSibling) != null)
                        try{
                            array[array.length] = object;
                        }catch(err){}
            });
            return new small(array);
        },
        prevAll: function(){
            var array = [];
            this.each(function(object){
                if("childElementCount" in object)
                    while((object = object.previousElementSibling) != null)
                        try{
                            array[array.length] = object;
                        }catch(err){}
                else
                    while((object = object.previousSibling) != null)
                        try{
                            array[array.length] = object;
                        }catch(err){}
            });
            return new small(array);
        },
        siblings: function(){
            return this.parent().firstChild().nextAll();
        },
        unique: function(){
            //TODO need to be optimizated
            var list = this.nodes;
            for(var first = 0; first < list.length - 1; first++)
                for(var second = first + 1; second < list.length; second++)
                    if(list[first] == list[second]) list[second] = null;
            var array = [];
            for(var index = 0; index < list.length - 1; index++)
                if(list[index] != null) array[array.length] = list[index];
            return new small(array);
        },
        merge: function(object){
            var result = null;
            if(typeIn(object, "object") && typeIn(object.nodes, "object")){
                var list = [];
                this.each(function(current){
                    list[list.length] = current;
                })
                object.each(function(current){
                    list[list.length] = current;
                });
                result = new small(list);
            }
            return result;
        },
        append: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                var array = [];
                this.each(function(object){
                    if(typeIn(tag, "string")) array[array.length] = object.appendChild(document.createElement(tag));
                    else if(typeIn(tag, "object"))
                        if(typeIn(tag.nodes, "object"))
                            tag.each(function(current){
                                array[array.length] = object.appendChild(current);
                            });
                        else array[array.length] = object.appendChild(tag);
                });
                result = new small(array);
            }
            return result;
        },
        appendTo: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                var object = typeIn(tag, "string") ? small.find(tag) : new small(tag);
                object.append(this);
                result = object;
            }
            return result;
        },
        prepend: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                var array = [];
                this.each(function(object){
                    if(typeIn(tag, "string")) array[array.length] = object.insertBefore(document.createElement(tag), object.firstChild);
                    else if(typeIn(tag, "object"))
                        if(typeIn(tag.nodes, "object"))
                            tag.each(function(current){
                                array[array.length] = object.insertBefore(current, object.firstChild);
                            });
                        else array[array.length] = object.insertBefore(tag, object.firstChild);
                });
                result = new small(array);
            }
            return result;
        },
        prependTo: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                var object = typeIn(tag, "string") ? small.find(tag) : new small(tag);
                object.prepend(this);
                result = object;
            }
            return result;
        },
        exist: function(){
            var result = this.length() > 0 ? true : false;
            var length = arguments.length;
            if(length > 0 && ((length < 3 && result) || (length == 2 && !result))){
                var callback = result ? arguments[0] : arguments[1];
                if(result)
                    this.each(function(object){
                        callback.call(object);
                    });
                else callback();
            }
            return this.length() > 0 ? true : false;
        },
        serialize: function(){
            return this.length() > 0 ? (this.nodes[0].outerHTML || new XMLSerializer().serializeToString(this.nodes[0])) : null;
        },
        replace: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                result = this.before(tag);
                this.remove();
            }
            return result;
        },
        after: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                var array = [];
                this.each(function(object){
                    if(typeIn(tag, "string")) array[array.length] = object.parentNode.insertBefore(document.createElement(tag), object.nextSibling);
                    else if(typeIn(tag, "object"))
                        if(typeIn(tag.nodes, "object"))
                            tag.each(function(current){
                                array[array.length] = object.parentNode.insertBefore(current, object.nextSibling);
                            });
                        else array[array.length] = object.parentNode.insertBefore(tag, object.nextSibling);
                });
                result = new small(array);
            }
            return result;
        },
        before: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                var array = [];
                this.each(function(object){
                    if(typeIn(tag, "string")) array[array.length] = object.parentNode.insertBefore(document.createElement(tag), object);
                    else if(typeIn(tag, "object"))
                        if(typeIn(tag.nodes, "object"))
                            tag.each(function(current){
                                array[array.length] = object.parentNode.insertBefore(current, object);
                            });
                        else array[array.length] = object.parentNode.insertBefore(tag, object);
                });
                result = new small(array);
            }
            return result;
        },
        insertAfter: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                var object = typeIn(tag, "string") ? small.find(tag) : small(tag);
                object.after(this);
                this.nodes = object.nodes;
                result = this;
            }
            return result;
        },
        insertBefore: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                var object = typeIn(tag, "string") ? small.find(tag) : small(tag);
                object.before(this);
                this.nodes = object.nodes;
                result = this;
            }
            return result;
        },
        wrap: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                var include = (typeIn(tag, "object") && typeIn(tag.nodes, "object")) ? tag : small.create(tag);
                this.after(include);
                include.append(this);
                result = include;
            }
            return result;
        },
        wrapChild: function(tag){
            var result = null;
            if(typeIn(tag, "string,object")){
                var include = (typeIn(tag, "object") && typeIn(tag.nodes, "object")) ? tag : small.create(tag);
                var array = [];
                this.each(function(object){
                    var childList = object.childNodes;
                    for(var index = 0; index < childList.length; index++)
                        array[array.length] = childList[index];
                });
                var child = new small(array);
                include.append(child);
                this.append(include);
                result = include;
            }
            return result;
        },
        remove: function(){
            this.empty();
            this.each(function(object){
                small(object).unbind();
                if(object.parentNode) object.parentNode.removeChild(object);
            });
            return null;
        },
        bind: function(type, callback, attach){
            if(typeIn(callback, "function")){
                if(typeIn(type, "string")) type = type.replace(/\s+/g, "").split(",");
                if(typeIn(type, "object")){
                    type = small.lower(small.trim(type));
                    if(small.contain(type, eventList)){
                        this.each(function(object){
                            small.each(type, function(value){
                                if(!object.events) object.events = {};
                                if(!object.events[value]) object.events[value] = [];
                                var events = object.events[value];
                                events[events.length] = {
                                    'callback': callback,
                                    'attach': typeIn(attach, "object") ? attach : {}
                                };
                                object.handler = function(event){
                                    handler.call(object, event);
                                };
                                if(object.attachEvent) object.attachEvent("on" + value, object.handler);
                                else if(object.addEventListener) object.addEventListener(value, object.handler, false);
                            });
                        });
                    }
                }
            }
            return this;
        },
        unbind: function(type, callback){
            this.each(function(object){
                if(object.events){
                    if(typeIn(type, "undefined")){
                        var typeList = [];
                        small.each(object.events, function(key, value){
                            typeList[typeList.length] = key;
                        });
                        small(object).unbind(typeList);
                        object.events = {};
                    }else{
                        if(typeIn(type, "string")) type = type.replace(/\s+/g, "").split(",");
                        if(typeIn(type, "object")){
                            type = small.lower(small.trim(type));
                            if(small.contain(type, eventList))
                                small.each(type, function(current){
                                    if(object.events[current])
                                        if(typeIn(callback, "undefined")){
                                            var owner = small(object);
                                            small.each(object.events[current], function(event){
                                                owner.unbind(current, event);
                                            });
                                            object.events[current] = [];
                                        }else{
                                            var events = object.events[current], runFlag = true;
                                            small.each(events, function(key, value){
                                                if(value.callback == callback && runFlag){
                                                    if(value.detachEvent) value.detachEvent("on" + value, value.handler);
                                                    else if (value.removeEventListener) value.removeEventListener(value, value.handler, false);
                                                    delete events[key];
                                                    runFlag = false;
                                                }
                                            });
                                        }
                                });
                        }
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
            this.bind(type, handler, attach);
            return this;
        },
        hover: function(over, out){
            this.bind("mouseover", over).bind("mouseout", out);
            return this;
        },
        toggle: function(first, second){
            this.each(function(object){
                object.toggleEvent = first;
            }).click(function(event){
                this.toggleEvent.call(this, event);
                this.toggleEvent = (this.toggleEvent == first) ? second : first;
            });
            return this;
        },
        first: function(){
            this.nodes = this.length() > 0 ? [this.nodes[0]] : [];
            return this;
        },
        last: function(){
            this.nodes = this.length() > 0 ? [this.nodes[this.length() - 1]] : [];
            return this;
        },
        index: function(index){
            return typeIn(index, "number") ? this.grep(function(key, value){
                return (key == index);
            }) : null;
        },
        not: function(index){
            return typeIn(index, "number") ? this.grep(function(key, value){
                return (key != index);
            }) : null;
        },
        above: function(index){
            return typeIn(index, "number") ? this.grep(function(key, value){
                return (key < index);
            }) : null;
        },
        below: function(index){
            return typeIn(index, "number") ? this.grep(function(key, value){
                return (key > index);
            }) : null;
        },
        even: function(){
            this.nodes = this.length() > 0 ? this.grep(function(key, value){
                return (key % 2 == 0);
            }).nodes : [];
            return this;
        },
        visible: function(){
            this.nodes = this.length() > 0 ? this.grep(function(value){
                return (value.offsetWidth > 0 && value.offsetHeight > 0
                    && value.style.visibility != "hidden" && value.style.display != "none");
            }).nodes : [];
            return this;
        },
        hidden: function(){
            this.nodes = this.length() > 0 ? this.grep(function(value){
                return (value.offsetWidth == 0 || value.offsetHeight == 0
                    || value.style.visibility == "hidden" || value.style.display == "none");
            }).nodes : [];
            return this;
        },
        length: function(){
            return this.nodes.length;
        },
        bound: function(){
            return this.length() > 0 ? small.bound(this.nodes[0]) : null;
        },
        start: function(parameters){
            if(typeIn(parameters, "object"))
                this.each(function(value){
                    var repeat = parameters.repeat || 1;
                    if(typeIn(value.timer, "undefined")) value.timer = [];
                    var timer = value.timer[value.timer.length] = window.setInterval(function(){
                        if(parameters.callback && repeat-- > 0) parameters.callback.call(value);
                        else window.clearInterval(timer);
                    }, parameters.time || 1);
                });
            return this;
        },
        stop: function(){
            this.each(function(value){
                small.each(value.timer, function(timer){
                    window.clearInterval(timer);
                });
                value.timer = [];
            });
            return this;
        },
        setClass: function(name){
            if(typeIn(name, "object")) name = name.join(" ");
            if(typeIn(name, "string"))
                this.each(function(value){
                    value.className = small.trim(name);
                });
            return this;
        },
        getClass: function(){
            return this.length() > 0 ? this.nodes[0].className : null;
        },
        addClass: function(name){
            if(typeIn(name, "object")) name = name.join(" ");
            if(typeIn(name, "string"))
                this.each(function(value){
                    value.className = small.trim(value.className) + " " + name;
                });
            return this;
        },
        removeClass: function(name){
            this.each(function(object){
                if(typeIn(name, "undefined")) object.className = "";
                else{
                    name = typeIn(name, "string") ? [name] : name;
                    var classList = object.className.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ").split(" ");
                    classList = small.grep(classList, function(value){
                        return !small.contain(value, name);
                    });
                    object.className = classList.join(" ");
                }
            });
            return this;
        },
        toggleClass: function(name){
            if(typeIn(name, "string"))
                this.each(function(value){
                    if(value.className.indexOf(name) >= 0) small.removeClass(name);
                    else small.addClass(name);
                });
            return this;
        },
        css: function(name, value){
            var result = typeIn(name, "string,object") ? this : null;
            if(typeIn(name, "string")){
                while(name.indexOf("-") >= 0){
                    var matches = /\-([a-z]{1})/i.exec(name);
                    name = name.replace(matches[0], matches[1].toUpperCase());
                }
                if(typeIn(value, "undefined")) result = this.length() > 0 ? this.nodes[0].style[name] : null;
                else
                    this.each(function(object){
                        try{
                            object.style[name] = value;
                        }catch(err){}
                    });
            }else if(typeIn(name, "object"))
                this.each(function(object){
                    small.each(name, function(style, param){
                        small(object).css(style, param);
                    });
                });
            return result;
        },
        ajax: function(parameters){
            var result = null;
            if(typeIn(parameters, "object")){
                this.each(function(value){
                    parameters = small.extend(parameters, {
                        callback: function(response){
                            value.innerHTML = response;
                        }
                    });
                    small.ajax(parameters);
                });
                result = this;
            }
            return result;
        },
        getAttr: function(name){
            return (typeIn(name, "string") && this.length() > 0) ? this.nodes[0][name] : null;
        },
        setAttr: function(name, value){
            this.each(function(object){
                if(typeIn(name, "string") && typeIn(value, "string,number"))
                    try{
                        object[name] = value;
                    }catch(err){}
                else if(typeIn(name, "object") && typeIn(value, "undefined"))
                    small.each(name, function(key, value){
                        try{
                            object[key] = value;
                        }catch(err){}
                    });
            });
            return this;
        },
        removeAttr: function(name){
            if(typeIn(name, "string")) name = name.replace(/\s+/g, "").split(",");
            if(typeIn(name, "object"))
                this.each(function(object){
                    small.each(name, function(attr){
                        object[attr] = null;
                    });
                });
            return this;
        },
        setId: function(id){
            var result = null;
            if(typeIn(id, "string")){
                this.each(function(object){
                    object.setAttribute("id", id);
                });
                result = this;
            }
            return result;
        },
        getId: function(){
            return (this.length() > 0) ? this.id : null;
        },
        removeId: function(){
            return this.length() > 0 ? this.each(function(object){
                object.removeAttribute("id");
            }) : null;
        },
        setName: function(name){
            var result = null;
            if(typeIn(name, "string")){
                this.each(function(object){
                    object.setAttribute("name", name);
                });
                result = this;
            }
            return result;
        },
        getName: function(){
            return (this.length() > 0) ? this.nodes[0].getAttribute("name") : null;
        },
        removeName: function(){
            return this.length() > 0 ? this.each(function(object){
                object.removeAttribute("name");
            }) : null;
        },
        opacity: function(number){
            var result = null;
            if(typeIn(number, "number")){
                number = Math.ceil(number);
                this.each(function(object){
                    if(small.browser() == "msie"){
                        object.style.zoom = 1;
                        object.style.filter = "alpha(opacity=" + number + ")";
                    }else object.style.opacity = (number / 100).toFixed(2);
                });
                result = this;
            }
            return result;
        },
        hide: function(){
            this.each(function(object){
                object.style.display = "none";
            });
            return this;
        },
        show: function(type){
            type = typeIn(type, "string") ? type : "block";
            this.each(function(object){
                object.style.display = type;
            });
            return this;
        },
        checked: function(){
            this.nodes = this.length() > 0 ? this.grep(function(value){
                return (value.checked == true);
            }).nodes : [];
            return this;
        },
        unchecked: function(){
            this.nodes = this.length() > 0 ? this.grep(function(value){
                return (value.checked == false);
            }).nodes : [];
            return this;
        },
        disabled: function(){
            this.nodes = this.length() > 0 ? this.grep(function(value){
                return (value.disabled == true);
            }).nodes : [];
            return this;
        },
        enabled: function(){
            this.nodes = this.length() > 0 ? this.grep(function(value){
                return (value.disabled == false);
            }).nodes : [];
            return this;
        },
        selected: function(){
            this.nodes = this.length() > 0 ? this.grep(function(value){
                return (value.selected == true);
            }).nodes : [];
            return this;
        },
        unselected: function(){
            this.nodes = this.length() > 0 ? this.grep(function(value){
                return (value.selected == false);
            }).nodes : [];
            return this;
        },
        find: function(selector){
            return typeIn(selector, "string") ? small.find(selector, this) : null;
        },
        condition: function(condition, callback1, callback2){
            if(typeIn(condition, "boolean")
                && ((condition && typeIn(callback1, "function")) || (!condition && typeIn(callback2, "function")))){
                if(condition || (!condition && typeIn(callback2, "function"))){
                    var callback = condition ? callback1 : callback2;
                    this.each(function(object){
                        callback.call(object);
                    });
                }
            }
            return this;
        },
        toString: function(){
            var result = "";
            this.each(function(object){
                result += "[";
                result += object.nodeName;
                if(object.id) result += ", id=" + object.id;
                if(object.className) result += ", class=" + object.className;
                result += "]\n";
            });

            return result.length > 0 ? result : "[Null]";
        }
    };
    small.context = function(callback, context) {
        if(typeIn(callback, "function") && typeIn(context, "object")) callback.call(context);
    };
    small.create = function(tag){
        return new small(typeIn(tag, "string") ? [document.createElement(tag)] : []);
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
    small.browser =  function(){
        var userAgent = window.navigator.userAgent.toLowerCase();
        var type = /opera/.test(userAgent) ? "opera" :
        (/msie/.test(userAgent) ? "msie" :
            (/firefox/.test(userAgent) ? "firefox" :
                (/chrome/.test(userAgent) ? "chrome" :
                    (/safari/.test(userAgent) ? "safari" : "mozilla"))));
        return type;
    };
    small.version = function(){
        var userAgent = window.navigator.userAgent.toLowerCase();
        var type = small.browser();
        var version = null;
        if(type == "opera") version = userAgent.replace(/^.*opera\/([\d\.]+).*$/, '$1');
        else if(type == "msie") version = userAgent.replace(/^.*msie ([\d\.]+).*$/, '$1');
        else if(type == "firefox") version = userAgent.replace(/^.*firefox\/([\d\.]+).*$/, '$1');
        else if(type == "chrome") version = userAgent.replace(/^.*chrome\/([\d\.]+).*$/, '$1');
        else if(type == "safari") version = userAgent.replace(/^.*version\/([\d\.]+).*$/, '$1');
        else if(type == "mozilla") version = userAgent.replace(/^.*mozilla\/([\d\.]+).*$/, '$1');
        return version;
    };
    small.language = function(){
        return window.navigator.userLanguage;
    };
    small.start = function(parameters){
        var repeat = parameters.repeat || 1;
        var timer = window.setInterval(function(){
            if(parameters.callback && repeat-- > 0) parameters.callback();
            else window.clearInterval(timer);
        }, parameters.time || 1);
        return timer;
    };
    small.stop = function(timer){
        window.clearInterval(timer);
    };
    small.each = function(object, callback) {
        if(typeIn(object, "object") && typeIn(callback, "function") && callback.length < 3)
            if(typeIn(object.length, "undefined"))
                for(var key in object)
                    if(callback.length == 1) callback.call(object, object[key]);
                    else callback.call(object, key, object[key]);
            else
                for(var index = 0; index < object.length; index++)
                    if(!typeIn(object[index], "undefined"))
                        if(callback.length == 1) callback.call(object, object[index]);
                        else callback.call(object, index, object[index]);
    };
    small.grep = function(object, callback) {
        var array = [];
        if(typeIn(object, "object") && typeIn(callback, "function") && callback.length < 3)
            small.each(object, function(key, value){
                if((callback.length == 2 && callback(key, value))
                    || (callback.length == 1 && callback(value)))
                    array[array.length] = value;
            });
        return array;
    };
    small.ajax = function(parameters){
        if(typeIn(parameters, "object")){
            var method = (parameters.method || "GET").toUpperCase();
            var url = parameters.url || small.url();
            var callback = parameters.callback || function(){};
            var error = parameters.error || function(){};
            var async = parameters.async || true;
            var user = parameters.user || null;
            var password = parameters.password || null;
            var params = null;
            if(parameters.params){
                params = [];
                small.each(parameters.params, function(key, value){
                    params[params.length] = key + "=" + encodeURIComponent(value);
                });
                params = params.join("&");
            }
            var timeout = parameters.timeout || 0;
            var types = {
                'html': "text/html",
                'text': "text/plain",
                'xml': "application/xml, text/xml",
                'json': "application/json, text/javascript",
                'script': "text/javascript, application/javascript",
                'default': "application/x-www-form-urlencoded"
            };
            var contentType = types[parameters.contentType] || types['default'];
            var charset = parameters.charset || "UTF-8";
            var dataType = types[parameters.dataType] || "*\/*";
            var requestHeaders = parameters.requestHeaders || null;
            try {
                var request = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
                request.onreadystatechange = function(){
                    if(request.readyState == 4)
                        if(request.status == 200) callback(request.responseText, request);
                        else error(request.statusText, request);
                };
                request.open(method, method == "GET" && params ? url + (url.indexOf("?") > 0 ? "&" : "?") + params : url, async, user, password);
                request.setRequestHeader("Accept", dataType);
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                request.setRequestHeader("Content-Type", contentType + "; " + charset);
                if(requestHeaders)
                    for(var name in requestHeaders) request.setRequestHeader(name, requestHeaders[name]);
                request.send(params);
                if(async && timeout > 0)
                    var timer = setTimeout(function(){
                        if(request.readyState != 4){
                            request.abort();
                            error("Time is out", request);
                            clearTimeout(timer);
                        }
                    }, timeout);
            }catch(err){
                error(err);
            }
        }
    };
    small.json = function(parameters){
        if(typeIn(parameters, "object")){
            var name = "";
            var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            for(var index = 0; index < 15; index++)
                name += alpha.charAt(Math.ceil(Math.random() * alpha.length));
            var url = parameters.url || location.href;
            if(!parameters.callback) parameters.callback = function(){};
            var params = "callback=" + name;
            if(parameters.params){
                var items = [];
                small.each(parameters.params, function(key, value){
                    items[items.length] = key + "=" + encodeURIComponent(value);
                });
                params += ("&" + items.join("&"));
            }
            var timeout = parameters.timeout || 0;
            var link = params ? url + (url.indexOf("?") > 0 ? "&" : "?") + params : url;

            eval(name + " = function(response){parameters.callback(response);small.removeScript(link);};");
            small.loadScript(link);
            if(timeout > 0)
                var timer = setTimeout(function() {
                    small.removeScript(link);
                    clearTimeout(timer);
                }, timeout);
        }
    };
    small.loadCss = function(url){
        if(typeIn(url, "string") && !small.containCss(url)){
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = url;
            link.type = 'text/css';
            link.rel = 'stylesheet';
            head.appendChild(link);
        }
    };
    small.removeCss = function(url){
        var list, index, link;
        if(typeIn(url, "undefined")){
            list = small.listCss();
            for(index = list.length - 1; index >= 0; index--){
                link = list[index];
                if(link.rel == "stylesheet") link.parentNode.removeChild(link);
            }
        }else{
            if(typeIn(url, "string")){
                var head = document.getElementsByTagName('head')[0];
                list = head.getElementsByTagName('link');
                for(index = list.length - 1; index >= 0; index--){
                    link = list[index];
                    if(link.rel == "stylesheet" && link.href == url) head.removeChild(link);
                }
            }
        }
    };
    small.listCss = function(){
        var head = document.getElementsByTagName('head')[0];
        var list = head.getElementsByTagName('link');
        var result = [];
        for(var index = 0; index < list.length; index++)
            if(list[index].href) result[result.length] = list[index].href;
        return result;
    };
    small.containCss = function(url){
        return small.contain(url, small.listCss());
    };
    small.loadScript = function(url, callback){
        if(typeIn(url, "string") && typeIn(callback, "undefined,function")){
            if(!small.containScript(url)){
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.src = url;
                script.type = 'text/javascript';
                if(typeIn(callback, "function")){
                    var handler = function(){
                        if(script.readyState != "loading"){
                            if(script.detachEvent) script.detachEvent("onreadystatechange", handler);
                            else if (script.removeEventListener) script.removeEventListener("load", handler, false);
                            callback.call(script);
                        }
                    };
                    if(script.attachEvent) script.attachEvent("onreadystatechange", handler);
                    else if(script.addEventListener) script.addEventListener("load", handler, false);
                }
                head.appendChild(script);
            }else
                small.each(small.listScript(), function(object){
                    if(object == url) callback.call(object);
                });
        }
    };
    small.removeScript = function(url){
        var list, index;
        if(typeIn(url, "undefined")){
            list = small.listScript();
            for(index = list.length - 1; index >= 0; index--) small.removeScript(list[index]);
        }else if(typeIn(url, "string")){
            var head = document.getElementsByTagName('head')[0];
            list = head.getElementsByTagName('script');
            for(index = list.length - 1; index >= 0; index--){
                var script = list[index];
                if(script.src == url) script.parentNode.removeChild(script);
            }
        }
    };
    small.listScript = function(){
        var head = document.getElementsByTagName('head')[0];
        var list = head.getElementsByTagName('script');
        var result = [];
        for(var index = 0; index < list.length; index++)
            if(list[index].src) result[result.length] = list[index].src;
        return result;
    };
    small.containScript = function(url){
        return small.contain(url, small.listScript());
    };
    small.setCookie = function(parameters) {
        if(typeIn(parameters, "object")){
            if(parameters.expire){
                var date=new Date();
                date.setDate(date.getDate() + parameters.expire);
                parameters.expire = date.toGMTString();
            }
            document.cookie = parameters.name + "=" + escape(parameters.value)
            + ((parameters.expire) ? "; expires=" + parameters.expire : "")
            + "; path=" + ((parameters.path) ? parameters.path : "/")
            + ((parameters.domain) ? "; domain=" + parameters.domain : "")
            + ((parameters.secure) ? "; secure" : "");
        }
    };
    small.getCookie = function(name) {
        var result = null;
        if(typeIn(name, "string")){
            var cookie = document.cookie;
            var search = name + "=", start = 0, end = 0;
            if(cookie.length > 0)
                if((start = cookie.indexOf(search)) > 0){
                    start += search.length;
                    end = cookie.indexOf(";", start)
                    if(end == -1) end = cookie.length;
                    result = unescape(cookie.substring(start, end));
                }
        }
        return result;
    };
    small.removeCookie = function(parameters){
        if(typeIn(parameters, "object"))
            if(small.cookie.get(parameters.name))
                document.cookie = parameters.name + "=" +
                ((parameters.path) ? "; path=" + parameters.path : "") +
                ((parameters.domain) ? "; domain=" + parameters.domain : "") +
                "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    };
    small.enabledCookie = function(){
        return window.navigator.cookieEnabled;
    };
    small.ready = function(callback){
        if(window.attachEvent) window.attachEvent("onload", callback);
        else if(window.addEventListener) window.addEventListener("load", callback, false);
    };
    small.find = function(selector, context){
        //TODO the belowing need to be optimizated
        var result = null;
        if(typeIn(context, "undefined")) context = [document];
        if(typeIn(selector, "string") && typeIn(context, "object")){
            var array = [];
            context = typeIn(context.nodes, "object") ? context.nodes : context;
            var tagList, matches, length, index;
            var list = selector.split(",");
            small.each(context, function(object){
                small.each(list, function(value){
                    value = small.trim(value);
                    if(/\.{1}/.test(value)){
                        matches = /^([a-z0-9\-_]*|\*)\.([a-z0-9\-_\s]+)$/i.exec(value);
                        tagList = object.getElementsByTagName(matches[1] == "" ? "*" : matches[1].toUpperCase());
                        length = tagList.length;
                        for(index = 0; index < length; index++){
                            value = tagList[index];
                            if(small.trim(value.className) == matches[2]){
                                array[array.length] = tagList[index];
                            }
                        }
                    }else if(/#{1}/.test(value)){
                        matches = /^([a-z0-9\-_]*|\*)#([a-z0-9\-_]+)$/i.exec(value);
                        tagList = object.getElementsByTagName(matches[1] == "" ? "*" : matches[1].toUpperCase());
                        length = tagList.length;
                        for(index = 0; index < length; index++){
                            value = tagList[index];
                            if(typeIn(value.id, "string") && small.trim(value.id) == matches[2]){
                                array[array.length] = value;
                            }
                        }
                    }else if(/^([a-z0-9\-_]+|\*)$/i.test(value)){
                        tagList = object.getElementsByTagName(value.toUpperCase());
                        length = tagList.length;
                        for(index = 0; index < length; index++){
                            array[array.length] = tagList[index];
                        }
                    }else if(/\[+/.test(value)){
                        matches = /^([a-z0-9\-_]*|\*)\[([a-z]+)((|=|\*=|\^=|\$=|\!=)([a-z0-9\-_]*))?\]$/i.exec(value);
                        if(matches != null){
                            tagList = object.getElementsByTagName(matches[1] == "" ? "*" : matches[1].toUpperCase());
                            var attrName = matches[2];
                            var type = matches[4];
                            var attrValue = matches[5];
                            length = tagList.length;
                            for(index = 0; index < length; index++){
                                var current = tagList[index][attrName];
                                if(!typeIn(current, "undefined"))
                                    if(type == ""
                                        || (type == "=" && current == attrValue)
                                        || (type == "*=" && current.indexOf(attrValue) > 0)
                                        || (type == "^=" && current.indexOf(attrValue) == 0)
                                        || (type == "$=" && current.indexOf(attrValue) == current.length - attrValue.length)
                                        || (type == "!=" && current != attrValue))
                                        array[array.length] = tagList[index];
                            }
                        }
                    }
                });
            });
            result = new small(array);
        }
        return result;
    };
    small.trim = function(value){
        var result = null;
        if(typeIn(value, "string")) result = value.replace(/^\s+|\s+$/g, "");
        else if(typeIn(value, "object")){
            small.each(value, function(key, current){
                value[key] = small.trim(current);
            });
            result = value;
        }
        return result;
    };
    small.trimLeft = function(value){
        var result = null;
        if(typeIn(value, "string")) result = value.replace(/^\s+/, "");
        else if(typeIn(value, "object")){
            small.each(value, function(key, current){
                value[key] = small.trimLeft(current);
            });
            result = value;
        }
        return result;
    };
    small.trimRight = function(value){
        var result = null;
        if(typeIn(value, "string")) result = value.replace(/\s+$/, "");
        else if(typeIn(value, "object")){
            small.each(value, function(key, current){
                value[key] = small.trimRight(current);
            });
            result = value;
        }
        return result;
    };
    small.decToHex = function(value){
        var result = null;
        if(typeIn(value, "string")) result = Number(value).toString(16);
        else if(typeIn(value, "object")){
            small.each(value, function(key, current){
                value[key] = small.decToHex(current);
            });
            result = value;
        }
        return result;
    };
    small.hexToDec = function(value){
        var result = null;
        if(typeIn(value, "string")) result = parseInt(value, 16);
        else if(typeIn(value, "object")){
            small.each(value, function(key, current){
                value[key] = small.hexToDec(current);
            });
            result = value;
        }
        return result;
    };
    small.lower = function(value){
        var result = null;
        if(typeIn(value, "string")) result = value.toLowerCase();
        else if(typeIn(value, "object")){
            small.each(value, function(key, current){
                value[key] = small.lower(current);
            });
            result = value;
        }
        return result;
    };
    small.upper = function(value){
        var result = null;
        if(typeIn(value, "string")) result = value.toUpperCase();
        else if(typeIn(value, "object")){
            small.each(value, function(key, current){
                value[key] = small.upper(current);
            });
            result = value;
        }
        return result;
    };
    small.bound = function(object){
        var result = null;
        if(typeIn(object, "object")){
            var current = object;
            var left = 0, top = 0;
            while(current){
                left += current.offsetLeft;
                top += current.offsetTop;
                current = current.offsetParent;
            }
            var width = object.offsetWidth;
            var height = object.offsetHeight;
            result = {
                'left': left,
                'top': top,
                'width': width,
                'height': height
            };
        }
        return result;
    };
    small.viewport = function(){
        var width = window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth);
        var height = window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight);
        return {
            'width': width,
            'height': height
        };
    };
    small.page = function(){
        var width = (document.body.scrollWidth > document.body.offsetWidth) ? document.body.scrollWidth : document.body.offsetWidth;
        var height = (document.body.scrollHeight > document.body.offsetHeight) ? document.body.scrollHeight : document.body.offsetHeight;
        var left = self.pageXOffset ? self.pageXOffset : (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        var top = self.pageYOffset ? self.pageYOffset : (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        return {
            'width': width,
            'height': height,
            'left': left,
            'top': top
        };
    };
    small.scroll = function(){
        var width = (document.body.scrollWidth > document.body.offsetWidth) ? document.body.scrollWidth : document.body.offsetWidth;
        var height = (document.body.scrollHeight > document.body.offsetHeight) ? document.body.scrollHeight : document.body.offsetHeight;
        var left = self.pageXOffset ? self.pageXOffset : (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        var top = self.pageYOffset ? self.pageYOffset : (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        return {
            'width': width,
            'height': height,
            'left': left,
            'top': top
        };
    };
    small.center = function(){
        var screen = small.viewport();
        var page = small.page();
        var left = parseInt(screen.width / 2) + page.left;
        var top = parseInt(screen.height / 2) + page.top;

        return {
            'left': left,
            'top': top
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
    small.url = function(){
        return document.location.href;
    };
    small.anchor = function(){
        var request = small.url(), position;
        return (position = request.indexOf("#")) > 0 ? request.substring(position + 1) : "";
    };
    small.urlParams = function(){
        var result = {};
        var request = small.url();
        var position, get = (position = request.indexOf("?")) > 0 ? get = request.substring(position + 1) : "";
        var list = get.replace("#" + small.anchor(), "").split("&");
        small.each(list, function(value){
            var param = value.split("=");
            result[param[0]] = param[1];
        });
        return result;
    };
    small.redirect = function(link, unstore){
        if(typeIn(link, "string"))
            if(!typeIn(unstore, "undefined") && unstore == true) document.location.replace(link);
            else document.location.href = link;
    };
    small.reload = function(){
        document.location.reload();
    };
    small.contain = function(text, array){
        var result = null;
        if(typeIn(array, "object")){
            if(typeIn(text, "string")){
                result = false;
                small.each(array, function(value){
                    if(value == text) result = true;
                });
            }else if(typeIn(text, "object")){
                result = true;
                small.each(text, function(current){
                    if(!small.contain(current, array)) result = false;
                });
            }
        }
        return result;
    };
    small.merge = function(array1, array2){
        var result = null;
        if(typeIn(array1, "object") && typeIn(array2, "object")){
            var array = [];
            small.each(array1, function(object){
                array[array.length] = object;
            });
            small.each(array2, function(object){
                array[array.length] = object;
            });
            result = array;
        }
        return result;
    };
    small.unique = function(array){
        var result = [];
        if(typeIn(array, "object") && array.length)
            small.each(array, function(value){
                if(!small.contain(value, result))
                    result[result.length] = value;
            });
        return result;
    };
    small.shuffle = function(array, deep){
        if(typeIn(array, "object") && array.length){
            if(!typeIn(deep, "integer") || deep < 1 || deep > 255) deep = 1;
            for(var step = 0; step < deep; step++)
                for(var first = 0; first < array.length; first++){
                    var second = Math.ceil(Math.random() * (array.length - 1));
                    var temp = array[first];
                    array[first] = array[second];
                    array[second] = temp;
                }
        }
        return array;
    };
    function typeIn(object, list){
        var result = false;
        if(typeof list == "string"){
            var type = typeof object;
            list = list.replace(/\s+/g, "").split(",");
            var length = list.length;
            for(var index = 0; index < length; index++)
                if(type == list[index]){
                    result = true;
                    break;
                }
        }
        return result;
    }
    var handler = function(event){
        var object = this;
        event = event || window.event;
        if(event.isFixed) return event;
        event.isFixed = true;
        event.preventDefault = event.preventDefault || function(){
            object.returnValue = false;
        };
        event.stopPropagation = event.stopPropagation || function(){
            object.cancelBubble = true;
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
            if(handler.callback.call(object, event) == false){
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