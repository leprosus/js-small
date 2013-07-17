/*
 * JS-Small JavaScript Framework Plugin
 * Description: Plug-in can assees and generate passwords
 * Copyright (c) 2008 - 2012 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 * @author Denis Korolev
 * @version 0.1.0
 */
small.extendFunctions({
    assessPassword: function(password){
        var result = 0;
        if(small.typeIn(password, 'string,number')){
            var alpha = 'abcdefghijklmnopqrstuvwxyz', upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', simbols = '~`!@#$%^&*()-_+=', digits = '1234567890', totalChars = 0x7f - 0x20, alphaChars = alpha.length, upperChars = upper.length, simbolsChars = simbols.length, digitChars = digits.length, otherChars = totalChars - (alphaChars + upperChars + simbolsChars + digitChars);

            if(password.length > 0){
                var flags = {
                    'alpha': false,
                    'upper': false,
                    'simbol': false,
                    'digit': false,
                    'other': false
                }, length = password.length;

                for(var index = 0; index < length; index++){
                    var chars = password.charAt(index);

                    if(alpha.indexOf(chars) != -1){
                        flags.alpha = true;
                    } else if(upper.indexOf(chars) != -1){
                        flags.upper = true;
                    } else if(digits.indexOf(chars) != -1){
                        flags.digit = true;
                    } else if(simbols.indexOf(chars) != -1){
                        flags.simbol = true;
                    } else{
                        flags.other = true;
                    }

                }

                var charset = 0;
                if(flags.alpha){
                    charset += alphaChars;
                }
                if(flags.upper){
                    charset += upperChars;
                }
                if(flags.digit){
                    charset += digitChars;
                }
                if(flags.simbol){
                    charset += simbolsChars;
                }
                if(flags.other){
                    charset += otherChars;
                }

                var bits = Math.floor(Math.log(charset) * length / Math.log(2));
                if(bits < 32){
                    result = 1;
                } else if(bits < 64){
                    result = 2;
                } else if(bits < 128){
                    result = 3;
                } else{
                    result = 4;
                }
            }
        }
        return result;
    },
    generatePassword: function(length){
        length = small.typeIn(length, 'number') ? length : 8;
        var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', charsetLength = charset.length - 1, result = '';

        for(var index = 0; index < length; index++){
            result += charset.charAt(Math.random() * charsetLength);
        }

        return result;
    }
});
