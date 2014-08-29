/*
 * JS-Small JavaScript Framework Plugin
 * Description: Plug-in for validating data
 * Copyright (c) 2008 - 2014 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 * Thanks:           http://www.crowdersoftware.com/
 * @author Denis Korolev
 * @version 0.0.1
 */
small.extendFunctions({
    checkCardNumber: function(cardNumber) {
        if(!/^\d{13,19}$/.test(cardNumber)) {
            return false;
        }

        var sum = 0,
            length = cardNumber.length;

        for(var index = length; index > 0; index--) {
            var number = parseInt(cardNumber.substring(index - 1, index), 10);

            if(index % 2 != 0) {
                number *= 2;

                if(number > 9) {
                    number -= 9;
                }
            }

            sum += number;
        }

        return sum % 10 == 0;
    },
    getCardType: function(cardNumber) {
        var result = false,
            list = {
                'visa': "^4\\d{12}(?:\\d{3})?$",
                'master-card': "^5[1-5]\\d{14}$",
                'american-express': "^3[47]\\d{13}$",
                'dinners-club': "^3(?:0[0-5]|[68]\\d)\\d{11}$",
                'discover': "^6(?:011|5\\d{2})\\d{12}$",
                'jcb': "^(?:2131|1800|35\\d{3})\\d{11}$"
            };

        small.each(list, function(type, regexp) {
            regexp = new RegExp(regexp);

            if(regexp.test(cardNumber)) {
                result = type;
            }
        });

        return result;
    }
});