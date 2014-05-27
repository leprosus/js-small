/*
 * JS-Small JavaScript Framework Plugin
 * Description: Plug-in for CSS refreshing on the fly
 * Copyright (c) 2008 - 2014 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 * @author Denis Korolev
 * @version 0.1.0
 */
(function() {
    small.extendFunctions({
        cssOnFly: function(time) {
            onFly('css', time);
        },
        jsOnFly: function(time) {
            onFly('js', time);
        },
        preloadImages: function() {
            var matches, preloader = [];
            for(var index = 0, length = document.styleSheets.length; index < length; index++) {
                try {
                    var sheet = document.styleSheets[index], CSSClasses = sheet.rules || sheet.cssRules;
                    small.each(CSSClasses, function(CSSStyle) {
                        if(CSSStyle.style.backgroundImage && (matches = CSSStyle.style.backgroundImage.match(/url\([^,]+\)/g))) {
                            small.each(matches, function(url) {
                                var image = new Image();

                                url = url.replace(/^url\(("|'|)|\/?("|'|)\)$/g, '');
                                if(!/^(ht|f)tp(s?)\:\/\//.test(url)) {
                                    url = sheet.href.replace(/[^\/]+$/, '') + url;
                                }
                                image.src = url;

                                preloader.push(image);
                            });
                        }
                    });
                } catch(error) {
                }
            }
        }
    });
    function onFly(type, time) {
        time = small.typeIn(time, 'number') ? time : 1000;

        var list = [], baseRegExp = new RegExp('^' + small.base(), 'i'), objects = new small([]), attr = '';

        if(type == 'css') {
            objects = small('head').find('link[rel=stylesheet]'), attr = 'href';
        } else if(type == 'js') {
            objects = small.document().find('script[src]'), attr = 'src';
        }

        objects.each(function(object) {
            if(baseRegExp.test(object[attr])) {
                list[list.length] = {
                    'url': object[attr],
                    'tail': ''.concat(object[attr].indexOf('?') > 0 ? '&' : '?', 'time='),
                    'last': null,
                    'object': object
                };
            }
        });
        refresh(type, attr, list, time);
    }

    function refresh(type, attr, list, time) {
        var current = (new Date()).getTime();
        small.start({
            'time': time,
            'callback': function() {
                small.each(list, function(index, item) {
                    var url = item.url.concat(item.tail, current);
                    try {
                        var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP')
                            : new XMLHttpRequest();
                        request.onreadystatechange = function() {
                            if(request.readyState == 4 && request.status == 200) {
                                var matches = /Last-Modified:\s?([^\n]+)/ig.exec(request.getAllResponseHeaders()), modified = Date.parse(matches[1] || 0);

                                if(modified > list[index].last) {
                                    list[index].last = modified;

                                    if(type == 'css') {
                                        small.removeCss(list[index].object[attr]);
                                        small.loadCss(url);
                                    } else if(type == 'js') {
                                        small.removeScript(list[index].object[attr]);
                                        small.loadScript(url);
                                    }
                                }
                            }
                        };

                        request.open('HEAD', url, true);
                        request.send(null);
                    } catch(err) {
                    }
                });

                refresh(type, attr, list, time);
            }
        });
    }
})();