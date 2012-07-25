/*
 * JS-Small JavaScript Framework Plugin 0.0.1
 * Description: Plug-in for CSS refreshing on the fly
 * Copyright (c) 2008 - 2012 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 */
small.extendFunctions({
    cssOnFly: function(time) {
        time = small.typeIn(time, 'number') ? time : 1000;

        var list = [], regExp = new RegExp('^' + small.base(), 'i');
        small('head').find('link[rel=stylesheet]').each(function(object){
            if(regExp.test(object.href))
                list[list.length] = {
                    'url': object.href,
                    'tail': ''.concat(object.href.indexOf('?') > 0 ? '&' : '?', 'time='),
                    'last': null,
                    'object': object
                };
        });

        function refresh(){
            var current = (new Date()).getTime();
            small.start({
                'time': time,
                'callback': function(){
                    small.each(list, function(index, item){
                        var url = item.url.concat(item.tail, current);
                        try {
                            var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
                            request.onreadystatechange = function(){
                                if(request.readyState == 4 && request.status == 200){
                                    var matches = /Last-Modified:\s?([^\n]+)/ig.exec(request.getAllResponseHeaders()),
                                    modified =Date.parse(matches[1]);

                                    if(modified > list[index].last){
                                        list[index].last = modified;

                                        list[index].object.href = url;
                                    }
                                }
                            };

                            request.open('HEAD', url, true);
                            request.send(null);
                        } catch(err){}
                    });

                    refresh();
                }
            });
        }
        refresh();
    }
});