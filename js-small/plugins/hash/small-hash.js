small.extendFunctions({
    encodeBase64: function(text){
        var result = "", utf = "",
        chr1, chr2, chr3, enc1, enc2, enc3, enc4,
        charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        text = text.replace(/\r\n/g, "\n");
        for (var index = 0; index < text.length; index++) {
            var c = text.charCodeAt(index);
            if (c < 128) utf += String.fromCharCode(c);
            else if((c > 127) && (c < 2048)) {
                utf += String.fromCharCode((c >> 6) | 192);
                utf += String.fromCharCode((c & 63) | 128);
            } else {
                utf += String.fromCharCode((c >> 12) | 224);
                utf += String.fromCharCode(((c >> 6) & 63) | 128);
                utf += String.fromCharCode((c & 63) | 128);
            }
        }
        text = utf, index = 0;
        while (index < text.length) {
            chr1 = text.charCodeAt(index++);
            chr2 = text.charCodeAt(index++);
            chr3 = text.charCodeAt(index++);
 
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
 
            if (isNaN(chr2)) enc3 = enc4 = 64;
            else if (isNaN(chr3)) enc4 = 64;
 
            result = result.concat(charset.charAt(enc1), charset.charAt(enc2), charset.charAt(enc3), charset.charAt(enc4));
        }
 
        return result;
    },
    decodeBase64: function (text) {
        var utf = "", result = "", index = 0,
        chr1, chr2, chr3, enc1, enc2, enc3, enc4,
        c1 = 0, c2 = 0, c3 = 0,
        charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        text = text.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
        while (index < text.length) {
            enc1 = charset.indexOf(text.charAt(index++));
            enc2 = charset.indexOf(text.charAt(index++));
            enc3 = charset.indexOf(text.charAt(index++));
            enc4 = charset.indexOf(text.charAt(index++));
 
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
 
            utf = utf + String.fromCharCode(chr1);
 
            if (enc3 != 64) utf = utf + String.fromCharCode(chr2);
            if (enc4 != 64) utf = utf + String.fromCharCode(chr3);
        }
 
        index = 0;
        while (index < utf.length) {
            c1 = utf.charCodeAt(index);
 
            if (c1 < 128) {
                result += String.fromCharCode(c1);
                index++;
            }else if((c1 > 191) && (c1 < 224)) {
                c2 = utf.charCodeAt(index+1);
                result += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                index += 2;
            }else {
                c2 = utf.charCodeAt(index+1);
                c3 = utf.charCodeAt(index+2);
                result += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                index += 3;
            }
        }
 
        return result;
    }
});