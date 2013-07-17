/*
 * JS-Small JavaScript Framework Plugin
 * Description: Convert various data formats (JSON, XML)
 * Copyright (c) 2008 - 2012 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 * @author Denis Korolev
 * @version 0.0.2
 */
small.extendFunctions({
    jsonToString: function(json){
        var result = null, sub;

        if(!small.typeIn(json, "undefined")){
            switch(typeof(json)){
                case "object":
                    result = [];
                    small.each(json, function(key, value){
                        if((sub = small.jsonToString(value))){
                            result[result.length] = '"' + key + '":' + sub;
                        }
                    });
                    result = "{" + result.join(",") + "}";
                    break;
                case "boolean":
                    result = json ? "true" : "false";
                    break;
                case "function":
                    break;
                case "number":
                    result = new String(json);
                    break;
                case "string":
                    result = '"' + translater(json) + '"';
                    break;
                default:

            }
        }

        function translater(object){
            var specChars = {
                "\t": "t",
                "\n": "n",
                "\f": "f",
                "\r": "r"
            };
            var padList = ["", "000", "00", "0", ""];
            return object.replace(/(\t|\n|\f|\r)/g,function(str, m){
                return "\\\\" + specChars[m];
            }).replace(/([а-яё])/gi, function(str, m){
                    var letter = m.charCodeAt(0).toString(16);
                    return "\\u" + padList[letter.length] + letter;
                });
        }

        return result
    },
    stringToJson: function(string){
        var result = {};
        try{
            result = eval('('.concat(string, ')'));
        } catch(err){
        }
        return result;
    },
    xmlToJson: function(xml){
        //TODO It has to be realized
    },
    jsonToXml: function(json){
        //TODO It has to be realized
    }
});