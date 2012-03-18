/*
 * JS-Small JavaScript Framework Plugin 0.0.2
 * Description: Plug-in for wrapping long text nodes
 * Copyright (c) 2008 - 2011 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 * Thanks:           http://www.crowdersoftware.com/
 */
small.extendMethods({
    wrapText: function(max){
        if(small.typeIn(max, "undefined")) max = 10;
        var regExp = new RegExp("([^\\s]{1," + max + "})", "g");
        
        function walk(node) {
            var child, next, value, matches;
            switch (node.nodeType) {
                case 3: // Text node
                    value = node.nodeValue;
                    if(value.length > max){
                        matches = value.split(' ');
                        value = small.proceed(matches, function(item){
                            if(!/(&nbsp;|\s)/.test(item)
                                && !/(ht|f)tp(s?)\:\/\/[0-9a-z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/i.test(item)
                                && !/[0-9a-z]+[-\._0-9a-z]*@[0-9a-z]+[-\._^0-9a-z]*[0-9a-z]*[\.]{1}[a-z]{2,6}/i.test(item)){
                                var matches = item.replace('&shy;', '').match(regExp);
                                if(matches && matches.length > 1)
                                    item = item.length > max ? matches.join('\u00ad') : item;
                            }
                            return item;
                        }).join(' ');
                        node.parentNode.replaceChild(document.createTextNode(value), node);
                    }
                    break;
                case 1: // Element node
                case 9: // Document node
                    child = node.firstChild;
                    while (child) {
                        next = child.nextSibling;
                        if(!/script|style|textarea|input|select|button/i.test(child.nodeName))
                            walk(child);
                        child = next;
                    }
                    break;
            }
        }
        walk(this.node());
        return this;
    }
});
small.extendFunctions({
    wrapDocument: function(max){
        if(small.typeIn(max, "undefined")) max = 10;
        small.body().wrapText(max);
    }
});