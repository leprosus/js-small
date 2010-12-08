/*
 * JS-Small JavaScript Framework Plugin 0.0.1
 * Copyright (c) 2008 - 2011 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 */
small.extendFunctions({
    converButton: function(){
        var list = small.find("input[type=button]");
        list.each(function(object){
            //alert(small(object).bound().width);
        });
    }
});