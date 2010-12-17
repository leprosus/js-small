/*
 * JS-Small JavaScript Framework Plugin 0.0.1
 * Description: Convert various type color models (RGB, HSV)
 * Copyright (c) 2008 - 2011 Denis Korolev
 * Special thank: Dmitry Gnatenko
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 */
small.extendFunctions({
    RGBtoHSV: function(red, green, blue){
        var result = null;
        if(red >= 0 && red < 256
            && green >= 0 && green < 256
            && blue >= 0 && blue < 256){

            var min = Math.min(Math.min(red, green), blue);
            var max = Math.max(Math.max(red, green), blue);
            var value = Math.round((max / 255) * 100);
            var saturation = (max == 0) ? 0 : Math.round(100 * (1 - min / max));
            var hue = 0;
            var shift = max - min;
            if(max == red) hue = 60 * (green - blue) / shift + (green < blue ? 360 : 0);
            else if (max == green) hue = 60 * (blue - red) / shift + 120;
            else if (max == blue) hue = 60 * (red - green) / shift + 240;
            hue = Math.round(hue);
            result = {
                "hue": hue,
                "saturation": saturation,
                "value": value
            };
        }
        
        return result;
    },
    HSVtoRGB: function (hue, saturation, value) {
        var result = null;
        if(hue >= 0 && hue <= 360
            && saturation >= 0 && saturation <= 100
            && value >= 0 && value <= 100){
            hue = hue / 360;
            saturation = saturation / 100;
            value = value / 100;

            if (saturation > 0) {
                var sector = hue * 6;
                var sectorFloor = Math.floor(sector);
                var var1 = value * (1 - saturation);
                var var2 = value * (1 - saturation * (sector - sectorFloor));
                var var3 = value * (1 - saturation * (1 - (sector - sectorFloor)));

                var redList = [value, var2, var1, var1, var3, value];
                var greenList = [var3, value, value, var2, var1, var1];
                var blueList = [var1, var1, var3, value, value, var2];
                var index = sectorFloor > 4 ? 5 : sectorFloor;

                result = {
                    "red": Math.round(redList[index] * 255),
                    "green": Math.round(greenList[index] * 255),
                    "blue": Math.round(blueList[index] * 255)
                };
            }else
                result = {
                    "red": Math.round(value * 255),
                    "green": Math.round(value * 255),
                    "blue": Math.round(value * 255)
                };
        }
        return result;
    },
    HEXtoRGB: function(hex){
        var result = null;
        if(/[\da-h]{6}/i.test(hex)){
            result = {
                "red": parseInt(hex.substring(0, 2), 16),
                "green": parseInt(hex.substring(2, 4), 16),
                "blue": parseInt(hex.substring(4, 6), 16)
            };
        }

        return result;
    },
    RGBtoHEX: function(red, green, blue){
        var result = null;
        if(red >= 0 && red < 256
            && green >= 0 && green < 256
            && blue >= 0 && blue < 256){
            red = (red = red.toString(16)) && red.length == 2 ? red : "0" + red;
            green = (green = green.toString(16)) && green.length == 2 ? green : "0" + green;
            blue = (blue = blue.toString(16)) && blue.length == 2 ? blue : "0" + blue;
            result = red + green + blue;
        }

        return result;
    }
});